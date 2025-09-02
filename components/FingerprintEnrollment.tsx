'use client'

import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'

interface FingerprintEnrollmentProps {
  onEnrollmentComplete?: () => void
  onCancel?: () => void
}

export default function FingerprintEnrollment({ 
  onEnrollmentComplete, 
  onCancel 
}: FingerprintEnrollmentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleEnrollFingerprint = async () => {
    setIsEnrolling(true)
    setError(null)

    try {
      // Step 1: Get registration options from the server
      const optionsResponse = await fetch('/api/webauthn/generate-registration-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options')
      }

      const options = await optionsResponse.json()

      // Step 2: Start the WebAuthn registration process
      const credential = await startRegistration(options)

      // Step 3: Send the credential to the server for verification
      const verificationResponse = await fetch('/api/webauthn/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      })

      const verificationResult = await verificationResponse.json()

      if (verificationResult.verified) {
        setSuccess(true)
        setTimeout(() => {
          onEnrollmentComplete?.()
        }, 2000)
      } else {
        throw new Error(verificationResult.error || 'Registration failed')
      }
    } catch (err: unknown) {
      console.error('Fingerprint enrollment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to enroll fingerprint')
    } finally {
      setIsEnrolling(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fingerprint Enrolled!</h3>
        <p className="text-gray-600 mb-4">Your fingerprint has been successfully enrolled for attendance.</p>
        <div className="text-sm text-gray-500">
          You can now use fingerprint authentication for check-in and check-out.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enroll Your Fingerprint</h3>
        <p className="text-gray-600 mb-4">
          Set up fingerprint authentication for quick and secure attendance check-in.
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

      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Before you start:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure your device supports fingerprint authentication</li>
            <li>• Ensure your browser allows biometric authentication</li>
            <li>• Have your finger ready to scan when prompted</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleEnrollFingerprint}
            disabled={isEnrolling}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {isEnrolling ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enrolling...
              </div>
            ) : (
              'Enroll Fingerprint'
            )}
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isEnrolling}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
