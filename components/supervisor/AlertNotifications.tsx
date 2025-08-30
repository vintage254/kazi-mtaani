'use client'

import { useState, useEffect } from 'react'
import { getRecentAlerts } from '@/lib/db/alert-history-actions'

interface Alert {
  id: number
  type: string
  title: string
  description: string | null
  severity: string | null
  isRead: boolean | null
  createdAt: Date | null
}

interface AlertNotificationsProps {
  onNewAlert?: (alert: Alert) => void
}

export default function AlertNotifications({ onNewAlert }: AlertNotificationsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Poll for new alerts every 30 seconds
    const pollAlerts = async () => {
      try {
        const recentAlerts = await getRecentAlerts(5)
        setAlerts(recentAlerts)
        
        // Check for new alerts
        if (recentAlerts.length > 0 && onNewAlert) {
          recentAlerts.forEach(alert => {
            if (!alert.isRead) {
              onNewAlert(alert)
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      }
    }

    // Initial fetch
    pollAlerts()

    // Set up polling interval
    const interval = setInterval(pollAlerts, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [onNewAlert])

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.334c-.706 0-1.334-.895-1.334-2V9c0-3.866 3.582-7 8-7s8 3.134 8 7v8c0 1.105-.628 2-1.334 2H15" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isVisible && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Alerts</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent alerts</p>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.isRead ? 'bg-gray-50' : 'bg-white'
                    }`}
                    style={{ borderLeftColor: getSeverityColor(alert.severity).replace('bg-', '#') }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Unknown time'}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {alerts.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={() => {
                    setIsVisible(false)
                    window.location.href = '/supervisor/alerts'
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                >
                  View All Alerts
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
