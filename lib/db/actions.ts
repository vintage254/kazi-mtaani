import { db } from './index'
import { groups, workers, users, attendance, payments, alerts } from './schema'
import { eq, desc, count, avg, and, gte, lte } from 'drizzle-orm'

// Group actions
export async function getGroups() {
  return await db
    .select({
      id: groups.id,
      name: groups.name,
      location: groups.location,
      status: groups.status,
      supervisorName: users.firstName,
      workerCount: count(workers.id),
      updatedAt: groups.updatedAt,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .leftJoin(workers, eq(groups.id, workers.groupId))
    .groupBy(groups.id, groups.name, groups.location, groups.status, users.firstName, groups.updatedAt)
}

export async function getGroupById(id: number) {
  const groupData = await db
    .select({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      location: groups.location,
      status: groups.status,
      createdAt: groups.createdAt,
      supervisorName: users.firstName,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .where(eq(groups.id, id))
    .limit(1)

  return groupData[0] || null
}

// Get groups with attendance statistics
export async function getGroupsWithStats() {
  return await db
    .select({
      id: groups.id,
      name: groups.name,
      location: groups.location,
      status: groups.status,
      supervisorName: users.firstName,
      workerCount: count(workers.id),
      updatedAt: groups.updatedAt,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .leftJoin(workers, eq(groups.id, workers.groupId))
    .groupBy(groups.id, groups.name, groups.location, groups.status, users.firstName, groups.updatedAt)
}

export async function getWorkersByGroupId(groupId: number) {
  return await db
    .select({
      id: workers.id,
      name: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      position: workers.position,
      isActive: workers.isActive,
      joinedAt: workers.joinedAt,
    })
    .from(workers)
    .innerJoin(users, eq(workers.userId, users.id))
    .where(eq(workers.groupId, groupId))
}

// Dashboard stats
export async function getDashboardStats() {
  const totalWorkers = await db.select({ count: count() }).from(workers)
  const activeGroups = await db.select({ count: count() }).from(groups).where(eq(groups.status, 'active'))
  
  // Get today's attendance
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const todayAttendance = await db
    .select({ count: count() })
    .from(attendance)
    .where(and(gte(attendance.createdAt, today), lte(attendance.createdAt, tomorrow)))
  
  const presentToday = await db
    .select({ count: count() })
    .from(attendance)
    .where(and(
      gte(attendance.createdAt, today),
      lte(attendance.createdAt, tomorrow),
      eq(attendance.status, 'present')
    ))

  const pendingApprovals = await db
    .select({ count: count() })
    .from(attendance)
    .where(eq(attendance.supervisorApproved, false))

  const attendanceRate = todayAttendance[0]?.count > 0 
    ? Math.round((presentToday[0]?.count / todayAttendance[0]?.count) * 100)
    : 0

  return {
    totalWorkers: totalWorkers[0]?.count || 0,
    activeGroups: activeGroups[0]?.count || 0,
    attendanceRate,
    pendingApprovals: pendingApprovals[0]?.count || 0
  }
}

// Recent activity
export async function getRecentActivity() {
  return await db
    .select({
      id: attendance.id,
      workerName: users.firstName,
      groupName: groups.name,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      location: groups.location,
    })
    .from(attendance)
    .innerJoin(workers, eq(attendance.workerId, workers.id))
    .innerJoin(users, eq(workers.userId, users.id))
    .innerJoin(groups, eq(attendance.groupId, groups.id))
    .orderBy(desc(attendance.createdAt))
    .limit(10)
}

// Active alerts
export async function getActiveAlerts() {
  return await db
    .select({
      id: alerts.id,
      type: alerts.type,
      title: alerts.title,
      description: alerts.description,
      severity: alerts.severity,
      workerName: users.firstName,
      groupName: groups.name,
      createdAt: alerts.createdAt,
    })
    .from(alerts)
    .leftJoin(workers, eq(alerts.workerId, workers.id))
    .leftJoin(users, eq(workers.userId, users.id))
    .leftJoin(groups, eq(alerts.groupId, groups.id))
    .where(eq(alerts.isRead, false))
    .orderBy(desc(alerts.createdAt))
    .limit(10)
}

// Group attendance stats
export async function getGroupAttendanceStats(groupId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const totalWorkers = await db
    .select({ count: count() })
    .from(workers)
    .where(eq(workers.groupId, groupId))

  const presentToday = await db
    .select({ count: count() })
    .from(attendance)
    .where(and(
      eq(attendance.groupId, groupId),
      gte(attendance.createdAt, today),
      lte(attendance.createdAt, tomorrow),
      eq(attendance.status, 'present')
    ))

  const absentToday = await db
    .select({ count: count() })
    .from(attendance)
    .where(and(
      eq(attendance.groupId, groupId),
      gte(attendance.createdAt, today),
      lte(attendance.createdAt, tomorrow),
      eq(attendance.status, 'absent')
    ))

  return {
    totalWorkers: totalWorkers[0]?.count || 0,
    presentToday: presentToday[0]?.count || 0,
    absentToday: absentToday[0]?.count || 0,
  }
}
