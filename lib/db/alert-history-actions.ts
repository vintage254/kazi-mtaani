'use server'

import { db } from './index'
import { alerts, workers, users, groups } from './schema'
import { eq, and, desc, lte, gte, isNull, count, sql } from 'drizzle-orm'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Alert History Management
export async function getAlertHistory(filters?: {
  dateFrom?: string
  dateTo?: string
  type?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}) {
  const query = ensureDb()
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
  
  if (filters?.dateFrom) {
    conditions.push(gte(alerts.createdAt, new Date(filters.dateFrom)))
  }
  
  if (filters?.dateTo) {
    conditions.push(lte(alerts.createdAt, new Date(filters.dateTo)))
  }
  
  if (filters?.type) {
    conditions.push(eq(alerts.type, filters.type))
  }
  
  if (filters?.severity) {
    conditions.push(eq(alerts.severity, filters.severity))
  }

  if (conditions.length > 0) {
    return await query.where(and(...conditions)).orderBy(desc(alerts.createdAt))
  }

  return await query.orderBy(desc(alerts.createdAt))
}

// Get alert statistics for dashboard
export async function getAlertStats() {
  const totalAlerts = await ensureDb()
    .select({ count: count() })
    .from(alerts)

  const unreadAlerts = await ensureDb()
    .select({ count: count() })
    .from(alerts)
    .where(eq(alerts.isRead, false))

  const unresolvedAlerts = await ensureDb()
    .select({ count: count() })
    .from(alerts)
    .where(isNull(alerts.resolvedAt))

  const criticalAlerts = await ensureDb()
    .select({ count: count() })
    .from(alerts)
    .where(and(
      eq(alerts.severity, 'critical'),
      isNull(alerts.resolvedAt)
    ))

  return {
    total: totalAlerts[0]?.count || 0,
    unread: unreadAlerts[0]?.count || 0,
    unresolved: unresolvedAlerts[0]?.count || 0,
    critical: criticalAlerts[0]?.count || 0
  }
}

// Real-time notification helpers
export async function getRecentAlerts(limit: number = 5) {
  return await ensureDb()
    .select({
      id: alerts.id,
      type: alerts.type,
      title: alerts.title,
      description: alerts.description,
      severity: alerts.severity,
      isRead: alerts.isRead,
      createdAt: alerts.createdAt
    })
    .from(alerts)
    .where(eq(alerts.isRead, false))
    .orderBy(desc(alerts.createdAt))
    .limit(limit)
}

// Bulk operations for alert management
export async function bulkMarkAlertsAsRead(alertIds: number[]) {
  if (alertIds.length === 0) return []
  
  return await ensureDb()
    .update(alerts)
    .set({ isRead: true })
    .where(sql`${alerts.id} IN (${alertIds.join(',')})`)
    .returning({ id: alerts.id })
}

export async function bulkResolveAlerts(alertIds: number[]) {
  if (alertIds.length === 0) return []
  
  return await ensureDb()
    .update(alerts)
    .set({ resolvedAt: new Date() })
    .where(sql`${alerts.id} IN (${alertIds.join(',')})`)
    .returning({ id: alerts.id })
}

// Delete old resolved alerts (cleanup function)
export async function cleanupOldAlerts(daysOld: number = 30) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
  
  return await ensureDb()
    .delete(alerts)
    .where(and(
      lte(alerts.resolvedAt, cutoffDate),
      eq(alerts.isRead, true)
    ))
    .returning({ id: alerts.id })
}
