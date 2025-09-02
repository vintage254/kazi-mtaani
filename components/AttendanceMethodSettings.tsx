'use client'

import { useState } from 'react'
import FingerprintEnrollment from './FingerprintEnrollment'

interface Worker {
  id: number
  preferredAttendanceMethod: 'qr_code' | 'fingerprint' | 'both'
  fingerprintEnabled: boolean
}

interface AttendanceMethodSettingsProps {
  worker: Worker
  onSettingsUpdate?: (updatedWorker: Worker) => void
}

export default function AttendanceMethodSettings({ 
  worker, 
  onSettingsUpdate 
}: AttendanceMethodSettingsProps) {
  const [selectedMethod, setSelectedMethod] = useState(worker.preferredAttendanceMethod)
  const [showEnrollment, setShowEnrollment] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMethodChange = async (method: 'qr_code' | 'fingerprint' | 'both') => {
    if (method === 'fingerprint' || method === 'both') {
      if (!worker.fingerprintEnabled) {
        setShowEnrollment(true)
        return
      }
    }

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/worker/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferredAttendanceMethod: method,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      setSelectedMethod(method)
      onSettingsUpdate?.({
        ...worker,
        preferredAttendanceMethod: method,
      })
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEnrollmentComplete = () => {
    setShowEnrollment(false)
    // Update worker state to reflect fingerprint is now enabled
    const updatedWorker = {
      ...worker,
      fingerprintEnabled: true,
      preferredAttendanceMethod: selectedMethod as 'qr_code' | 'fingerprint' | 'both'
    }
    onSettingsUpdate?.(updatedWorker)
    handleMethodChange(selectedMethod)
  }

  const handleDisableFingerprint = async () => {
    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/worker/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fingerprintEnabled: false,
          preferredAttendanceMethod: 'qr_code',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to disable fingerprint')
      }

      setSelectedMethod('qr_code')
      onSettingsUpdate?.({
        ...worker,
        fingerprintEnabled: false,
        preferredAttendanceMethod: 'qr_code',
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to disable fingerprint')
    } finally {
      setIsUpdating(false)
    }
  }

  if (showEnrollment) {
    return (
      <FingerprintEnrollment
        onEnrollmentComplete={handleEnrollmentComplete}
        onCancel={() => setShowEnrollment(false)}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Method</h3>
        <p className="text-gray-600 text-sm">
          Choose how you prefer to check in for attendance. You can always change this later.
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
        {/* QR Code Option */}
        <div className="border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="attendanceMethod"
              value="qr_code"
              checked={selectedMethod === 'qr_code'}
              onChange={() => handleMethodChange('qr_code')}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m6-4h.01M12 8h.01M12 8h4.01M12 8H7.99" />
                </svg>
                <span className="font-medium text-gray-900">QR Code Only</span>
              </div>
              <p className="text-sm text-gray-600">
                Use QR codes for attendance. Works on all devices and scanners.
              </p>
            </div>
          </label>
        </div>

        {/* Fingerprint Option */}
        <div className="border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="attendanceMethod"
              value="fingerprint"
              checked={selectedMethod === 'fingerprint'}
              onChange={() => handleMethodChange('fingerprint')}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                <span className="font-medium text-gray-900">Fingerprint Only</span>
                {!worker.fingerprintEnabled && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Quick and secure fingerprint authentication. Requires device with fingerprint sensor.
              </p>
            </div>
          </label>
        </div>

        {/* Both Options */}
        <div className="border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="attendanceMethod"
              value="both"
              checked={selectedMethod === 'both'}
              onChange={() => handleMethodChange('both')}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium text-gray-900">Both Methods</span>
                {!worker.fingerprintEnabled && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Use either QR code or fingerprint. Maximum flexibility and backup options.
              </p>
            </div>
          </label>
        </div>
      </div>

      {worker.fingerprintEnabled && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Fingerprint Status</h4>
              <p className="text-sm text-green-600">✓ Enrolled and active</p>
            </div>
            <button
              onClick={handleDisableFingerprint}
              disabled={isUpdating}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Disable Fingerprint
            </button>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating settings...
          </div>
        </div>
      )}
    </div>
  )
}
