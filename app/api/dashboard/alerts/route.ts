import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { alerts, groups } from '@/lib/db/schema'
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

    // Get active alerts
    const activeAlerts = await db
      .select({
        id: alerts.id,
        title: alerts.title,
        description: alerts.description,
        severity: alerts.severity,
        groupName: groups.name
      })
      .from(alerts)
      .leftJoin(groups, eq(alerts.groupId, groups.id))
      .where(isNull(alerts.resolvedAt))
      .orderBy(desc(alerts.createdAt))
      .limit(10)

    return NextResponse.json(
      { alerts: activeAlerts },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching active alerts:', error)
    return NextResponse.json(
      { alerts: [] },
      { status: 200 }
    )
  }
}
