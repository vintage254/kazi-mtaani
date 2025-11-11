'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'

interface FingerprintAuthenticationProps {
  onAuthenticationSuccess?: () => void
  onAuthenticationError?: (error: string) => void
}

export default function FingerprintAuthentication({ 
  onAuthenticationSuccess, 
  onAuthenticationError 
}: FingerprintAuthenticationProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFingerprintAuth = async () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      // Step 1: Get authentication options from the server
      const optionsResponse = await fetch('/api/webauthn/generate-authentication-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!optionsResponse.ok) {
        throw new Error('Failed to get authentication options')
      }

      const options = await optionsResponse.json()

      // Step 2: Start the WebAuthn authentication process
      const credential = await startAuthentication(options)

      // Step 3: Send the credential to the server for verification
      const verificationResponse = await fetch('/api/webauthn/verify-authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      })

      const verificationResult = await verificationResponse.json()

      if (verificationResult.verified) {
        onAuthenticationSuccess?.()
      } else {
        throw new Error(verificationResult.error || 'Authentication failed')
      }
    } catch (err: unknown) {
      console.error('Fingerprint authentication error:', err)
      let errorMessage = 'Failed to authenticate with fingerprint'
      
      if (err instanceof Error) {
        // Provide more user-friendly error messages
        if (err.message.includes('timed out') || err.message.includes('timeout')) {
          errorMessage = 'Authentication timed out. Please try again and respond to the fingerprint prompt quickly.'
        } else if (err.message.includes('not allowed') || err.message.includes('NotAllowedError')) {
          errorMessage = 'Authentication was cancelled or not allowed. Please try again and allow fingerprint access.'
        } else if (err.message.includes('No authenticators registered')) {
          errorMessage = 'No fingerprint enrolled. Please enroll your fingerprint first.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      onAuthenticationError?.(errorMessage)
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fingerprint Check-In</h3>
        <p className="text-gray-600 mb-4">
          Use your enrolled fingerprint to quickly check in for attendance.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleFingerprintAuth}
        disabled={isAuthenticating}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
      >
        {isAuthenticating ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Authenticating...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            Authenticate with Fingerprint
          </div>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Touch your fingerprint sensor when prompted by your device
        </p>
      </div>
    </div>
  )
}
