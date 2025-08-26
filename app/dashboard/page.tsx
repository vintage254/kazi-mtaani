'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserByClerkId } from '@/lib/db/user-actions'

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoaded || !user) return

      setIsRedirecting(true)

      try {
        // Check if user exists in our database
        const dbUser = await getUserByClerkId(user.id)
        
        if (!dbUser) {
          // User doesn't exist in database, send to onboarding
          router.push('/onboarding')
          return
        }

        // Redirect based on role
        switch (dbUser.role) {
          case 'worker':
            router.push('/worker/dashboard')
            break
          case 'supervisor':
            router.push('/supervisor/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/onboarding')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        // If there's an error, send to onboarding as fallback
        router.push('/onboarding')
      }
    }

    handleRedirect()
  }, [user, isLoaded, router])

  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return null
}
