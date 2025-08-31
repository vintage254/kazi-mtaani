import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import WorkerAttendanceClient from './WorkerAttendanceClient'

export default async function WorkerAttendancePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  if (!db) {
    redirect('/sign-in')
  }

  // Get user from database for role check
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId)
  })
  
  if (!user) {
    redirect('/sign-in')
  }

  // Role-based redirects
  if (user.role === 'supervisor') {
    redirect('/supervisor/dashboard')
  }
  if (user.role === 'admin') {
    redirect('/supervisor/dashboard')
  }

  return <WorkerAttendanceClient />
}
