'use client'

import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Header from '@/components/landing-page/Header'
import { getUserByClerkIdAction } from '@/lib/db/actions'

const Home = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const redirectAuthenticatedUser = async () => {
      if (!isLoaded) return
      
      if (user) {
        console.log(' Authenticated user detected, checking role for redirect')
        try {
          const dbUser = await getUserByClerkIdAction(user.id)
          
          if (dbUser) {
            // Redirect based on user role
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
                router.push('/worker/dashboard')
            }
          } else {
            // User exists in Clerk but not in database, redirect to worker dashboard
            // ProtectedRoute will handle auto-creation
            router.push('/worker/dashboard')
          }
        } catch (error) {
          console.error('Error checking user role:', error)
          // Default to worker dashboard if error
          router.push('/worker/dashboard')
        }
      }
    }

    redirectAuthenticatedUser()
  }, [user, isLoaded, router])

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Only show landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Header />
      </div>
    )
  }

  // Show loading while redirecting authenticated users
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default Home