'use client'

import { useState, useEffect } from 'react'
import { assignWorkerToGroup, getUnassignedWorkers, createMissingWorkerRecords, sendQRCodesToGroupWorkers, cleanupDuplicateWorkers } from '@/lib/db/actions'
import { useRouter } from 'next/navigation'

interface AssignWorkerModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: number
  groupName: string
}

interface UnassignedWorker {
  id: number
  firstName: string | null
  lastName: string | null
  phone: string | null
  position: string | null
  isActive: boolean | null
}

export default function AssignWorkerModal({ isOpen, onClose, groupId, groupName }: AssignWorkerModalProps) {
  const [unassignedWorkers, setUnassignedWorkers] = useState<UnassignedWorker[]>([])
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      loadUnassignedWorkers()
    }
  }, [isOpen])

  const loadUnassignedWorkers = async () => {
    setIsLoading(true)
    try {
      // First, clean up any duplicate worker records
      await cleanupDuplicateWorkers()
      
      // Then, create missing worker records for users with worker role
      await createMissingWorkerRecords()
      
      // Finally get unassigned workers
      const workers = await getUnassignedWorkers()
      
      setUnassignedWorkers(workers)
    } catch {
      setError('Failed to load unassigned workers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWorkerToggle = (workerId: number) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    )
  }

  const handleSubmit = async () => {
    if (selectedWorkers.length === 0) return

    setIsSubmitting(true)
    setError('')

    try {
      // Assign each selected worker to the group
      await Promise.all(
        selectedWorkers.map(workerId => assignWorkerToGroup(workerId, groupId))
      )

      // Send QR codes to all newly assigned workers
      const emailResult = await sendQRCodesToGroupWorkers(groupId)
      
      if (emailResult.success > 0) {
        console.log(`QR codes sent to ${emailResult.success}/${emailResult.total} workers`)
      }

      setSelectedWorkers([])
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign workers')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Workers to {groupName}
          </h2>
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

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Select workers to assign to this group. Only unassigned workers are shown.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {unassignedWorkers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No unassigned workers available
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {unassignedWorkers.map(worker => (
                    <div key={worker.id} className="p-4 hover:bg-gray-50">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={() => handleWorkerToggle(worker.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {worker.firstName} {worker.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{worker.phone}</p>
                              <p className="text-sm text-gray-500">{worker.position}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              worker.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {worker.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                {selectedWorkers.length} worker{selectedWorkers.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedWorkers.length === 0 || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : `Assign ${selectedWorkers.length} Worker${selectedWorkers.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
