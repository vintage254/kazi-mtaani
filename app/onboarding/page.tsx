import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/db/user-actions'
import OnboardingClient from './OnboardingClient'

const OnboardingPage = async () => {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user already exists and has completed onboarding
  const existingUser = await getUserByClerkId(userId)
  if (existingUser && existingUser.username && !existingUser.username.startsWith('user_')) {
    // User already has proper username, redirect to appropriate dashboard
    if (existingUser.role === 'supervisor') {
      redirect('/supervisor/dashboard')
    } else {
      redirect('/worker/dashboard')
    }
  }

  return <OnboardingClient clerkId={userId} />
}

export default OnboardingPage
