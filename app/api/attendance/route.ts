import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { attendance, workers, users, groups } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const workerId = searchParams.get('workerId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status')
    const approvalStatus = searchParams.get('approvalStatus')

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const baseQuery = db
      .select({
        id: attendance.id,
        date: attendance.date,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        status: attendance.status,
        location: attendance.location,
        supervisorApproved: attendance.supervisorApproved,
        notes: attendance.notes,
        workerId: workers.id,
        workerName: users.firstName,
        workerLastName: users.lastName,
        groupId: groups.id,
        groupName: groups.name,
        groupLocation: groups.location,
        faceRecognitionScore: attendance.faceRecognitionScore,
        dailyRate: workers.dailyRate
      })
      .from(attendance)
      .innerJoin(workers, eq(attendance.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))
      .innerJoin(groups, eq(attendance.groupId, groups.id))

    // Apply filters
    const conditions = []
    
    if (groupId) {
      conditions.push(eq(attendance.groupId, parseInt(groupId)))
    }
    
    if (workerId) {
      conditions.push(eq(attendance.workerId, parseInt(workerId)))
    }
    
    if (dateFrom) {
      conditions.push(gte(attendance.checkInTime, new Date(dateFrom)))
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      conditions.push(lte(attendance.checkInTime, endDate))
    }
    
    if (status) {
      conditions.push(eq(attendance.status, status as 'present' | 'absent' | 'late'))
    }
    
    if (approvalStatus !== null && approvalStatus !== '') {
      conditions.push(eq(attendance.supervisorApproved, approvalStatus === 'true'))
    }

    const records = conditions.length > 0 
      ? await baseQuery.where(and(...conditions)).orderBy(desc(attendance.checkInTime))
      : await baseQuery.orderBy(desc(attendance.checkInTime))

    return NextResponse.json(
      { records },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}
