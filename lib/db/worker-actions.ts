'use server'

import { db } from './index'
import { workers, groups, users, attendance, payments } from './schema'
import { eq, desc, count, and, gte, lte } from 'drizzle-orm'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Worker-specific actions
export async function getWorkerByUserId(userId: number) {
  const result = await ensureDb()
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
      supervisorName: users.firstName,
      supervisorLastName: users.lastName
    })
    .from(workers)
    .leftJoin(groups, eq(workers.groupId, groups.id))
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .where(eq(workers.userId, userId))
    .limit(1)

  return result[0] || null
}

export async function getWorkerDashboardStats(workerId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Start of current week
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Days worked this week
  const daysWorked = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .where(and(
      eq(attendance.workerId, workerId),
      gte(attendance.createdAt, weekStart),
      lte(attendance.createdAt, weekEnd),
      eq(attendance.status, 'present')
    ))

  // Total hours this week (approximate based on check-ins)
  const attendanceRecords = await ensureDb()
    .select({
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime
    })
    .from(attendance)
    .where(and(
      eq(attendance.workerId, workerId),
      gte(attendance.createdAt, weekStart),
      lte(attendance.createdAt, weekEnd),
      eq(attendance.status, 'present')
    ))

  let totalHours = 0
  attendanceRecords.forEach(record => {
    if (record.checkInTime && record.checkOutTime) {
      const hours = (new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60 * 60)
      totalHours += hours
    } else if (record.checkInTime) {
      // Assume 8 hours if no checkout time
      totalHours += 8
    }
  })

  // Attendance rate this week
  const totalWorkDays = 5 // Assuming 5 work days per week
  const attendanceRate = totalWorkDays > 0 ? Math.round((daysWorked[0]?.count || 0) / totalWorkDays * 100) : 0

  // Pending payments
  const pendingPayments = await ensureDb()
    .select({ count: count() })
    .from(payments)
    .where(and(
      eq(payments.workerId, workerId),
      eq(payments.status, 'pending')
    ))

  return {
    daysWorked: daysWorked[0]?.count || 0,
    totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
    attendanceRate,
    pendingPayments: pendingPayments[0]?.count || 0
  }
}

export async function getWorkerRecentActivity(workerId: number, limit = 10) {
  return await ensureDb()
    .select({
      id: attendance.id,
      date: attendance.createdAt,
      activity: attendance.status,
      location: attendance.location,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      groupName: groups.name,
      supervisorApproved: attendance.supervisorApproved
    })
    .from(attendance)
    .leftJoin(groups, eq(attendance.groupId, groups.id))
    .where(eq(attendance.workerId, workerId))
    .orderBy(desc(attendance.createdAt))
    .limit(limit)
}

export async function getWorkerPaymentHistory(workerId: number, limit = 10) {
  return await ensureDb()
    .select({
      id: payments.id,
      amount: payments.amount,
      period: payments.period,
      status: payments.status,
      createdAt: payments.createdAt,
      disbursedAt: payments.disbursedAt,
      mpesaTransactionId: payments.mpesaTransactionId
    })
    .from(payments)
    .where(eq(payments.workerId, workerId))
    .orderBy(desc(payments.createdAt))
    .limit(limit)
}

export async function getWorkerAttendanceChart(workerId: number, days = 7) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)
  
  return await ensureDb()
    .select({
      date: attendance.createdAt,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime
    })
    .from(attendance)
    .where(and(
      eq(attendance.workerId, workerId),
      gte(attendance.createdAt, startDate),
      lte(attendance.createdAt, endDate)
    ))
    .orderBy(attendance.createdAt)
}

// Get group details and team members for a worker
export async function getWorkerGroupDetails(workerId: number) {
  const worker = await ensureDb()
    .select({
      groupId: workers.groupId,
      groupName: groups.name,
      groupLocation: groups.location,
      groupDescription: groups.description,
      groupStatus: groups.status,
      supervisorName: users.firstName,
      supervisorLastName: users.lastName,
      supervisorId: groups.supervisorId,
      createdAt: groups.createdAt
    })
    .from(workers)
    .leftJoin(groups, eq(workers.groupId, groups.id))
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .where(eq(workers.id, workerId))
    .limit(1)

  if (!worker[0] || !worker[0].groupId) {
    return null
  }

  const groupData = worker[0]

  // Get all team members in the same group
  const teamMembers = await ensureDb()
    .select({
      id: workers.id,
      userId: workers.userId,
      position: workers.position,
      isActive: workers.isActive,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      joinedAt: workers.joinedAt
    })
    .from(workers)
    .leftJoin(users, eq(workers.userId, users.id))
    .where(eq(workers.groupId, groupData.groupId!))

  // Get group attendance stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const presentToday = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .leftJoin(workers, eq(attendance.workerId, workers.id))
    .where(and(
      eq(workers.groupId, groupData.groupId!),
      gte(attendance.createdAt, today),
      eq(attendance.status, 'present')
    ))

  return {
    group: groupData,
    teamMembers,
    stats: {
      totalMembers: teamMembers.length,
      presentToday: presentToday[0]?.count || 0,
      attendanceRate: teamMembers.length > 0 ? Math.round((presentToday[0]?.count || 0) / teamMembers.length * 100) : 0
    }
  }
}
