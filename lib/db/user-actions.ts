import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export async function getUserByClerkId(clerkId: string) {
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

  return result[0] || null
}

export async function createUser(userData: {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  role?: 'worker' | 'supervisor' | 'admin'
  phone?: string
}) {
  const result = await db
    .insert(users)
    .values({
      clerkId: userData.clerkId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'worker',
      phone: userData.phone,
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

  return result[0]
}

export async function updateUserRole(clerkId: string, role: 'worker' | 'supervisor' | 'admin') {
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
