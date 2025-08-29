'use server'

import { db } from './index'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}
import { groups, workers, users, attendance, payments, alerts } from './schema'
import { eq, desc, count, avg, and, gte, lte, isNull } from 'drizzle-orm'
import QRCode from 'qrcode'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

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
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || 'worker',
      phone: userData.phone || null,
      isActive: true,
      createdAt: new Date()
    })
    .returning({
      id: users.id,
      clerkId: users.clerkId,
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
      workerCount: count(workers.id),
      updatedAt: groups.updatedAt,
    })
    .from(groups)
    .leftJoin(users, eq(groups.supervisorId, users.id))
    .leftJoin(workers, eq(groups.id, workers.groupId))
    .groupBy(groups.id, groups.name, groups.location, groups.status, users.firstName, groups.updatedAt)
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
    .where(eq(workers.groupId, groupId))
}

// Dashboard stats
export async function getDashboardStats() {
  const totalWorkers = await ensureDb().select({ count: count() }).from(workers)
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
    .where(isNull(workers.groupId))
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

  // Create worker records for these users
  if (usersWithoutWorkerRecords.length > 0) {
    const workerRecords = usersWithoutWorkerRecords.map(user => ({
      userId: user.id,
      position: 'worker',
      dailyRate: '500.00', // Default daily rate
      isActive: true
    }))

    await ensureDb().insert(workers).values(workerRecords)
    console.log(`Created ${workerRecords.length} missing worker records`)
  }

  return usersWithoutWorkerRecords.length
}

// Generate QR code for worker attendance
export async function generateWorkerQRCode(workerId: number) {
  const worker = await ensureDb()
    .select({
      id: workers.id,
      userId: workers.userId,
      groupId: workers.groupId,
      firstName: users.firstName,
      lastName: users.lastName,
      groupName: groups.name,
      groupLocation: groups.location
    })
    .from(workers)
    .innerJoin(users, eq(workers.userId, users.id))
    .leftJoin(groups, eq(workers.groupId, groups.id))
    .where(eq(workers.id, workerId))
    .limit(1)

  if (!worker[0]) {
    throw new Error('Worker not found')
  }

  const workerData = worker[0]
  
  // Create QR code data with security hash
  const qrData = {
    workerId: workerData.id,
    workerName: `${workerData.firstName || ''} ${workerData.lastName || ''}`.trim(),
    groupId: workerData.groupId,
    groupName: workerData.groupName,
    groupLocation: workerData.groupLocation,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    timestamp: new Date().toISOString(),
    securityHash: crypto.createHash('sha256')
      .update(`${workerData.id}-${workerData.groupId}-${process.env.QR_SECRET || 'default-secret'}`)
      .digest('hex')
  }

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })

  return {
    qrCodeDataUrl,
    qrData
  }
}

// Get worker QR code data
export async function getWorkerQRCode(workerId: number) {
  try {
    return await generateWorkerQRCode(workerId)
  } catch (error) {
    console.error('Error generating QR code:', error)
    return null
  }
}

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

// Send QR code via email to worker
export async function sendQRCodeEmail(workerId: number, workerEmail: string) {
  try {
    const qrCodeData = await generateWorkerQRCode(workerId)
    if (!qrCodeData) {
      throw new Error('Failed to generate QR code')
    }

    const transporter = createEmailTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: workerEmail,
      subject: 'Your Attendance QR Code - Kazi Mtaani',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Attendance QR Code</h2>
          
          <p>Dear ${qrCodeData.qrData.workerName},</p>
          
          <p>You have been assigned to a work group. Please find your attendance QR code below:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <img src="cid:qrcode" alt="Attendance QR Code" style="border: 2px solid #ddd; padding: 10px;" />
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Assignment Details:</h3>
            <p><strong>Worker:</strong> ${qrCodeData.qrData.workerName}</p>
            <p><strong>Group:</strong> ${qrCodeData.qrData.groupName || 'Not assigned'}</p>
            <p><strong>Location:</strong> ${qrCodeData.qrData.groupLocation || 'Not specified'}</p>
            <p><strong>Valid Until:</strong> ${new Date(qrCodeData.qrData.expirationDate).toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1976d2;">Instructions:</h3>
            <ol>
              <li>Save this QR code to your phone or print it out</li>
              <li>Present this QR code at the worksite scanner for attendance</li>
              <li>Make sure to arrive on time for your scheduled work</li>
              <li>Contact your supervisor if you have any questions</li>
            </ol>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Kazi Mtaani. Please do not reply to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrCodeData.qrCodeDataUrl.split(',')[1],
          encoding: 'base64',
          cid: 'qrcode'
        }
      ]
    }

    await transporter.sendMail(mailOptions)
    console.log(`QR code email sent to ${workerEmail}`)
    return true
  } catch (error) {
    console.error('Error sending QR code email:', error)
    return false
  }
}

