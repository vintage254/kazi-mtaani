'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/db/user-actions'

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'worker' | 'supervisor'>('worker')

  const handleRoleSubmission = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      await createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: selectedRole,
        phone: user.primaryPhoneNumber?.phoneNumber || ''
      })

      // Redirect based on role
      if (selectedRole === 'worker') {
        router.push('/worker/dashboard')
      } else {
        router.push('/supervisor/dashboard')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kazi Mtaani!</h1>
          <p className="text-gray-600">Hi {user?.firstName}, please select your role to get started.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedRole === 'worker' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('worker')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedRole === 'worker' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}>
                {selectedRole === 'worker' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Worker</h3>
                <p className="text-sm text-gray-600">Track attendance, view payments, and manage your work</p>
              </div>
            </div>
          </div>

          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedRole === 'supervisor' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('supervisor')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedRole === 'supervisor' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}>
                {selectedRole === 'supervisor' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Supervisor</h3>
                <p className="text-sm text-gray-600">Manage groups, oversee workers, and track progress</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRoleSubmission}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          {isLoading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
