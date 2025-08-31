import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { alerts, groups, workers, attendance, payments } from '@/lib/db/schema'
import { eq, count, and, gte, lt } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function POST() {
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

    const alertsGenerated = []

    // Generate low attendance alerts
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const groupsWithLowAttendance = await db
      .select({
        groupId: groups.id,
        groupName: groups.name,
        totalWorkers: count(workers.id),
        presentWorkers: count(attendance.id)
      })
      .from(groups)
      .leftJoin(workers, eq(groups.id, workers.groupId))
      .leftJoin(attendance, and(
        eq(workers.id, attendance.workerId),
        gte(attendance.checkInTime, today),
        eq(attendance.status, 'present')
      ))
      .groupBy(groups.id, groups.name)

    for (const group of groupsWithLowAttendance) {
      const attendanceRate = group.totalWorkers > 0 
        ? (group.presentWorkers / group.totalWorkers) * 100 
        : 0

      if (attendanceRate < 70 && group.totalWorkers > 0) {
        await db.insert(alerts).values({
          type: 'low_attendance',
          title: `Low Attendance Alert`,
          description: `Group ${group.groupName} has ${attendanceRate.toFixed(1)}% attendance today`,
          severity: attendanceRate < 50 ? 'high' : 'medium',
          groupId: group.groupId
        })
        alertsGenerated.push(`Low attendance alert for ${group.groupName}`)
      }
    }

    // Generate payment pending alerts
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const pendingPayments = await db
      .select({
        workerId: payments.workerId,
        groupName: groups.name,
        amount: payments.amount,
        createdAt: payments.createdAt
      })
      .from(payments)
      .innerJoin(workers, eq(payments.workerId, workers.id))
      .innerJoin(groups, eq(workers.groupId, groups.id))
      .where(and(
        eq(payments.status, 'pending'),
        lt(payments.createdAt, threeDaysAgo)
      ))

    for (const payment of pendingPayments) {
      await db.insert(alerts).values({
        type: 'payment_pending',
        title: `Payment Overdue`,
        description: `Payment of KES ${payment.amount} is pending for more than 3 days`,
        severity: 'high',
        workerId: payment.workerId
      })
      alertsGenerated.push(`Payment pending alert for worker ${payment.workerId}`)
    }

    return NextResponse.json(
      { 
        success: true,
        alertsGenerated: alertsGenerated.length,
        details: alertsGenerated
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
    console.error('Error generating alerts:', error)
    return NextResponse.json(
      { error: 'Failed to generate alerts' },
      { status: 500 }
    )
  }
}
