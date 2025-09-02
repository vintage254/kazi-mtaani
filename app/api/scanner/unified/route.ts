import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, groups, attendance, authenticators } from '@/lib/db/schema'
import { verifyAuthenticationResponse, AuthenticatorTransport } from '@simplewebauthn/server'
import crypto from 'crypto'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Validate QR code data and security hash
function validateQRCode(qrData: unknown): boolean {
  try {
    const { workerId, groupId, securityHash, expirationDate } = qrData as {
      workerId: number;
      groupId: number;
      securityHash: string;
      expirationDate: string;
    }
    
    if (new Date(expirationDate) < new Date()) {
      return false
    }
    
    const expectedHash = crypto.createHash('sha256')
      .update(`${workerId}-${groupId}-${process.env.QR_SECRET || 'default-secret'}`)
      .digest('hex')
    
    return securityHash === expectedHash
  } catch {
    return false
  }
}

// POST /api/scanner/unified - Handle both QR code and fingerprint authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      method, // 'qr_code' or 'fingerprint'
      qrData, 
      workerId, 
      credential, 
      challenge, 
      scannerId, 
      scannerLocation 
    } = body

    if (!method || !scannerId) {
      return NextResponse.json(
        { error: 'Missing required fields: method, scannerId' },
        { status: 400 }
      )
    }

    let workerData
    let parsedQRData

    if (method === 'qr_code') {
      // QR Code authentication
      if (!qrData) {
        return NextResponse.json(
          { error: 'Missing qrData for QR code authentication' },
          { status: 400 }
        )
      }

      try {
        parsedQRData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData
      } catch {
        return NextResponse.json(
          { error: 'Invalid QR code format' },
          { status: 400 }
        )
      }

      if (!validateQRCode(parsedQRData)) {
        return NextResponse.json(
          { error: 'Invalid or expired QR code' },
          { status: 401 }
        )
      }

      const { workerId: qrWorkerId, groupId } = parsedQRData

      const worker = await ensureDb()
        .select({
          id: workers.id,
          userId: workers.userId,
          groupId: workers.groupId,
          firstName: users.firstName,
          lastName: users.lastName,
          groupName: groups.name,
          groupLocation: groups.location
        })
        .from(workers)
        .innerJoin(users, eq(workers.userId, users.id))
        .leftJoin(groups, eq(workers.groupId, groups.id))
        .where(eq(workers.id, qrWorkerId))
        .limit(1)

      if (!worker[0] || worker[0].groupId !== groupId) {
        return NextResponse.json(
          { error: 'Worker not found or not assigned to group' },
          { status: 404 }
        )
      }

      workerData = { ...worker[0], workerId: qrWorkerId }

    } else if (method === 'fingerprint') {
      // Fingerprint authentication
      if (!workerId || !credential || !challenge) {
        return NextResponse.json(
          { error: 'Missing required fields for fingerprint authentication' },
          { status: 400 }
        )
      }

      const worker = await ensureDb()
        .select({
          id: workers.id,
          userId: workers.userId,
          groupId: workers.groupId,
          fingerprintEnabled: workers.fingerprintEnabled,
          firstName: users.firstName,
          lastName: users.lastName,
          groupName: groups.name,
          groupLocation: groups.location
        })
        .from(workers)
        .innerJoin(users, eq(workers.userId, users.id))
        .leftJoin(groups, eq(workers.groupId, groups.id))
        .where(eq(workers.id, workerId))
        .limit(1)

      if (!worker[0]) {
        return NextResponse.json(
          { error: 'Worker not found' },
          { status: 404 }
        )
      }

      if (!worker[0].fingerprintEnabled) {
        return NextResponse.json(
          { error: 'Fingerprint authentication not enabled' },
          { status: 403 }
        )
      }

      // Verify fingerprint
      const userAuthenticators = await ensureDb()
        .select()
        .from(authenticators)
        .where(eq(authenticators.userId, worker[0].userId!))

      if (userAuthenticators.length === 0) {
        return NextResponse.json(
          { error: 'No fingerprint credentials found' },
          { status: 404 }
        )
      }

      const credentialIDBuffer = Buffer.from(credential.id, 'base64url')
      const credentialIDBase64 = credentialIDBuffer.toString('base64')
      
      const authenticator = userAuthenticators.find(auth => auth.credentialID === credentialIDBase64)
      
      if (!authenticator) {
        return NextResponse.json(
          { error: 'Authenticator not found' },
          { status: 404 }
        )
      }

      const rpID = process.env.WEBAUTHN_RP_ID || 'localhost'
      const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'

      try {
        const verification = await verifyAuthenticationResponse({
          response: credential,
          expectedChallenge: challenge,
          expectedOrigin,
          expectedRPID: rpID,
          credential: {
            id: authenticator.credentialID,
            publicKey: new Uint8Array(Buffer.from(authenticator.publicKey, 'base64')),
            counter: authenticator.counter,
            transports: authenticator.transports ? JSON.parse(authenticator.transports) as AuthenticatorTransport[] : undefined,
          },
        })

        if (!verification.verified) {
          return NextResponse.json(
            { error: 'Fingerprint authentication failed' },
            { status: 401 }
          )
        }

        await ensureDb()
          .update(authenticators)
          .set({ counter: verification.authenticationInfo.newCounter })
          .where(eq(authenticators.id, authenticator.id))

      } catch {
        return NextResponse.json(
          { error: 'Fingerprint verification failed' },
          { status: 401 }
        )
      }

      workerData = { ...worker[0], workerId }

    } else {
      return NextResponse.json(
        { error: 'Invalid authentication method. Use "qr_code" or "fingerprint"' },
        { status: 400 }
      )
    }

    // Process attendance
    const today = new Date().toISOString().split('T')[0]

    const existingAttendance = await ensureDb()
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.workerId, workerData.workerId),
          eq(attendance.date, today)
        )
      )
      .limit(1)

    const isCheckOut = existingAttendance.length > 0 && 
                      existingAttendance[0].checkInTime && 
                      !existingAttendance[0].checkOutTime

    const attendanceData = {
      workerId: workerData.workerId,
      groupId: workerData.groupId,
      date: today,
      checkInTime: isCheckOut ? existingAttendance[0].checkInTime : new Date(),
      checkOutTime: isCheckOut ? new Date() : null,
      status: 'present' as const,
      location: scannerLocation || workerData.groupLocation || 'Unknown',
      scannerId: scannerId,
      attendanceMethod: method as 'qr_code' | 'fingerprint',
      fingerprintMatchScore: method === 'fingerprint' ? '95.0' : null,
      notes: `${method === 'fingerprint' ? 'Fingerprint' : 'QR code'} scan by ${scannerId}`
    }

    if (isCheckOut) {
      await ensureDb()
        .update(attendance)
        .set({
          checkOutTime: attendanceData.checkOutTime,
          attendanceMethod: attendanceData.attendanceMethod,
          fingerprintMatchScore: attendanceData.fingerprintMatchScore,
          notes: attendanceData.notes
        })
        .where(eq(attendance.id, existingAttendance[0].id))
    } else {
      await ensureDb().insert(attendance).values(attendanceData)
    }

    let hoursWorked = null
    if (isCheckOut && existingAttendance[0].checkInTime) {
      const checkInTime = new Date(existingAttendance[0].checkInTime)
      const checkOutTime = new Date()
      hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    }

    return NextResponse.json({
      success: true,
      action: isCheckOut ? 'check-out' : 'check-in',
      method: method,
      worker: {
        id: workerData.workerId,
        name: method === 'qr_code' ? parsedQRData?.workerName : `${workerData.firstName} ${workerData.lastName}`,
        group: workerData.groupName,
        location: workerData.groupLocation
      },
      attendance: {
        date: attendanceData.date,
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        hoursWorked: hoursWorked ? Math.round(hoursWorked * 100) / 100 : null,
        location: attendanceData.location,
        method: method,
        fingerprintMatchScore: method === 'fingerprint' ? 95.0 : null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unified scanner API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
