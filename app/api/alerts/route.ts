import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { alerts, groups, workers, users } from '@/lib/db/schema'
import { eq, desc, isNull } from 'drizzle-orm'
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

    // Get all alerts with related data
    const allAlerts = await db
      .select({
        id: alerts.id,
        type: alerts.type,
        title: alerts.title,
        description: alerts.description,
        severity: alerts.severity,
        workerName: users.firstName,
        groupName: groups.name,
        createdAt: alerts.createdAt,
        isRead: alerts.isRead,
        resolvedAt: alerts.resolvedAt
      })
      .from(alerts)
      .leftJoin(workers, eq(alerts.workerId, workers.id))
      .leftJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(alerts.groupId, groups.id))
      .orderBy(desc(alerts.createdAt))

    return NextResponse.json(
      { alerts: allAlerts },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
