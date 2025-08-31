import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { attendance, workers, users, groups } from '@/lib/db/schema'
import { eq, desc, gte } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get recent activity from last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const recentActivity = await db
      .select({
        id: attendance.id,
        workerName: users.firstName,
        status: attendance.status,
        groupName: groups.name,
        location: groups.location,
        checkInTime: attendance.checkInTime
      })
      .from(attendance)
      .innerJoin(workers, eq(attendance.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))
      .innerJoin(groups, eq(workers.groupId, groups.id))
      .where(gte(attendance.checkInTime, yesterday))
      .orderBy(desc(attendance.checkInTime))
      .limit(10)

    return NextResponse.json(
      { activity: recentActivity },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { activity: [] },
      { status: 200 }
    )
  }
}
