'use client'

import WorkerSidebar from '@/components/WorkerSidebar'
import MobileNavigation from '@/components/MobileNavigation'
import FingerprintAuthentication from '@/components/FingerprintAuthentication'
import FaceAuthentication from '@/components/FaceAuthentication'
import AttendanceMethodSettings from '@/components/AttendanceMethodSettings'
import { useIsMobile } from '@/lib/utils/use-is-mobile'
import { useState, useEffect } from 'react'

interface Worker {
  id: number
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
  workerId?: number
  preferredAttendanceMethod: 'fingerprint' | 'face'
  fingerprintEnabled: boolean
  faceEnabled: boolean
}

interface AttendanceRecord {
  id: number
  date: string
  activity: string
  location: string | null
  checkInTime: string | null
  checkOutTime: string | null
  groupName: string | null
  supervisorApproved: boolean | null
}

interface WeeklyStats {
  daysWorked: number
  totalHours: number
  attendanceRate: number
  pendingPayments: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WorkerAttendanceClientProps {}

export default function WorkerAttendanceClient({}: WorkerAttendanceClientProps) {
  const isMobile = useIsMobile()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showFingerprintAuth, setShowFingerprintAuth] = useState(false)
  const [showFaceAuth, setShowFaceAuth] = useState(false)

  const fetchWorkerData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/worker/stats', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/worker/activity', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
      ])

      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setWorker(data.worker)
        setWeeklyStats(data.stats)
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setAttendanceData(activityData.recentActivity || [])
      }
    } catch (error) {
      console.error('Error fetching worker data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkerData()
  }, [])

  if (loading || !worker) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="md:pl-64 p-4 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conditional Navigation */}
      {isMobile ? (
        <MobileNavigation worker={worker} />
      ) : (
        <WorkerSidebar
          worker={worker}
          notifications={0}
        />
      )}

      {/* Main Content */}
      <div className="md:pl-64 p-4 md:p-8 pb-24 md:pb-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance</h1>
              <p className="text-gray-600 mt-1">Track your work hours and check-in status.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{worker.status}</span>
            </div>
          </div>
        </div>

        {/* Check-in Status */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Check In?</h2>
          <p className="text-gray-600 mb-6">Use fingerprint or face recognition to check in. Your GPS location will be verified automatically.</p>

          <div className="space-y-4">
            {/* Attendance Method Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {worker.fingerprintEnabled && (
                <button
                  onClick={() => { setShowFingerprintAuth(!showFingerprintAuth); setShowFaceAuth(false) }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                  {showFingerprintAuth ? 'Hide Fingerprint' : 'Use Fingerprint'}
                </button>
              )}

              {worker.faceEnabled && (
                <button
                  onClick={() => { setShowFaceAuth(!showFaceAuth); setShowFingerprintAuth(false) }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showFaceAuth ? 'Hide Face' : 'Use Face'}
                </button>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Settings
              </button>
            </div>

            {/* Fingerprint Authentication */}
            {showFingerprintAuth && worker.fingerprintEnabled && (
              <div className="mt-6">
                <FingerprintAuthentication
                  onAuthenticationSuccess={async () => {
                    try {
                      const response = await fetch('/api/worker/attendance/checkin', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          method: 'fingerprint',
                          workerId: worker.workerId
                        })
                      })

                      if (response.ok) {
                        alert('✓ Check-in successful! Your attendance has been logged.')
                        setShowFingerprintAuth(false)
                        fetchWorkerData()
                      } else {
                        const error = await response.json()
                        alert(`Check-in failed: ${error.message || 'Unknown error'}`)
                      }
                    } catch (error) {
                      console.error('Check-in error:', error)
                      alert('Failed to log attendance. Please try again.')
                    }
                  }}
                  onAuthenticationError={(error) => {
                    console.error('Fingerprint auth error:', error)
                    alert(`Fingerprint authentication failed: ${error}`)
                  }}
                />
              </div>
            )}

            {/* Face Authentication */}
            {showFaceAuth && worker.faceEnabled && (
              <div className="mt-6">
                <FaceAuthentication
                  workerId={worker.workerId || worker.id}
                  onAuthenticationSuccess={(result) => {
                    alert(`Face ${result.action} successful! (${Math.round(result.matchScore)}% match)`)
                    setShowFaceAuth(false)
                    fetchWorkerData()
                  }}
                  onAuthenticationError={(error) => {
                    console.error('Face auth error:', error)
                  }}
                />
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-6">
                <AttendanceMethodSettings
                  worker={{
                    id: worker.id,
                    preferredAttendanceMethod: worker.preferredAttendanceMethod,
                    fingerprintEnabled: worker.fingerprintEnabled,
                    faceEnabled: worker.faceEnabled,
                  }}
                  onSettingsUpdate={(updatedWorker) => {
                    setWorker({
                      ...worker,
                      preferredAttendanceMethod: updatedWorker.preferredAttendanceMethod,
                      fingerprintEnabled: updatedWorker.fingerprintEnabled,
                      faceEnabled: updatedWorker.faceEnabled,
                    })
                    setShowSettings(false)
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Today: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p>Status: <span className="text-red-600 font-medium">Not Checked In</span></p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Work Start</p>
                    <p className="text-xs text-gray-500">8:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Break Time</p>
                    <p className="text-xs text-gray-500">12:00 PM - 1:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Work End</p>
                    <p className="text-xs text-gray-500">5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Location</p>
                <p className="text-sm text-blue-700">{worker.group}</p>
                <p className="text-xs text-blue-600 mt-1">Supervisor: {worker.supervisor}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">This Week&apos;s Attendance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {attendanceData.length > 0 ? (
                  attendanceData.slice(0, 5).map((record, index) => {
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                    const dayName = days[index] || new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })
                    const isPresent = record.activity === 'present'

                    return (
                      <div key={record.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{dayName}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isPresent ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className={`text-sm font-medium ${isPresent ? 'text-gray-900' : 'text-gray-500'}`}>
                            {isPresent ? (
                              record.checkInTime && record.checkOutTime ?
                                `${new Date(record.checkInTime).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })} - ${new Date(record.checkOutTime).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}` :
                                record.checkInTime ?
                                  `${new Date(record.checkInTime).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })} - In Progress` :
                                  'Present'
                            ) : 'Absent'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No attendance records found</p>
                    <p className="text-xs mt-1">Check in to start tracking your attendance</p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-green-900">Attendance Rate</span>
                  <span className="text-sm font-bold text-green-700">{weeklyStats?.attendanceRate || 0}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-green-700">Days Worked</span>
                  <span className="text-sm text-green-700">{weeklyStats?.daysWorked || 0}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.length > 0 ? (
                  attendanceData.map((record) => {
                    const checkInTime = record.checkInTime ? new Date(record.checkInTime) : null
                    const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null
                    const hoursWorked = checkInTime && checkOutTime ?
                      ((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)).toFixed(1) :
                      checkInTime ? 'In Progress' : '-'

                    const isPresent = record.activity === 'present'

                    return (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {checkInTime ? checkInTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {checkOutTime ? checkOutTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }) : checkInTime ? 'In Progress' : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof hoursWorked === 'string' ? hoursWorked : `${hoursWorked} hrs`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isPresent ? 'bg-green-100 text-green-800' :
                            record.activity === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.activity.charAt(0).toUpperCase() + record.activity.slice(1)}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <p className="text-sm">No attendance history found</p>
                      <p className="text-xs mt-1">Your attendance records will appear here once you start checking in</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
