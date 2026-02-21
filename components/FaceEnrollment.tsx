'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { loadHuman, detectFace, type FaceDetectionResult } from '@/lib/face-recognition'

interface FaceEnrollmentProps {
  onEnrollmentComplete?: () => void
  onCancel?: () => void
}

type Step = 'loading' | 'ready' | 'capturing' | 'confirming' | 'enrolling' | 'success' | 'error'

export default function FaceEnrollment({
  onEnrollmentComplete,
  onCancel,
}: FaceEnrollmentProps) {
  const [step, setStep] = useState<Step>('loading')
  const [error, setError] = useState<string | null>(null)
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null)
  const [statusMessage, setStatusMessage] = useState('Loading face detection models...')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>(0)

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = 0
    }
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
      setStatusMessage('Position your face in the frame and click Capture')
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
        if (!cancelled) {
          await startCamera()
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load face detection models. Check your internet connection.')
          setStep('error')
        }
      }
    })()

    return () => {
      cancelled = true
      stopCamera()
    }
  }, [startCamera, stopCamera])

  const handleCapture = async () => {
    if (!videoRef.current) return
    setStep('capturing')
    setStatusMessage('Detecting face...')

    try {
      const result = await detectFace(videoRef.current)

      if (!result) {
        setStatusMessage('No face detected. Please look directly at the camera.')
        setStep('ready')
        return
      }

      if (result.confidence < 0.5) {
        setStatusMessage('Face detection confidence too low. Try better lighting.')
        setStep('ready')
        return
      }

      if (result.isReal < 0.5) {
        setStatusMessage('Liveness check failed. Please use a real face, not a photo.')
        setStep('ready')
        return
      }

      setFaceResult(result)
      setStep('confirming')
      setStatusMessage(`Face detected (${Math.round(result.confidence * 100)}% confidence). Save this face?`)
    } catch {
      setStatusMessage('Face detection failed. Please try again.')
      setStep('ready')
    }
  }

  const handleEnroll = async () => {
    if (!faceResult) return
    setStep('enrolling')
    setStatusMessage('Saving face data...')

    try {
      const response = await fetch('/api/face/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor: faceResult.descriptor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Enrollment failed')
      }

      stopCamera()
      setStep('success')
      setStatusMessage('Face enrolled successfully!')
      setTimeout(() => {
        onEnrollmentComplete?.()
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to enroll face')
      setStep('error')
    }
  }

  const handleRetry = () => {
    setFaceResult(null)
    setError(null)
    setStep('ready')
    setStatusMessage('Position your face in the frame and click Capture')
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Face Enrolled!</h3>
        <p className="text-gray-600">Your face has been enrolled for attendance check-in.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Enroll Your Face</h3>
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
          className="w-full h-full object-cover mirror"
          style={{ transform: 'scaleX(-1)' }}
        />
        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-60 border-2 border-dashed border-white/50 rounded-full" />
        </div>
        {step === 'loading' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm">Loading models...</p>
            </div>
          </div>
        )}
        {step === 'capturing' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm">Analyzing face...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {(step === 'ready' || step === 'capturing') && (
          <button
            onClick={handleCapture}
            disabled={step === 'capturing'}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {step === 'capturing' ? 'Detecting...' : 'Capture Face'}
          </button>
        )}

        {step === 'confirming' && (
          <>
            <button
              onClick={handleEnroll}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Save Face
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retake
            </button>
          </>
        )}

        {step === 'enrolling' && (
          <button disabled className="flex-1 bg-green-400 text-white px-4 py-3 rounded-lg font-medium">
            Saving...
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

        {onCancel && (
          <button
            onClick={() => { stopCamera(); onCancel() }}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Tips */}
      {(step === 'ready' || step === 'loading') && (
        <div className="mt-4 bg-blue-50 rounded-lg p-3">
          <h4 className="text-xs font-medium text-blue-900 mb-1">Tips for best results:</h4>
          <ul className="text-xs text-blue-800 space-y-0.5">
            <li>- Good lighting on your face</li>
            <li>- Look directly at the camera</li>
            <li>- Remove sunglasses or face coverings</li>
          </ul>
        </div>
      )}
    </div>
  )
}
