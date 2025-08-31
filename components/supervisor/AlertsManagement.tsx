'use client'

import { useState, useTransition } from 'react'
import { markAlertAsRead, resolveAlert, generateLowAttendanceAlerts, generatePaymentPendingAlerts, getAllAlerts } from '@/lib/db/alerts-actions'
import { bulkMarkAlertsAsRead, bulkResolveAlerts } from '@/lib/db/alert-history-actions'

interface Alert {
  id: number
  type: string
  title: string
  description: string | null
  severity: string | null
  workerName: string | null
  groupName: string | null
  createdAt: Date | null
  isRead: boolean | null
  resolvedAt?: Date | null
}

interface User {
  id: number
  clerkId: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  role: string | null
  phone: string | null
  isActive: boolean | null
}

interface AlertsManagementProps {
  initialAlerts: Alert[]
  currentUser: User
}

export default function AlertsManagement({ initialAlerts, currentUser }: AlertsManagementProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([])
  const [filters, setFilters] = useState({
    severity: '',
    isRead: '',
    type: ''
  })
  const [isPending, startTransition] = useTransition()

  const handleMarkAsRead = async (alertId: number) => {
    startTransition(async () => {
      try {
        await markAlertAsRead(alertId)
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, isRead: true } : alert
        ))
      } catch (error) {
        console.error('Error marking alert as read:', error)
      }
    })
  }

  const handleResolveAlert = async (alertId: number) => {
    startTransition(async () => {
      try {
        await resolveAlert(alertId)
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, isRead: true, resolvedAt: new Date() } : alert
        ))
      } catch (error) {
        console.error('Error resolving alert:', error)
      }
    })
  }

  const handleGenerateAlerts = async () => {
    startTransition(async () => {
      try {
        await Promise.all([
          generateLowAttendanceAlerts(),
          generatePaymentPendingAlerts()
        ])
        setAlerts(await getAllAlerts())
      } catch (error) {
        console.error('Error generating alerts:', error)
      }
    })
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity && alert.severity !== filters.severity) return false
    if (filters.isRead !== '' && alert.isRead !== (filters.isRead === 'true')) return false
    if (filters.type && alert.type !== filters.type) return false
    return true
  })


  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string | null) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Unread</p>
          <p className="text-2xl font-bold text-red-600">{alerts.filter(a => !a.isRead).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Critical/High</p>
          <p className="text-2xl font-bold text-orange-600">
            {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.resolvedAt).length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
              <select
                value={filters.isRead}
                onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Alerts</option>
                <option value="false">Unread Only</option>
                <option value="true">Read Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerateAlerts}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Generating...' : 'Generate New Alerts'}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Alert History</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAlerts.length} alert(s) found
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-6 ${!alert.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        {!alert.isRead && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Type: {alert.type}</span>
                        {alert.workerName && (
                          <span>Worker: {alert.workerName}</span>
                        )}
                        {alert.groupName && (
                          <span>Group: {alert.groupName}</span>
                        )}
                        <span>Created: {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Unknown'}</span>
                        {alert.resolvedAt && (
                          <span className="text-green-600">Resolved: {new Date(alert.resolvedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        disabled={isPending}
                        className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
                      >
                        Mark Read
                      </button>
                    )}
                    {!alert.resolvedAt && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        disabled={isPending}
                        className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.222 3.777l6.717 6.717m0 0l2.828 2.828m-2.828-2.828L13.767 8.04m0 0l3.356-3.356a1 1 0 011.414 0l2.828 2.828a1 1 0 010 1.414l-3.356 3.356m-1.414-1.414L9.04 13.767m0 0L6.222 16.555a1 1 0 01-1.414 0L2 13.767a1 1 0 010-1.414l2.828-2.828a1 1 0 011.414 0z" />
              </svg>
              <p>No alerts found</p>
              <p className="text-sm">Click &quot;Generate New Alerts&quot; to check for issues</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Types Info */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <h5 className="font-medium text-gray-900">Low Attendance</h5>
            <p className="text-sm text-gray-600">Groups with attendance below 70%</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h5 className="font-medium text-gray-900">Payment Pending</h5>
            <p className="text-sm text-gray-600">Payments pending for more than 3 days</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h5 className="font-medium text-gray-900">System Health</h5>
            <p className="text-sm text-gray-600">System monitoring notifications</p>
          </div>
        </div>
      </div>
    </div>
  )
}
