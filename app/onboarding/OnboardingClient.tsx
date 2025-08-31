'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShinyButton } from '@/components/ui/ShinnyButton'

interface OnboardingClientProps {
  clerkId: string
}

export default function OnboardingClient({ clerkId }: OnboardingClientProps) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | null>(null)
  const router = useRouter()

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setFormData(prev => ({ ...prev, username }))
    
    if (username.length >= 3 && username.length <= 20) {
      setUsernameStatus('checking')
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const text = await response.text()
          console.error('Username check failed:', response.status, text)
          throw new Error(`HTTP ${response.status}: ${text}`)
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
          const text = await response.text()
          console.error('Non-JSON response received:', text)
          throw new Error('Server returned HTML instead of JSON')
        }
        
        const data = await response.json()
        console.log('Username check response:', data)
        setUsernameStatus(data.available ? 'available' : 'taken')
      } catch (error) {
        console.error('Username check error:', error)
        if (error instanceof Error && error.name === 'AbortError') {
          setError('Username check timed out. Please try again.')
        }
        setUsernameStatus(null)
      }
    } else {
      setUsernameStatus(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Form submitted with data:', formData)
    console.log('🔍 Username status:', usernameStatus)
    
    setIsSubmitting(true)
    setError('')

    // Validate required fields
    if (!formData.username || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      setIsSubmitting(false)
      return
    }

    if (usernameStatus === 'taken') {
      setError('Please choose an available username')
      setIsSubmitting(false)
      return
    }

    if (usernameStatus === 'checking') {
      setError('Please wait for username validation to complete')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('📤 Sending request to /api/onboarding')
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const requestBody = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: 'worker'
      }
      
      console.log('📤 Request body being sent:', requestBody)
      const jsonBody = JSON.stringify(requestBody)
      console.log('📤 Stringified JSON:', jsonBody)
      
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const text = await response.text()
        console.error('Onboarding failed:', response.status, text)
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response received:', text.substring(0, 500))
        throw new Error('Server returned HTML instead of JSON. Check server logs.')
      }

      const data = await response.json()
      console.log('📥 Response data:', data)

      console.log('✅ Account created successfully, redirecting...')
      // Redirect to worker dashboard (all users start as workers)
      router.push('/worker/dashboard')
    } catch (err) {
      console.error('❌ Error during submission:', err)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. The server is taking too long to respond.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create account')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your username and complete your profile to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Choose a unique username"
                  minLength={3}
                  maxLength={20}
                />
                {usernameStatus === 'checking' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {usernameStatus === 'available' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {usernameStatus === 'taken' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {usernameStatus === 'taken' && (
                <p className="mt-1 text-sm text-red-600">This username is already taken</p>
              )}
              {usernameStatus === 'available' && (
                <p className="mt-1 text-sm text-green-600">Username is available!</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your last name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>

          </div>

          <div>
            <ShinyButton
              type="submit"
              disabled={
                isSubmitting || 
                !formData.username || 
                !formData.firstName || 
                !formData.lastName ||
                formData.username.length < 3 ||
                usernameStatus === 'taken' ||
                usernameStatus === 'checking'
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Setup'}
            </ShinyButton>
          </div>
        </form>
      </div>
    </div>
  )
}
