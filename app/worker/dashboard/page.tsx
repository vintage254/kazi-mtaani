import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import WorkerDashboardClient from './WorkerDashboardClient'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const WorkerDashboard = async () => {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  if (!db) {
    redirect('/sign-in')
  }

  // Get user data for role check
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId)
  })

  if (!user) {
    redirect('/sign-in')
  }
  
  // If user has different role, redirect to appropriate dashboard
  if (user.role === 'supervisor') {
    redirect('/supervisor/dashboard')
  }
  if (user.role === 'admin') {
    redirect('/supervisor/dashboard') // Admin uses supervisor dashboard for now
  }

  return <WorkerDashboardClient />
}

export default WorkerDashboard
