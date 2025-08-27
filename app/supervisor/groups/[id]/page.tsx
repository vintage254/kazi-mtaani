import React from 'react'
import Link from 'next/link'
import Sidebar from '@/components/supervisor/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getGroupById, getWorkersByGroupId, getSupervisors } from '@/lib/db/actions'
import { notFound } from 'next/navigation'
import GroupDetailClient from './GroupDetailClient'

interface GroupDetailProps {
  params: {
    id: string
  }
}

const GroupDetail = async ({ params }: GroupDetailProps) => {
  const groupId = parseInt(params.id)
  
  const [group, workers, supervisors] = await Promise.all([
    getGroupById(groupId),
    getWorkersByGroupId(groupId),
    getSupervisors()
  ])

  if (!group) {
    notFound()
  }

  return (
    <ProtectedRoute requiredRole="supervisor">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <GroupDetailClient 
            group={group} 
            workers={workers} 
            supervisors={supervisors} 
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default GroupDetail