import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/db/user-actions'

export async function checkUserRoleAndRedirect() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get user from database
  const user = await getUserByClerkId(userId)
  
  if (!user) {
    // User exists in Clerk but not in our database - create them
    redirect('/onboarding')
  }

  return user
}

export async function redirectBasedOnRole() {
  const user = await checkUserRoleAndRedirect()
  
  if (user.role === 'worker') {
    redirect('/worker/dashboard')
  } else if (user.role === 'supervisor') {
    redirect('/supervisor/dashboard')
  } else if (user.role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    // Default redirect if role is unclear
    redirect('/onboarding')
  }
}
