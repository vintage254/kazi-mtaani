import React from 'react'
import Link from 'next/link'
import Sidebar from '@/components/supervisor/Sidebar'
import { getGroupById, getWorkersByGroupId, getSupervisors } from '@/lib/db/actions'
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
  
  const [group, workers, supervisors] = await Promise.all([
    getGroupById(groupId),
    getWorkersByGroupId(groupId),
    getSupervisors()
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
      />
    </div>
  )
}

export default GroupDetail