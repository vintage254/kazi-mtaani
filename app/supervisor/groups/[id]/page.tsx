import React from 'react'
import Sidebar from '@/components/supervisor/Sidebar'
import { getGroupById, getWorkersByGroupId, getSupervisors } from '@/lib/db/actions'
import { getGroupAttendanceStats } from '@/lib/db/attendance-actions'
import { notFound } from 'next/navigation'
import GroupDetailClient from './GroupDetailClient'

interface GroupDetailProps {
  params: {
    id: string
  }
}

const GroupDetail = async ({ params }: GroupDetailProps) => {
  const { id } = await params
  const groupId = parseInt(id)
  
  const [group, workers, supervisors, attendanceStats] = await Promise.all([
    getGroupById(groupId),
    getWorkersByGroupId(groupId),
    getSupervisors(),
    getGroupAttendanceStats(groupId)
  ])

  if (!group) {
    notFound()
  }

  return (
    <div className="flex">
      <Sidebar />
      <GroupDetailClient 
        group={group} 
        workers={workers} 
        supervisors={supervisors}
        attendanceStats={attendanceStats}
      />
    </div>
  )
}

export default GroupDetail