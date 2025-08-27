import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import WorkerDashboardClient from './WorkerDashboardClient'
import { getUserByClerkIdAction, createUserAction } from '@/lib/db/actions'
import { getWorkerByUserId, getWorkerDashboardStats, getWorkerRecentActivity, getWorkerPaymentHistory } from '@/lib/db/worker-actions'

const WorkerDashboard = async () => {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get or create user data
  let user = await getUserByClerkIdAction(userId)
  if (!user) {
    // Auto-create user as worker if they don't exist
    try {
      user = await createUserAction({
        clerkId: userId,
        email: '', // Will be populated from Clerk webhook
        firstName: '',
        lastName: '',
        role: 'worker',
        phone: ''
      })
    } catch (error) {
      console.error('Error creating user:', error)
      redirect('/sign-in')
    }
  }
  
  // If user has different role, redirect to appropriate dashboard

  // Get worker-specific data
  const workerData = await getWorkerByUserId(user.id)
  if (!workerData) {
    redirect('/')
  }

  // Create worker object for sidebar
  const worker = {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker',
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: user.firstName?.toLowerCase() || 'worker',
    status: workerData.isActive ? "Online" : "Offline",
    group: workerData.groupName || 'No Group Assigned',
    supervisor: workerData.supervisorName || 'No Supervisor'
  }

  // Get actual stats from database
  const stats = await getWorkerDashboardStats(workerData.id)

  // Get actual recent activity from database
  const recentActivity = await getWorkerRecentActivity(workerData.id, 5)

  // Get actual payment history from database
  const paymentHistory = await getWorkerPaymentHistory(workerData.id, 5)

  return (
    <WorkerDashboardClient 
      worker={worker} 
      stats={stats} 
      recentActivity={recentActivity} 
      paymentHistory={paymentHistory} 
    />
  )
}
