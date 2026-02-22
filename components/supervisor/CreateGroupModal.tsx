'use client'

import { useState } from 'react'
import { createGroupWithCurrentSupervisor } from '@/lib/db/actions'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onGroupCreated?: () => void
}

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    geofenceRadius: '100',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!user?.id) {
      setError('User not authenticated')
      setIsSubmitting(false)
      return
    }

    try {
      await createGroupWithCurrentSupervisor({
        name: formData.name,
        description: formData.description || undefined,
        location: formData.location,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        geofenceRadius: formData.geofenceRadius ? parseInt(formData.geofenceRadius) : 100,
      }, user.id)

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        geofenceRadius: '100',
      })
      onClose()
      
      // Trigger refresh callback to update groups list
      if (onGroupCreated) {
        onGroupCreated()
      }
      
      // Also refresh router for good measure
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-900"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-900"
              placeholder="Enter work location"
            />
          </div>

          {/* GPS Coordinates */}
          <div className="border border-gray-200 rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                GPS Coordinates (for geofencing)
              </label>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: pos.coords.latitude.toFixed(7),
                          longitude: pos.coords.longitude.toFixed(7),
                        }))
                      },
                      () => setError('Could not get your location'),
                      { enableHighAccuracy: true }
                    )
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Use My Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm !text-gray-900"
                placeholder="Latitude (e.g. -1.2921)"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm !text-gray-900"
                placeholder="Longitude (e.g. 36.8219)"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Geofence Radius (meters)
              </label>
              <input
                type="number"
                name="geofenceRadius"
                value={formData.geofenceRadius}
                onChange={handleChange}
                min="50"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm !text-gray-900"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will be automatically assigned as the supervisor. GPS coordinates enable geofence verification for worker check-ins.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-900"
              placeholder="Enter group description (optional)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
