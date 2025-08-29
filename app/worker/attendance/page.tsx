import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/db/user-actions'
import { getWorkerByUserId } from '@/lib/db/worker-actions'
import WorkerAttendanceClient from './WorkerAttendanceClient'

export default async function WorkerAttendancePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get user from database
  const user = await getUserByClerkId(userId)
  if (!user) {
    redirect('/sign-in')
  }

  // Get worker-specific data
  const workerData = await getWorkerByUserId(user.id)
  
  // Create worker object for sidebar
  const worker = {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker',
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: user.firstName?.toLowerCase() || 'worker',
    status: "Online",
    group: workerData?.groupName || 'No Group Assigned',
    supervisor: workerData?.supervisorName || 'No Supervisor',
    workerId: workerData?.id
  }

  return <WorkerAttendanceClient worker={worker} />
}
