import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, groups, attendance, authenticators } from '@/lib/db/schema'
import { verifyAuthenticationResponse, AuthenticatorTransport } from '@simplewebauthn/server'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// POST /api/scanner/fingerprint - Handle fingerprint authentication from scanner machines
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      workerId, 
      credential, 
      challenge, 
      scannerId, 
      scannerLocation 
    } = body

    // Validate required fields
    if (!workerId || !credential || !challenge || !scannerId) {
      return NextResponse.json(
        { error: 'Missing required fields: workerId, credential, challenge, scannerId' },
        { status: 400 }
      )
    }

    // Get worker and their authenticators
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

    const workerData = worker[0]

    // Check if fingerprint is enabled for this worker
    if (!workerData.fingerprintEnabled) {
      return NextResponse.json(
        { error: 'Fingerprint authentication not enabled for this worker' },
        { status: 403 }
      )
    }

    // Get worker's authenticators
    const userAuthenticators = await ensureDb()
      .select()
      .from(authenticators)
      .where(eq(authenticators.userId, workerData.userId!))

    if (userAuthenticators.length === 0) {
      return NextResponse.json(
        { error: 'No fingerprint credentials found for worker' },
        { status: 404 }
      )
    }

    // Find matching authenticator
    const credentialIDBuffer = Buffer.from(credential.id, 'base64url')
    const credentialIDBase64 = credentialIDBuffer.toString('base64')
    
    const authenticator = userAuthenticators.find(auth => auth.credentialID === credentialIDBase64)
    
    if (!authenticator) {
      return NextResponse.json(
        { error: 'Authenticator not found for this credential' },
        { status: 404 }
      )
    }

    // Verify fingerprint authentication
    const rpID = process.env.WEBAUTHN_RP_ID || 'localhost'
    const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'

    try {
      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: challenge,
        expectedOrigin,
        expectedRPID: rpID,
        credential: {
          id: new Uint8Array(Buffer.from(authenticator.credentialID, 'base64')),
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

      // Update authenticator counter
      await ensureDb()
        .update(authenticators)
        .set({ counter: verification.authenticationInfo.newCounter })
        .where(eq(authenticators.id, authenticator.id))

    } catch (error) {
      console.error('Fingerprint verification error:', error)
      return NextResponse.json(
        { error: 'Fingerprint verification failed' },
        { status: 401 }
      )
    }

    // Process attendance (same logic as QR code scanner)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    const existingAttendance = await ensureDb()
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.workerId, workerId),
          eq(attendance.date, today)
        )
      )
      .limit(1)

    // Determine if this is check-in or check-out
    const isCheckOut = existingAttendance.length > 0 && 
                      existingAttendance[0].checkInTime && 
                      !existingAttendance[0].checkOutTime

    const attendanceData = {
      workerId: workerId,
      groupId: workerData.groupId,
      date: today,
      checkInTime: isCheckOut ? existingAttendance[0].checkInTime : new Date(),
      checkOutTime: isCheckOut ? new Date() : null,
      status: 'present' as const,
      location: scannerLocation || workerData.groupLocation || 'Unknown',
      scannerId: scannerId,
      attendanceMethod: 'fingerprint' as const,
      fingerprintMatchScore: '95.0', // High confidence score for successful WebAuthn verification
      notes: `Fingerprint scan by ${scannerId} at ${scannerLocation || 'worksite'}`
    }

    if (isCheckOut) {
      // Update existing record with check-out time
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
      // Create new attendance record for check-in
      await ensureDb().insert(attendance).values(attendanceData)
    }

    // Calculate hours worked if checking out
    let hoursWorked = null
    if (isCheckOut && existingAttendance[0].checkInTime) {
      const checkInTime = new Date(existingAttendance[0].checkInTime)
      const checkOutTime = new Date()
      hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    }

    return NextResponse.json({
      success: true,
      action: isCheckOut ? 'check-out' : 'check-in',
      method: 'fingerprint',
      worker: {
        id: workerData.id,
        name: `${workerData.firstName} ${workerData.lastName}`,
        group: workerData.groupName,
        location: workerData.groupLocation
      },
      attendance: {
        date: attendanceData.date,
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        hoursWorked: hoursWorked ? Math.round(hoursWorked * 100) / 100 : null,
        location: attendanceData.location,
        fingerprintMatchScore: 95.0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Scanner fingerprint API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/scanner/fingerprint - Get fingerprint scanner status
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Fingerprint Scanner API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    supportedMethods: ['fingerprint'],
    requirements: ['WebAuthn compatible scanner', 'Worker fingerprint enrollment']
  })
}
