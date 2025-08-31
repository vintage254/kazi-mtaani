import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, workers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { getWorkerRecentActivity } from '@/lib/db/worker-actions'

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

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get worker data
    const workerData = await db.query.workers.findFirst({
      where: eq(workers.userId, user.id)
    })

    if (!workerData) {
      return NextResponse.json(
        { recentActivity: [] },
        { 
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }

    const recentActivity = await getWorkerRecentActivity(workerData.id, 5)

    return NextResponse.json(
      { recentActivity },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching worker activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch worker activity' },
      { status: 500 }
    )
  }
}
