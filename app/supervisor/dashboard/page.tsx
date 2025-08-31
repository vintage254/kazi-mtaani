import React from 'react'
import Sidebar from '@/components/supervisor/Sidebar'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

const SupervisorDashboard = async () => {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex">
      <Sidebar />
      <DashboardClient />
    </div>
  )
}

export default SupervisorDashboard