import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, workers, groups } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { getWorkerDashboardStats } from '@/lib/db/worker-actions'

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

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get worker data with explicit joins including supervisor info
    const workerResults = await db
      .select({
        id: workers.id,
        userId: workers.userId,
        groupId: workers.groupId,
        position: workers.position,
        dailyRate: workers.dailyRate,
        joinedAt: workers.joinedAt,
        isActive: workers.isActive,
        groupName: groups.name,
        groupLocation: groups.location,
        supervisorId: groups.supervisorId,
        supervisorFirstName: users.firstName,
        supervisorLastName: users.lastName
      })
      .from(workers)
      .leftJoin(groups, eq(workers.groupId, groups.id))
      .leftJoin(users, eq(groups.supervisorId, users.id))
      .where(eq(workers.userId, user.id))
    
    const workerData = workerResults[0]

    if (!workerData) {
      return NextResponse.json({
        stats: {
          daysWorked: 0,
          totalHours: 0,
          attendanceRate: 0,
          pendingPayments: 0
        },
        worker: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker',
          avatar: user.profileImage || "https://unsplash.com/photos/a-group-of-white-buttons-with-a-blue-background-k7-zL0MwczY",
          handle: user.firstName?.toLowerCase() || 'worker',
          status: "Offline",
          group: 'No Group Assigned',
          supervisor: 'No Supervisor'
        }
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    const stats = await getWorkerDashboardStats(workerData.id)

    const supervisorName = workerData.supervisorFirstName && workerData.supervisorLastName 
      ? `${workerData.supervisorFirstName} ${workerData.supervisorLastName}` 
      : workerData.supervisorFirstName || 'No Supervisor'

    const worker = {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker',
      avatar: user.profileImage || "https://unsplash.com/photos/a-group-of-white-buttons-with-a-blue-background-k7-zL0MwczY",
      handle: user.firstName?.toLowerCase() || 'worker',
      status: workerData.isActive ? "Online" : "Offline",
      group: workerData.groupName || 'No Group Assigned',
      supervisor: supervisorName,
      workerId: workerData.id
    }

    return NextResponse.json(
      { stats, worker },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching worker stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch worker stats' },
      { status: 500 }
    )
  }
}
