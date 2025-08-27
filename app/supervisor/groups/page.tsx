import React from 'react'
import Link from 'next/link'
import Sidebar from '@/components/supervisor/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getGroupsWithStats, getSupervisors } from '@/lib/db/actions'
import GroupsPageClient from './GroupsPageClient'

const SupervisorGroups = async () => {
  const [groups, supervisors] = await Promise.all([
    getGroupsWithStats(),
    getSupervisors()
  ])

  return (
    <ProtectedRoute requiredRole="supervisor">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <GroupsPageClient groups={groups} supervisors={supervisors} />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default SupervisorGroups