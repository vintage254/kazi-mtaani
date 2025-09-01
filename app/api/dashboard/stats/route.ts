import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { workers, groups, attendance } from '@/lib/db/schema'
import { count, eq, and, gte } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { createMissingWorkerRecords, cleanupDuplicateWorkers } from '@/lib/db/actions'

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

    // Clean up duplicate worker records first
    await cleanupDuplicateWorkers()
    
    // Ensure worker records exist for all users with worker role
    await createMissingWorkerRecords()

    // Get stats - count all workers, not just active ones
    const [totalWorkersResult, activeGroupsResult] = await Promise.all([
      db.select({ count: count() }).from(workers),
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

    // Get pending approvals - attendance records that need supervisor approval
    const pendingApprovalsResult = await db
      .select({ count: count() })
      .from(attendance)
      .where(eq(attendance.supervisorApproved, false))

    const attendanceRate = totalWorkers > 0 
      ? Math.round((attendanceToday[0]?.count || 0) / totalWorkers * 100)
      : 0

    return NextResponse.json(
      {
        totalWorkers,
        activeGroups,
        attendanceRate,
        pendingApprovals: pendingApprovalsResult[0]?.count || 0
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
