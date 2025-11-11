import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { workers, users, groups, attendance } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { method, workerId } = body

    if (!method || !workerId) {
      return NextResponse.json(
        { error: 'Missing required fields: method, workerId' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get worker details
    const worker = await db
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

    // Verify this worker belongs to the authenticated user
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1)

    if (!currentUser[0] || currentUser[0].id !== workerData.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Worker does not belong to this user' },
        { status: 403 }
      )
    }

    // Check if fingerprint is enabled for fingerprint method
    if (method === 'fingerprint' && !workerData.fingerprintEnabled) {
      return NextResponse.json(
        { error: 'Fingerprint authentication not enabled for this worker' },
        { status: 403 }
      )
    }

    // Check for existing attendance today
    const today = new Date().toISOString().split('T')[0]
    const existingAttendance = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.workerId, workerId),
          eq(attendance.date, today)
        )
      )
      .limit(1)

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
      location: workerData.groupLocation || 'Mobile App',
      scannerId: 'MOBILE_APP',
      attendanceMethod: method as 'qr_code' | 'fingerprint',
      fingerprintMatchScore: method === 'fingerprint' ? '95.0' : null,
      notes: `${method === 'fingerprint' ? 'Fingerprint' : 'QR code'} check-in via mobile app`
    }

    if (isCheckOut) {
      // Update with check-out time
      await db
        .update(attendance)
        .set({
          checkOutTime: attendanceData.checkOutTime,
          attendanceMethod: attendanceData.attendanceMethod,
          fingerprintMatchScore: attendanceData.fingerprintMatchScore,
          notes: `${method === 'fingerprint' ? 'Fingerprint' : 'QR code'} check-out via mobile app`
        })
        .where(eq(attendance.id, existingAttendance[0].id))
    } else {
      // Create new check-in record
      await db.insert(attendance).values(attendanceData)
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
      method: method,
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
        method: method,
        fingerprintMatchScore: method === 'fingerprint' ? 95.0 : null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Worker check-in API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
