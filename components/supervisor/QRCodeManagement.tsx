'use client'

import { useState } from 'react'
import { sendQRCodesToGroupWorkers } from '@/lib/db/actions'

interface QRCodeManagementProps {
  groupId: number
  groupName: string
  workerCount: number
}

export default function QRCodeManagement({ groupId, groupName, workerCount }: QRCodeManagementProps) {
  const [isSending, setIsSending] = useState(false)
  const [lastSent, setLastSent] = useState<string | null>(null)
  const [sendResult, setSendResult] = useState<{ success: number; total: number } | null>(null)

  const handleSendQRCodes = async () => {
    setIsSending(true)
    setSendResult(null)

    try {
      const result = await sendQRCodesToGroupWorkers(groupId)
      setSendResult(result)
      setLastSent(new Date().toLocaleString())
    } catch (error) {
      console.error('Error sending QR codes:', error)
      setSendResult({ success: 0, total: workerCount })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">QR Code Management</h3>
          <p className="text-sm text-gray-600">Send attendance QR codes to group workers</p>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Group: {groupName}</p>
            <p className="text-sm text-gray-600">{workerCount} workers assigned</p>
            {lastSent && (
              <p className="text-xs text-gray-500">Last sent: {lastSent}</p>
            )}
          </div>
          <button
            onClick={handleSendQRCodes}
            disabled={isSending || workerCount === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isSending ? 'Sending...' : 'Send QR Codes'}
          </button>
        </div>

        {sendResult && (
          <div className={`p-4 rounded-lg ${
            sendResult.success === sendResult.total 
              ? 'bg-green-50 border border-green-200' 
              : sendResult.success > 0 
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {sendResult.success === sendResult.total ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : sendResult.success > 0 ? (
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`text-sm font-medium ${
                sendResult.success === sendResult.total 
                  ? 'text-green-800' 
                  : sendResult.success > 0 
                    ? 'text-yellow-800'
                    : 'text-red-800'
              }`}>
                QR codes sent to {sendResult.success} of {sendResult.total} workers
              </p>
            </div>
            {sendResult.success < sendResult.total && (
              <p className="text-xs text-gray-600 mt-1">
                Some workers may not have valid email addresses. Check worker profiles.
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• QR codes are automatically sent when workers are assigned to groups</p>
          <p>• Each worker receives a unique QR code valid for 30 days</p>
          <p>• Workers can also view their QR codes in their attendance page</p>
          <p>• QR codes contain worker ID, group info, and security validation</p>
        </div>
      </div>
    </div>
  )
}