// Send QR codes to all workers in a group
export async function sendQRCodesToGroupWorkers(groupId: number) {
  try {
    const groupWorkers = await ensureDb()
      .select({
        workerId: workers.id,
        workerName: users.firstName,
        workerLastName: users.lastName,
        email: users.email,
        groupName: groups.name
      })
      .from(workers)
      .innerJoin(users, eq(workers.userId, users.id))
      .innerJoin(groups, eq(workers.groupId, groups.id))
      .where(eq(workers.groupId, groupId))

    const emailPromises = groupWorkers.map(worker => {
      if (worker.email) {
        return sendQRCodeEmail(worker.workerId, worker.email)
      }
      return Promise.resolve(false)
    })

    const results = await Promise.all(emailPromises)
    const successCount = results.filter(result => result).length
    
    console.log(`Sent QR codes to ${successCount}/${groupWorkers.length} workers in group`)
    return { success: successCount, total: groupWorkers.length }
  } catch (error) {
    console.error('Error sending QR codes to group workers:', error)
    return { success: 0, total: 0 }
  }
}

// Validate QR code and log attendance from external scanner
export async function validateAndLogAttendance(qrData: string, scannerId: string, scannerLocation?: string) {
  try {
    // Parse QR code data
    const parsedQRData = JSON.parse(qrData)
    const { workerId, groupId, securityHash, expirationDate } = parsedQRData

    // Validate QR code security and expiration
    if (new Date(expirationDate) < new Date()) {
      return { success: false, error: 'QR code has expired' }
    }

    const expectedHash = crypto.createHash('sha256')
      .update(`${workerId}-${groupId}-${process.env.QR_SECRET || 'default-secret'}`)
      .digest('hex')

    if (securityHash !== expectedHash) {
      return { success: false, error: 'Invalid QR code' }
    }

    // Get worker details
    const worker = await ensureDb()
      .select({
        id: workers.id,
        userId: workers.userId,
        groupId: workers.groupId,
        firstName: users.firstName,
        lastName: users.lastName,
        groupName: groups.name,
        groupLocation: groups.location
      })
      .from(workers)
      .innerJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(workers.groupId, groups.id))
      .where(eq(workers.id, workerId))
      .limit(1)

    if (!worker[0] || worker[0].groupId !== groupId) {
      return { success: false, error: 'Worker not found or not assigned to group' }
    }

    const workerData = worker[0]

    // Check for existing attendance today
    const today = new Date().toISOString().split('T')[0]
    const existingAttendance = await ensureDb()
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.workerId, workerId),
          eq(attendance.date, today)
        )
      )
      .limit(1)

    const isCheckOut = existingAttendance.length > 0 && 
                      existingAttendance[0].checkInTime && 
                      !existingAttendance[0].checkOutTime

    if (isCheckOut) {
      // Update with check-out time
      await ensureDb()
        .update(attendance)
        .set({
          checkOutTime: new Date(),
          notes: `Check-out via scanner ${scannerId}`
        })
        .where(eq(attendance.id, existingAttendance[0].id))
    } else {
      // Create new check-in record
      await ensureDb().insert(attendance).values({
        workerId: workerId,
        date: today,
        checkInTime: new Date(),
        checkOutTime: null,
        status: 'present',
        location: scannerLocation || workerData.groupLocation || 'Worksite',
        scannerId: scannerId,
        notes: `Check-in via scanner ${scannerId}`
      })
    }

    return {
      success: true,
      action: isCheckOut ? 'check-out' : 'check-in',
      worker: {
        name: `${workerData.firstName} ${workerData.lastName}`,
        group: workerData.groupName,
        location: workerData.groupLocation
      }
    }

  } catch (error) {
    console.error('Error validating and logging attendance:', error)
    return { success: false, error: 'System error' }
  }
}

// Create group with current supervisor as default supervisor
export async function createGroupWithCurrentSupervisor(
  groupData: {
    name: string
    description?: string
    location: string
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
