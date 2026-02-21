'use client'

import { useState } from 'react'
import FingerprintEnrollment from './FingerprintEnrollment'
import FaceEnrollment from './FaceEnrollment'

interface Worker {
  id: number
  preferredAttendanceMethod: 'fingerprint' | 'face'
  fingerprintEnabled: boolean
  faceEnabled: boolean
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
  const [showFaceEnrollment, setShowFaceEnrollment] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMethodChange = async (method: 'fingerprint' | 'face') => {
    if (method === 'fingerprint' && !worker.fingerprintEnabled) {
      setShowEnrollment(true)
      return
    }
    if (method === 'face' && !worker.faceEnabled) {
      setShowFaceEnrollment(true)
      return
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEnrollmentComplete = () => {
    setShowEnrollment(false)
    const updatedWorker = {
      ...worker,
      fingerprintEnabled: true,
      preferredAttendanceMethod: 'fingerprint' as const,
    }
    onSettingsUpdate?.(updatedWorker)
    handleMethodChange('fingerprint')
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
          preferredAttendanceMethod: 'face',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to disable fingerprint')
      }

      setSelectedMethod('face')
      onSettingsUpdate?.({
        ...worker,
        fingerprintEnabled: false,
        preferredAttendanceMethod: 'face',
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to disable fingerprint')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFaceEnrollmentComplete = () => {
    setShowFaceEnrollment(false)
    const updatedWorker = {
      ...worker,
      faceEnabled: true,
      preferredAttendanceMethod: 'face' as const,
    }
    onSettingsUpdate?.(updatedWorker)
    handleMethodChange('face')
  }

  if (showEnrollment) {
    return (
      <FingerprintEnrollment
        onEnrollmentComplete={handleEnrollmentComplete}
        onCancel={() => setShowEnrollment(false)}
      />
    )
  }

  if (showFaceEnrollment) {
    return (
      <FaceEnrollment
        onEnrollmentComplete={handleFaceEnrollmentComplete}
        onCancel={() => setShowFaceEnrollment(false)}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Method</h3>
        <p className="text-gray-600 text-sm">
          Choose how you prefer to check in for attendance. Your GPS location will be verified automatically.
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
        {/* Fingerprint Option */}
        <div className={`border rounded-lg p-4 ${selectedMethod === 'fingerprint' ? 'border-blue-500 bg-blue-50' : ''}`}>
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
                <span className="font-medium text-gray-900">Fingerprint</span>
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

        {/* Face Recognition Option */}
        <div className={`border rounded-lg p-4 ${selectedMethod === 'face' ? 'border-green-500 bg-green-50' : ''}`}>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="attendanceMethod"
              value="face"
              checked={selectedMethod === 'face'}
              onChange={() => handleMethodChange('face')}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium text-gray-900">Face Recognition</span>
                {!worker.faceEnabled && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Use your camera for face recognition check-in. Includes liveness detection to prevent spoofing.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* GPS Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">GPS Verification Active</p>
            <p className="text-xs text-blue-700">
              Your location is verified automatically when you check in. You must be within the work site geofence.
            </p>
          </div>
        </div>
      </div>

      {/* Biometric Status */}
      <div className="mt-6 pt-4 border-t space-y-3">
        {worker.fingerprintEnabled && (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Fingerprint</h4>
              <p className="text-sm text-green-600">Enrolled and active</p>
            </div>
            <button
              onClick={handleDisableFingerprint}
              disabled={isUpdating}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Disable
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Face Recognition</h4>
            {worker.faceEnabled ? (
              <p className="text-sm text-green-600">Enrolled and active</p>
            ) : (
              <p className="text-sm text-gray-500">Not set up yet</p>
            )}
          </div>
          {!worker.faceEnabled && (
            <button
              onClick={() => setShowFaceEnrollment(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Enroll Face
            </button>
          )}
        </div>
      </div>

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
