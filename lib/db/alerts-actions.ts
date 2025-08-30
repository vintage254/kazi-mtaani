'use server'

import { db } from './index'
import { alerts, workers, users, groups, attendance, payments } from './schema'
import { eq, and, desc, lte, gte, sql, isNull, count } from 'drizzle-orm'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Alert Management Actions
export async function getAllAlerts(filters?: {
  severity?: 'low' | 'medium' | 'high' | 'critical'
  isRead?: boolean
  type?: string
}) {
  const baseQuery = ensureDb()
    .select({
      id: alerts.id,
      type: alerts.type,
      title: alerts.title,
      description: alerts.description,
      severity: alerts.severity,
      isRead: alerts.isRead,
      resolvedAt: alerts.resolvedAt,
      createdAt: alerts.createdAt,
      workerName: users.firstName,
      workerLastName: users.lastName,
      groupName: groups.name
    })
    .from(alerts)
    .leftJoin(workers, eq(alerts.workerId, workers.id))
    .leftJoin(users, eq(workers.userId, users.id))
    .leftJoin(groups, eq(alerts.groupId, groups.id))

  const conditions = []
  
  if (filters?.severity) {
    conditions.push(eq(alerts.severity, filters.severity))
  }
  
  if (filters?.isRead !== undefined) {
    conditions.push(eq(alerts.isRead, filters.isRead))
  }
  
  if (filters?.type) {
    conditions.push(eq(alerts.type, filters.type))
  }

  if (conditions.length > 0) {
    return await baseQuery.where(and(...conditions)).orderBy(desc(alerts.createdAt))
  }

  return await baseQuery.orderBy(desc(alerts.createdAt))
}

export async function markAlertAsRead(alertId: number) {
  const result = await ensureDb()
    .update(alerts)
    .set({
      isRead: true
    })
    .where(eq(alerts.id, alertId))
    .returning({
      id: alerts.id,
      isRead: alerts.isRead
    })

  return result[0]
}

export async function resolveAlert(alertId: number) {
  const result = await ensureDb()
    .update(alerts)
    .set({
      isRead: true,
      resolvedAt: new Date()
    })
    .where(eq(alerts.id, alertId))
    .returning({
      id: alerts.id,
      isRead: alerts.isRead,
      resolvedAt: alerts.resolvedAt
    })

  return result[0]
}

export async function createAlert(alertData: {
  type: string
  title: string
  description?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  workerId?: number
  groupId?: number
}) {
  const result = await ensureDb()
    .insert(alerts)
    .values({
      type: alertData.type,
      title: alertData.title,
      description: alertData.description || null,
      severity: alertData.severity || 'medium',
      workerId: alertData.workerId || null,
      groupId: alertData.groupId || null,
      isRead: false,
      createdAt: new Date()
    })
    .returning({
      id: alerts.id,
      type: alerts.type,
      title: alerts.title,
      severity: alerts.severity
    })

  return result[0]
}

// Generate low attendance alerts
export async function generateLowAttendanceAlerts() {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // Get groups with low attendance (less than 70%)
  const groupAttendance = await ensureDb()
    .select({
      groupId: attendance.groupId,
      groupName: groups.name,
      totalWorkers: count(workers.id),
      presentCount: count(attendance.id)
    })
    .from(groups)
    .leftJoin(workers, eq(groups.id, workers.groupId))
    .leftJoin(attendance, and(
      eq(attendance.date, yesterday),
      eq(attendance.status, 'present')
    ))
    .groupBy(groups.id, groups.name)

  const lowAttendanceGroups = groupAttendance.filter((group: any) => {
    const attendanceRate = group.totalWorkers > 0 ? (group.presentCount / group.totalWorkers) : 0
    return attendanceRate < 0.7 && group.totalWorkers > 0
  })

  const alertPromises = lowAttendanceGroups.map((group: any) => 
    createAlert({
      type: 'low_attendance',
      title: 'Low Attendance Alert',
      description: `Group ${group.groupName} had ${((group.presentCount / group.totalWorkers) * 100).toFixed(1)}% attendance yesterday`,
      severity: 'high',
      groupId: group.groupId || undefined
    })
  )

  return await Promise.all(alertPromises)
}

// Generate payment pending alerts
export async function generatePaymentPendingAlerts() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // Get payments pending for more than 3 days
  const pendingPayments = await ensureDb()
    .select({
      id: payments.id,
      workerId: payments.workerId,
      groupId: payments.groupId,
      amount: payments.amount,
      period: payments.period,
      workerName: users.firstName,
      groupName: groups.name
    })
    .from(payments)
    .innerJoin(workers, eq(payments.workerId, workers.id))
    .innerJoin(users, eq(workers.userId, users.id))
    .innerJoin(groups, eq(payments.groupId, groups.id))
    .where(and(
      eq(payments.status, 'pending'),
      lte(payments.period, threeDaysAgo)
    ))

  const alertPromises = pendingPayments.map((payment: any) => 
    createAlert({
      type: 'payment_pending',
      title: 'Payment Overdue',
      description: `Payment of KSh ${payment.amount} for ${payment.workerName} (${payment.groupName}) is pending for more than 3 days`,
      severity: 'medium',
      workerId: payment.workerId || undefined,
      groupId: payment.groupId || undefined
    })
  )

  return await Promise.all(alertPromises)
}
