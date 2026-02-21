'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { loadHuman, detectFace } from '@/lib/face-recognition'

interface FaceAuthenticationProps {
  workerId: number
  onAuthenticationSuccess: (result: { action: string; matchScore: number }) => void
  onAuthenticationError?: (error: string) => void
}

type Step = 'loading' | 'ready' | 'verifying' | 'gps' | 'success' | 'error'

export default function FaceAuthentication({
  workerId,
  onAuthenticationSuccess,
  onAuthenticationError,
}: FaceAuthenticationProps) {
  const [step, setStep] = useState<Step>('loading')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('Loading face detection...')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStep('ready')
      setStatusMessage('Look at the camera and tap Verify')
    } catch {
      setError('Camera access denied. Please allow camera permissions.')
      setStep('error')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadHuman()
        if (!cancelled) await startCamera()
      } catch {
        if (!cancelled) {
          setError('Failed to load face detection models.')
          setStep('error')
        }
      }
    })()
    return () => {
      cancelled = true
      stopCamera()
    }
  }, [startCamera, stopCamera])

  const getGPSPosition = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  const handleVerify = async () => {
    if (!videoRef.current) return
    setStep('verifying')
    setStatusMessage('Scanning face...')

    try {
      const result = await detectFace(videoRef.current)

      if (!result) {
        setStatusMessage('No face detected. Look directly at the camera.')
        setStep('ready')
        return
      }

      if (result.confidence < 0.5) {
        setStatusMessage('Face unclear. Try better lighting.')
        setStep('ready')
        return
      }

      if (result.isReal < 0.5) {
        setStatusMessage('Liveness check failed. Use your real face.')
        setStep('ready')
        return
      }

      // Get GPS
      setStep('gps')
      setStatusMessage('Getting your location...')
      const gps = await getGPSPosition()

      // Send face descriptor to the server for verification + attendance
      setStatusMessage('Verifying identity...')
      const response = await fetch('/api/scanner/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'face',
          workerId,
          faceDescriptor: result.descriptor,
          latitude: gps?.latitude ?? null,
          longitude: gps?.longitude ?? null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errMsg = data.error || 'Face verification failed'
        setError(errMsg)
        setStep('error')
        onAuthenticationError?.(errMsg)
        return
      }

      stopCamera()
      setStep('success')
      setStatusMessage(
        `${data.action === 'check-out' ? 'Checked out' : 'Checked in'} successfully! (${Math.round(data.attendance.matchScore)}% match)`
      )
      onAuthenticationSuccess({
        action: data.action,
        matchScore: data.attendance.matchScore,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
      setStep('error')
      onAuthenticationError?.(msg)
    }
  }

  const handleRetry = () => {
    setError(null)
    setStep('ready')
    setStatusMessage('Look at the camera and tap Verify')
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified!</h3>
        <p className="text-gray-600 text-sm">{statusMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Face Check-In</h3>
        <p className="text-sm text-gray-600">{statusMessage}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Camera Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-[4/3]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-60 border-2 border-dashed border-white/50 rounded-full" />
        </div>
        {(step === 'loading' || step === 'verifying' || step === 'gps') && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm">
                {step === 'loading' && 'Loading models...'}
                {step === 'verifying' && 'Scanning face...'}
                {step === 'gps' && 'Getting location...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {step === 'ready' && (
          <button
            onClick={handleVerify}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Verify Face
          </button>
        )}

        {step === 'error' && (
          <button
            onClick={handleRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
