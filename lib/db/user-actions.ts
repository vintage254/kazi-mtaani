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
      username: users.username,
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
      username: `user_${Date.now()}`, // Temporary username until onboarding
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || 'worker',
      phone: userData.phone || null,
      profileImage: userData.profileImage || null,
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

// Create user with custom username during onboarding
export async function createUserWithUsername(userData: {
  clerkId: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  role: 'worker' | 'supervisor' | 'admin'
}) {
  console.log('✨ Creating user with username:', userData)
  
  if (!db) {
    throw new Error('Database not available')
  }

  // Check if username is already taken
  const existingUsername = await db
    .select()
    .from(users)
    .where(eq(users.username, userData.username))
    .limit(1)

  if (existingUsername.length > 0) {
    throw new Error('Username is already taken')
  }

  // Check if user already exists with this Clerk ID
  const existingUser = await getUserByClerkId(userData.clerkId)
  if (existingUser) {
    // Update existing user with username and details
    const result = await db
      .update(users)
      .set({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || null,
        role: userData.role,
        updatedAt: new Date()
      })
      .where(eq(users.clerkId, userData.clerkId))
      .returning({
        id: users.id,
        clerkId: users.clerkId,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        profileImage: users.profileImage,
        isActive: users.isActive
      })

    console.log('✅ User updated with username:', result[0])
    return result[0]
  }

  // Create new user
  const result = await db
    .insert(users)
    .values({
      clerkId: userData.clerkId,
      username: userData.username,
      email: null, // Will be populated from Clerk webhook
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
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
      profileImage: users.profileImage,
      isActive: users.isActive
    })

  console.log('✅ User created with username:', result[0])
  return result[0]
}

// Check if username is available
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!db) {
    throw new Error('Database not available')
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  return existingUser.length === 0
}
