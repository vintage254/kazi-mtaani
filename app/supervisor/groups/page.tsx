import React from 'react'
import Sidebar from '@/components/supervisor/Sidebar'
import { getGroupsWithStats, getSupervisors } from '@/lib/db/actions'
import GroupsPageClient from './GroupsPageClient'

const SupervisorGroups = async () => {
  const [groups, supervisors] = await Promise.all([
    getGroupsWithStats(),
    getSupervisors()
  ])

  return (
    <div className="flex">
      <Sidebar />
      <GroupsPageClient groups={groups} supervisors={supervisors} />
    </div>
  )
}

export default SupervisorGroups