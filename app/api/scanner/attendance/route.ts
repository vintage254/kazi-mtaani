import { NextRequest, NextResponse } from 'next/server'
import { eq, and, gte, lte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { attendance, workers, users } from '@/lib/db/schema'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// GET /api/scanner/attendance - Get attendance records for a worker or date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workerId = searchParams.get('workerId')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = ensureDb()
      .select({
        id: attendance.id,
        workerId: attendance.workerId,
        workerName: users.firstName,
        workerLastName: users.lastName,
        date: attendance.date,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        status: attendance.status,
        location: attendance.location,
        notes: attendance.notes,
        scannerId: attendance.scannerId
      })
      .from(attendance)
      .innerJoin(workers, eq(attendance.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))

    // Apply filters
    const conditions = []
    
    if (workerId) {
      conditions.push(eq(attendance.workerId, parseInt(workerId)))
    }
    
    if (date) {
      conditions.push(eq(attendance.date, date))
    }
    
    if (startDate && endDate) {
      conditions.push(
        and(
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        )
      )
    }

    // Get the records based on conditions
    const records = conditions.length > 0 
      ? await query.where(and(...conditions)).limit(100)
      : await query.limit(100)

    // Calculate hours worked for each record
    const attendanceWithHours = records.map(record => {
      let hoursWorked = null
      if (record.checkInTime && record.checkOutTime) {
        const checkIn = new Date(record.checkInTime)
        const checkOut = new Date(record.checkOutTime)
        hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
        hoursWorked = Math.round(hoursWorked * 100) / 100
      }

      return {
        ...record,
        workerName: `${record.workerName} ${record.workerLastName}`,
        hoursWorked
      }
    })

    return NextResponse.json({
      success: true,
      attendance: attendanceWithHours,
      count: attendanceWithHours.length
    })

  } catch (error) {
    console.error('Attendance API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
