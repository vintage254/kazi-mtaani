'use server'

import { db } from './index'
import { attendance, workers, users, groups, payments } from './schema'
import { eq, desc, count, and, gte, lte } from 'drizzle-orm'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Attendance Management Actions
export async function getAttendanceRecords(filters?: {
  groupId?: number
  workerId?: number
  dateFrom?: string
  dateTo?: string
  status?: 'present' | 'absent' | 'late'
  approvalStatus?: boolean
}) {
  const conditions = []
  
  if (filters?.groupId) {
    conditions.push(eq(attendance.groupId, filters.groupId))
  }
  
  if (filters?.workerId) {
    conditions.push(eq(attendance.workerId, filters.workerId))
  }
  
  if (filters?.dateFrom) {
    conditions.push(gte(attendance.date, filters.dateFrom))
  }
  
  if (filters?.dateTo) {
    conditions.push(lte(attendance.date, filters.dateTo))
  }
  
  if (filters?.status) {
    conditions.push(eq(attendance.status, filters.status))
  }
  
  if (filters?.approvalStatus !== undefined) {
    conditions.push(eq(attendance.supervisorApproved, filters.approvalStatus))
  }

  const baseQuery = ensureDb()
    .select({
      id: attendance.id,
      date: attendance.date,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      location: attendance.location,
      supervisorApproved: attendance.supervisorApproved,
      notes: attendance.notes,
      workerId: workers.id,
      workerName: users.firstName,
      workerLastName: users.lastName,
      groupId: groups.id,
      groupName: groups.name,
      groupLocation: groups.location,
      faceRecognitionScore: attendance.faceRecognitionScore,
      dailyRate: workers.dailyRate
    })
    .from(attendance)
    .innerJoin(workers, eq(attendance.workerId, workers.id))
    .innerJoin(users, eq(workers.userId, users.id))
    .innerJoin(groups, eq(attendance.groupId, groups.id))

  if (conditions.length > 0) {
    return await baseQuery.where(and(...conditions)).orderBy(desc(attendance.date), desc(attendance.checkInTime))
  }

  return await baseQuery.orderBy(desc(attendance.date), desc(attendance.checkInTime))
}

export async function approveAttendanceRecord(attendanceId: number, supervisorId: number) {
  const result = await ensureDb()
    .update(attendance)
    .set({
      supervisorApproved: true,
      notes: `Approved by supervisor ${supervisorId} on ${new Date().toISOString()}`
    })
    .where(eq(attendance.id, attendanceId))
    .returning({
      id: attendance.id,
      supervisorApproved: attendance.supervisorApproved,
      workerId: attendance.workerId,
      groupId: attendance.groupId,
      date: attendance.date
    })

  // Create payment record when attendance is approved
  if (result[0] && result[0].workerId && result[0].groupId && result[0].date) {
    await createPaymentFromAttendance({
      workerId: result[0].workerId,
      groupId: result[0].groupId,
      date: result[0].date
    })
  }

  return result[0]
}

export async function bulkApproveAttendance(attendanceIds: number[], supervisorId: number) {
  const results = []
  
  for (const attendanceId of attendanceIds) {
    const result = await approveAttendanceRecord(attendanceId, supervisorId)
    results.push(result)
  }
  
  return results
}

// Payment Management Actions (Stats only, no M-Pesa)
export async function createPaymentFromAttendance(attendanceRecord: {
  workerId: number
  groupId: number
  date: string
}) {
  // Check if payment already exists for this worker and date
  const existingPayment = await ensureDb()
    .select()
    .from(payments)
    .where(and(
      eq(payments.workerId, attendanceRecord.workerId),
      eq(payments.period, attendanceRecord.date)
    ))
    .limit(1)

  if (existingPayment.length > 0) {
    return existingPayment[0]
  }

  // Get worker's daily rate
  const worker = await ensureDb()
    .select({ dailyRate: workers.dailyRate })
    .from(workers)
    .where(eq(workers.id, attendanceRecord.workerId))
    .limit(1)

  const dailyRate = worker[0]?.dailyRate || '500.00'

  const result = await ensureDb()
    .insert(payments)
    .values({
      workerId: attendanceRecord.workerId,
      groupId: attendanceRecord.groupId,
      amount: dailyRate,
      period: attendanceRecord.date,
      status: 'pending',
      createdAt: new Date()
    })
    .returning({
      id: payments.id,
      amount: payments.amount,
      status: payments.status
    })

  return result[0]
}

