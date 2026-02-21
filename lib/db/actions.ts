'use server'

import { db } from './index'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}
import { users, workers, groups, attendance, alerts } from './schema'
import { eq, desc, count, and, gte, lte, isNull } from 'drizzle-orm'

// Server action to get user by clerk ID
export async function getUserByClerkIdAction(clerkId: string) {
  console.log('🔍 Server action: Looking for user with clerkId:', clerkId)
  
  if (!db) {
    console.log('❌ Database not available on server side')
    return null
  }
  
  const result = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      phone: users.phone,
      isActive: users.isActive
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  console.log('📊 Server action: Database query result:', result.length > 0 ? result[0] : 'No user found')
  return result[0] || null
}

// User creation server action for onboarding
export async function createUserAction(userData: {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  role?: 'worker' | 'supervisor' | 'admin'
  phone?: string
}) {
  console.log('✨ Server action: Creating new user:', userData)
  
  if (!db) {
    throw new Error('Database not available')
  }

  // First check if user already exists
  const existingUser = await getUserByClerkIdAction(userData.clerkId)
  if (existingUser) {
    console.log('👤 User already exists, returning existing user:', existingUser)
    return existingUser
  }
  
  const result = await db
    .insert(users)
    .values({
      clerkId: userData.clerkId,
      username: `user_${Date.now()}`, // Temporary username until onboarding
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || 'worker',
      phone: userData.phone || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning({
      id: users.id,
      clerkId: users.clerkId,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      phone: users.phone,
      isActive: users.isActive
    })

  console.log('✅ Server action: User created successfully:', result[0])
  return result[0]
}

// Group actions
export async function getGroups() {
  return await ensureDb()
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
  
  const groupData = await ensureDb()
    .select({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      location: groups.location,
      status: groups.status,
      createdAt: groups.createdAt,
      supervisorId: groups.supervisorId,
      supervisorName: users.firstName,
      supervisorLastName: users.lastName,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .where(eq(groups.id, id))
    .limit(1)

  return groupData[0] || null
}

// Get groups with attendance statistics
export async function getGroupsWithStats() {
  
  return await ensureDb()
    .select({
      id: groups.id,
      name: groups.name,
      location: groups.location,
      status: groups.status,
      supervisorName: users.firstName,
      supervisorLastName: users.lastName,
      workerCount: count(workers.id),
      updatedAt: groups.updatedAt,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .leftJoin(workers, and(eq(groups.id, workers.groupId), eq(workers.isActive, true)))
    .groupBy(groups.id, groups.name, groups.location, groups.status, users.firstName, users.lastName, groups.updatedAt)
}

export async function getWorkersByGroupId(groupId: number) {
  
  return await ensureDb()
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
    .where(and(eq(workers.groupId, groupId), eq(workers.isActive, true)))
}

// Dashboard stats
export async function getDashboardStats() {
  const totalWorkers = await ensureDb().select({ count: count() }).from(workers).where(eq(workers.isActive, true))
  const activeGroups = await ensureDb().select({ count: count() }).from(groups).where(eq(groups.status, 'active'))
  
  // Get today's attendance
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const todayAttendance = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .where(and(gte(attendance.createdAt, today), lte(attendance.createdAt, tomorrow)))
  
  const presentToday = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .where(and(
      gte(attendance.createdAt, today),
      lte(attendance.createdAt, tomorrow),
      eq(attendance.status, 'present')
    ))

  const pendingApprovals = await ensureDb()
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
  return await ensureDb()
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
  return await ensureDb()
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

  const totalWorkers = await ensureDb()
    .select({ count: count() })
    .from(workers)
    .where(eq(workers.groupId, groupId))

  const presentToday = await ensureDb()
    .select({ count: count() })
    .from(attendance)
    .where(and(
      eq(attendance.groupId, groupId),
      gte(attendance.createdAt, today),
      lte(attendance.createdAt, tomorrow),
      eq(attendance.status, 'present')
    ))

  const absentToday = await ensureDb()
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

// Group CRUD operations
export async function createGroup(groupData: {
  name: string
  description?: string
  location: string
  supervisorId?: number
}) {
  const result = await ensureDb()
    .insert(groups)
    .values({
      name: groupData.name,
      description: groupData.description,
      location: groupData.location,
      supervisorId: groupData.supervisorId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      location: groups.location,
      supervisorId: groups.supervisorId,
      status: groups.status
    })

  return result[0]
}

export async function updateGroup(groupId: number, groupData: {
  name?: string
  description?: string
  location?: string
  supervisorId?: number
  status?: 'active' | 'inactive' | 'suspended'
}) {
  const result = await ensureDb()
    .update(groups)
    .set({
      ...groupData,
      updatedAt: new Date()
    })
    .where(eq(groups.id, groupId))
    .returning({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      location: groups.location,
      supervisorId: groups.supervisorId,
      status: groups.status
    })

  return result[0]
}

export async function deleteGroup(groupId: number) {
  // First check if group has workers
  const workersInGroup = await ensureDb()
    .select({ count: count() })
    .from(workers)
    .where(eq(workers.groupId, groupId))

  if (workersInGroup[0]?.count > 0) {
    throw new Error('Cannot delete group with active workers. Please reassign workers first.')
  }

  await ensureDb()
    .delete(groups)
    .where(eq(groups.id, groupId))

  return { success: true }
}

// Get all supervisors for assignment
export async function getSupervisors() {
  return await ensureDb()
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email
    })
    .from(users)
    .where(eq(users.role, 'supervisor'))
}

// Worker assignment operations
export async function assignWorkerToGroup(workerId: number, groupId: number) {
  const result = await ensureDb()
    .update(workers)
    .set({
      groupId: groupId
    })
    .where(eq(workers.id, workerId))
    .returning({
      id: workers.id,
      groupId: workers.groupId
    })

  return result[0]
}

export async function removeWorkerFromGroup(workerId: number) {
  const result = await ensureDb()
    .update(workers)
    .set({
      groupId: null
    })
    .where(eq(workers.id, workerId))
    .returning({
      id: workers.id,
      groupId: workers.groupId
    })

  return result[0]
}

// Get unassigned workers
export async function getUnassignedWorkers() {
  return await ensureDb()
    .select({
      id: workers.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      position: workers.position,
      isActive: workers.isActive
    })
    .from(workers)
    .innerJoin(users, eq(workers.userId, users.id))
    .where(and(isNull(workers.groupId), eq(workers.isActive, true)))
}

// Create worker records for users with worker role who don't have worker records
export async function createMissingWorkerRecords() {
  // Find users with worker role who don't have worker records
  const usersWithoutWorkerRecords = await ensureDb()
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role
    })
    .from(users)
    .leftJoin(workers, eq(users.id, workers.userId))
    .where(and(eq(users.role, 'worker'), isNull(workers.id)))

  // Create worker records for these users, but check for duplicates first
  if (usersWithoutWorkerRecords.length > 0) {
    for (const user of usersWithoutWorkerRecords) {
      // Double-check that no worker record exists for this user
      const existingWorker = await ensureDb()
        .select({ id: workers.id })
        .from(workers)
        .where(eq(workers.userId, user.id))
        .limit(1)

      if (existingWorker.length === 0) {
        await ensureDb().insert(workers).values({
          userId: user.id,
          position: 'worker',
          dailyRate: '500.00',
          isActive: true
        })
        console.log(`Created worker record for user ${user.firstName} ${user.lastName}`)
      }
    }
  }

  return usersWithoutWorkerRecords.length
}

// Clean up duplicate worker records
export async function cleanupDuplicateWorkers() {
  // Find all workers grouped by userId
  const allWorkers = await ensureDb()
    .select({
      id: workers.id,
      userId: workers.userId,
      position: workers.position,
      isActive: workers.isActive,
      joinedAt: workers.joinedAt
    })
    .from(workers)
    .orderBy(workers.userId, workers.joinedAt)

  const userWorkerMap = new Map<number, typeof allWorkers>()
  
  // Group workers by userId (filter out null userIds)
  allWorkers.forEach(worker => {
    if (worker.userId !== null) {
      if (!userWorkerMap.has(worker.userId)) {
        userWorkerMap.set(worker.userId, [])
      }
      userWorkerMap.get(worker.userId)!.push(worker)
    }
  })

  let duplicatesRemoved = 0

  // For each user with multiple worker records, keep the oldest active one
  for (const [userId, userWorkers] of userWorkerMap) {
    if (userWorkers.length > 1) {
      // Sort by joinedAt (oldest first), then by isActive (active first)
      const sortedWorkers = userWorkers.sort((a, b) => {
        if (a.isActive !== b.isActive) {
          return b.isActive ? 1 : -1 // Active records first
        }
        return new Date(a.joinedAt || 0).getTime() - new Date(b.joinedAt || 0).getTime()
      })

      // Keep the first one (oldest active), delete the rest
      const deleteWorkers = sortedWorkers.slice(1)

      for (const workerToDelete of deleteWorkers) {
        await ensureDb()
          .delete(workers)
          .where(eq(workers.id, workerToDelete.id))
        
        duplicatesRemoved++
        console.log(`Removed duplicate worker record ${workerToDelete.id} for user ${userId}`)
      }
    }
  }

  console.log(`Cleanup completed: Removed ${duplicatesRemoved} duplicate worker records`)
  return duplicatesRemoved
}

// Create group with current supervisor as default supervisor
export async function createGroupWithCurrentSupervisor(
  groupData: {
    name: string
    description?: string
    location: string
    latitude?: string
    longitude?: string
    geofenceRadius?: number
  },
  currentUserClerkId: string
) {
  // Get current user info
  const currentUser = await getUserByClerkIdAction(currentUserClerkId)

  if (!currentUser || currentUser.role !== 'supervisor') {
    throw new Error('Only supervisors can create groups')
  }

  const result = await ensureDb()
    .insert(groups)
    .values({
      name: groupData.name,
      description: groupData.description,
      location: groupData.location,
      latitude: groupData.latitude || null,
      longitude: groupData.longitude || null,
      geofenceRadius: groupData.geofenceRadius || 100,
      supervisorId: currentUser.id, // Auto-assign current supervisor
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning({
      id: groups.id,
      name: groups.name,
      description: groups.description,
      location: groups.location,
      supervisorId: groups.supervisorId,
      status: groups.status
    })

  return result[0]
}
