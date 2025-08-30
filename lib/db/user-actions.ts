import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export async function getUserByClerkId(clerkId: string) {
  console.log('🔍 Looking for user with clerkId:', clerkId)
  
  if (!db) {
    console.log('❌ Database not available on client side')
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
      profileImage: users.profileImage,
      isActive: users.isActive
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  console.log('📊 Database query result:', result.length > 0 ? result[0] : 'No user found')
  return result[0] || null
}

export async function createUser(userData: {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  role?: 'worker' | 'supervisor' | 'admin'
  phone?: string
  profileImage?: string | null
}) {
  console.log('✨ Creating new user:', userData)
  
  if (!db) {
    throw new Error('Database not available on client side')
  }
  
  const result = await db
    .insert(users)
    .values({
      clerkId: userData.clerkId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'worker',
      phone: userData.phone,
      profileImage: userData.profileImage,
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
      profileImage: users.profileImage,
      isActive: users.isActive
    })

  console.log('✅ User created successfully:', result[0])
  return result[0]
}

export async function updateUser(userId: number, userData: {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  profileImage?: string | null
  role?: 'worker' | 'supervisor' | 'admin'
}) {
  if (!db) {
    throw new Error('Database not available on client side')
  }
  
  const result = await db
    .update(users)
    .set({
      ...userData,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      clerkId: users.clerkId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      phone: users.phone,
      profileImage: users.profileImage
    })

  return result[0] || null
}

export async function updateUserRole(clerkId: string, role: 'worker' | 'supervisor' | 'admin') {
  if (!db) {
    throw new Error('Database not available on client side')
  }
  
  const result = await db
    .update(users)
    .set({ role })
    .where(eq(users.clerkId, clerkId))
    .returning({
      id: users.id,
      clerkId: users.clerkId,
      role: users.role
    })

  return result[0] || null
}
