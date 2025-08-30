import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/db/user-actions'
import { getWorkerByUserId } from '@/lib/db/worker-actions'
import WorkerProfileClient from './WorkerProfileClient'

export default async function WorkerProfilePage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()
  
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
  
  // Determine profile picture source
  let profilePicture = ""
  
  if (clerkUser?.hasImage) {
    // Use Google/OAuth profile picture if available
    profilePicture = clerkUser.imageUrl
  } else {
    // Use empty/default profile picture for email authentication
    profilePicture = ""
  }
  
  // Create worker object for sidebar with proper profile handling
  const worker = {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker',
    avatar: profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: user.firstName?.toLowerCase() || 'worker',
    status: "Online",
    group: workerData?.groupName || 'No Group Assigned',
    supervisor: workerData?.supervisorName || 'No Supervisor'
  }

  // Enhanced user object with Clerk data
  const enhancedUser = {
    ...user,
    firstName: user.firstName || clerkUser?.firstName || null,
    lastName: user.lastName || clerkUser?.lastName || null,
    email: user.email || clerkUser?.emailAddresses[0]?.emailAddress || '',
    profileImage: profilePicture
  }

  return <WorkerProfileClient worker={worker} user={enhancedUser} workerData={workerData} />
}
