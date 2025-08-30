'use client'

import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Header from '@/components/landing-page/Header'
import About from '@/components/landing-page/About'
import Gallery from '@/components/landing-page/Gallery'
import Metrics from '@/components/landing-page/Metrics'
import Footer from '@/components/landing-page/Footer'
import { getUserByClerkId } from '@/lib/db/user-actions'

const Home = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if user is authenticated and we're on the home page
    if (isLoaded && user && window.location.pathname === '/') {
      // Add a small delay to prevent immediate redirect loops
      const timer = setTimeout(async () => {
        try {
          const dbUser = await getUserByClerkId(user.id)
          
          if (dbUser) {
            // Redirect based on user role
            switch (dbUser.role) {
              case 'worker':
                router.replace('/worker/dashboard')
                break
              case 'supervisor':
                router.replace('/supervisor/dashboard')
                break
              case 'admin':
                router.replace('/admin/dashboard')
                break
              default:
                router.replace('/worker/dashboard')
            }
          } else {
            // User exists in Clerk but not in database
            router.replace('/worker/dashboard')
          }
        } catch (error) {
          console.error('Error checking user role:', error)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
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
        <About />
        <Gallery />
        <Metrics />
        <Footer />
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