export async function getPaymentRecords(filters?: {
  groupId?: number
  workerId?: number
  status?: 'pending' | 'approved' | 'disbursed' | 'failed'
  dateFrom?: string
  dateTo?: string
}) {
  const conditions = []
  
  if (filters?.groupId) {
    conditions.push(eq(payments.groupId, filters.groupId))
  }
  
  if (filters?.workerId) {
    conditions.push(eq(payments.workerId, filters.workerId))
  }
  
  if (filters?.status) {
    conditions.push(eq(payments.status, filters.status))
  }
  
  if (filters?.dateFrom) {
    conditions.push(gte(payments.period, filters.dateFrom))
  }
  
  if (filters?.dateTo) {
    conditions.push(lte(payments.period, filters.dateTo))
  }

  const baseQuery = ensureDb()
    .select({
      id: payments.id,
      amount: payments.amount,
      period: payments.period,
      status: payments.status,
      createdAt: payments.createdAt,
      approvedAt: payments.approvedAt,
      disbursedAt: payments.disbursedAt,
      workerId: workers.id,
      workerName: users.firstName,
      workerLastName: users.lastName,
      groupId: groups.id,
      groupName: groups.name
    })
    .from(payments)
    .innerJoin(workers, eq(payments.workerId, workers.id))
    .innerJoin(users, eq(workers.userId, users.id))
    .innerJoin(groups, eq(payments.groupId, groups.id))

  if (conditions.length > 0) {
    return await baseQuery.where(and(...conditions)).orderBy(desc(payments.createdAt))
  }

  return await baseQuery.orderBy(desc(payments.createdAt))
}

export async function getGroupAttendanceStats(groupId: number) {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Start of current week
  weekStart.setHours(0, 0, 0, 0)
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Get total attendance records for this group this week
  const totalAttendanceRecords = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .innerJoin(workers, eq(attendance.workerId, workers.id))
    .where(and(
      eq(workers.groupId, groupId),
      gte(attendance.date, weekStart.toISOString().split('T')[0]),
      lte(attendance.date, weekEnd.toISOString().split('T')[0])
    ))

  // Get present attendance records for this group this week
  const presentAttendanceRecords = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .innerJoin(workers, eq(attendance.workerId, workers.id))
    .where(and(
      eq(workers.groupId, groupId),
      eq(attendance.status, 'present'),
      gte(attendance.date, weekStart.toISOString().split('T')[0]),
      lte(attendance.date, weekEnd.toISOString().split('T')[0])
    ))

  const totalRecords = totalAttendanceRecords[0]?.count || 0
  const presentRecords = presentAttendanceRecords[0]?.count || 0
  
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

  return {
    attendanceRate,
    totalRecords,
    presentRecords
  }
}

export async function getPaymentStats() {
  // Calculate total amounts by fetching all records and summing
  const pendingPayments = await ensureDb()
    .select()
    .from(payments)
    .where(eq(payments.status, 'pending'))

  const approvedPayments = await ensureDb()
    .select()
    .from(payments)
    .where(eq(payments.status, 'approved'))

  const disbursedPayments = await ensureDb()
    .select()
    .from(payments)
    .where(eq(payments.status, 'disbursed'))

  const calculateSum = (records: any[]) => {
    return records.reduce((sum, record) => sum + parseFloat(record.amount || '0'), 0)
  }

  return {
    pending: {
      count: pendingPayments.length,
      totalAmount: calculateSum(pendingPayments)
    },
    approved: {
      count: approvedPayments.length,
      totalAmount: calculateSum(approvedPayments)
    },
    disbursed: {
      count: disbursedPayments.length,
      totalAmount: calculateSum(disbursedPayments)
    }
  }
}

export async function approvePayment(paymentId: number, supervisorId: number) {
  const result = await ensureDb()
    .update(payments)
    .set({
      status: 'approved',
      approvedBy: supervisorId,
      approvedAt: new Date()
    })
    .where(eq(payments.id, paymentId))
    .returning({
      id: payments.id,
      status: payments.status,
      amount: payments.amount
    })

  return result[0]
}

export async function markPaymentAsDisbursed(paymentId: number) {
  const result = await ensureDb()
    .update(payments)
    .set({
      status: 'disbursed',
      disbursedAt: new Date()
    })
    .where(eq(payments.id, paymentId))
    .returning({
      id: payments.id,
      status: payments.status
    })

  return result[0]
}
