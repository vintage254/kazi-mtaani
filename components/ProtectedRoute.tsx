'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserByClerkIdAction, createUserAction } from '@/lib/db/actions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'worker' | 'supervisor' | 'admin'
  allowedRoles?: ('worker' | 'supervisor' | 'admin')[]
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!isLoaded) return

      if (!user) {
        router.push('/')
        return
      }

      try {
        console.log('🔐 ProtectedRoute: Checking user authorization for:', user.id)
        const dbUser = await getUserByClerkIdAction(user.id)
        
        if (!dbUser) {
          console.log('❌ No user found in database, creating as worker automatically')
          try {
            const newUser = await createUserAction({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              role: 'worker',
              phone: user.primaryPhoneNumber?.phoneNumber || ''
            })
            console.log('✅ Auto-created user as worker:', newUser)
            
            // Continue with the newly created user
            setIsAuthorized(true)
            return
          } catch (error) {
            console.error('Error auto-creating user:', error)
            router.push('/')
            return
          }
        }
        
        console.log('✅ User found in database:', dbUser)

        // Check if user has required role
        if (requiredRole && dbUser.role !== requiredRole) {
          // Redirect to appropriate dashboard based on user's actual role
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
          return
        }

        // Check if user is in allowed roles list
        if (allowedRoles && dbUser.role && !allowedRoles.includes(dbUser.role)) {
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
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Error checking authorization:', error)
        router.push('/onboarding')
      }
    }

    checkAuthorization()
  }, [user, isLoaded, router, requiredRole, allowedRoles])

  if (!isLoaded || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will be redirected by useEffect
  }

  return <>{children}</>
}
