import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, groups, attendance } from '@/lib/db/schema'
import crypto from 'crypto'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Validate QR code data and security hash
function validateQRCode(qrData: any): boolean {
  try {
    const { workerId, groupId, securityHash, expirationDate } = qrData
    
    // Check if QR code has expired
    if (new Date(expirationDate) < new Date()) {
      return false
    }
    
    // Verify security hash
    const expectedHash = crypto.createHash('sha256')
      .update(`${workerId}-${groupId}-${process.env.QR_SECRET || 'default-secret'}`)
      .digest('hex')
    
    return securityHash === expectedHash
  } catch (error) {
    return false
  }
}

// POST /api/scanner - Handle QR code scans from external scanner machines
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrData, scannerId, scannerLocation, timestamp } = body

    // Validate required fields
    if (!qrData || !scannerId) {
      return NextResponse.json(
        { error: 'Missing required fields: qrData, scannerId' },
        { status: 400 }
      )
    }

    // Parse QR code data
    let parsedQRData
    try {
      parsedQRData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid QR code format' },
        { status: 400 }
      )
    }

    // Validate QR code security and expiration
    if (!validateQRCode(parsedQRData)) {
      return NextResponse.json(
        { error: 'Invalid or expired QR code' },
        { status: 401 }
      )
    }

    const { workerId, workerName, groupId } = parsedQRData

    // Verify worker exists and is assigned to the group
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
      .where(eq(workers.id, workerId))
      .limit(1)

    if (!worker[0]) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    const workerData = worker[0]

    // Verify worker is assigned to the correct group
    if (workerData.groupId !== groupId) {
      return NextResponse.json(
        { error: 'Worker not assigned to this group' },
        { status: 403 }
      )
    }

    // Check if worker already checked in today
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
      date: today,
      checkInTime: isCheckOut ? existingAttendance[0].checkInTime : new Date(),
      checkOutTime: isCheckOut ? new Date() : null,
      status: 'present' as const,
      location: scannerLocation || workerData.groupLocation || 'Unknown',
      scannerId: scannerId,
      notes: `Scanned by ${scannerId} at ${scannerLocation || 'worksite'}`
    }

    if (isCheckOut) {
      // Update existing record with check-out time
      await ensureDb()
        .update(attendance)
        .set({
          checkOutTime: attendanceData.checkOutTime,
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
        location: attendanceData.location
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Scanner API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/scanner - Health check for scanner machines
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Kazi Mtaani Scanner API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
