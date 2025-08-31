import React from 'react'
import Sidebar from '@/components/supervisor/Sidebar'
import { getSupervisors } from '@/lib/db/actions'
import GroupsPageClient from './GroupsPageClient'

const SupervisorGroups = async () => {
  const supervisors = await getSupervisors()

  return (
    <div className="flex">
      <Sidebar />
      <GroupsPageClient supervisors={supervisors} />
    </div>
  )
}

export default SupervisorGroups