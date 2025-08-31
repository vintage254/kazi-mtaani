import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { groups, workers, attendance } from '@/lib/db/schema'
import { eq, count, and, gte } from 'drizzle-orm'
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

    // Get stats
    const [totalWorkersResult, activeGroupsResult] = await Promise.all([
      db.select({ count: count() }).from(workers).where(eq(workers.isActive, true)),
      db.select({ count: count() }).from(groups).where(eq(groups.status, 'active'))
    ])

    const totalWorkers = totalWorkersResult[0]?.count || 0
    const activeGroups = activeGroupsResult[0]?.count || 0

    // Calculate attendance rate for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const attendanceToday = await db
      .select({ count: count() })
      .from(attendance)
      .where(and(
        gte(attendance.checkInTime, today),
        eq(attendance.status, 'present')
      ))

    const attendanceRate = totalWorkers > 0 
      ? Math.round((attendanceToday[0]?.count || 0) / totalWorkers * 100)
      : 0

    return NextResponse.json(
      {
        totalWorkers,
        activeGroups,
        attendanceRate,
        pendingApprovals: 0 // Placeholder for now
      },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
