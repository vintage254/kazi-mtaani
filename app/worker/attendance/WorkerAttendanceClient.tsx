'use client'

import WorkerSidebar from '@/components/WorkerSidebar'
import MobileNavigation from '@/components/MobileNavigation'
import FingerprintAuthentication from '@/components/FingerprintAuthentication'
import AttendanceMethodSettings from '@/components/AttendanceMethodSettings'
import { useIsMobile } from '@/lib/utils/use-is-mobile'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Worker {
  id: number
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
  workerId?: number
  preferredAttendanceMethod: 'qr_code' | 'fingerprint' | 'both'
  fingerprintEnabled: boolean
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

interface QRCodeData {
  qrCodeDataUrl: string
  qrData: {
    workerId: number
    workerName: string
    groupId: number | null
    groupName: string | null
    groupLocation: string | null
    expirationDate: string
    timestamp: string
    securityHash: string
  }
}

export default function WorkerAttendanceClient({}: WorkerAttendanceClientProps) {
  const isMobile = useIsMobile()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState(false)
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showFingerprintAuth, setShowFingerprintAuth] = useState(false)

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
        
        // Fetch QR code if worker has ID
        if (data.worker?.workerId) {
          try {
            const qrResponse = await fetch(`/api/worker/qr/${data.worker.workerId}`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            })
            if (qrResponse.ok) {
              const qrData = await qrResponse.json()
              setQrCode(qrData)
            }
          } catch (error) {
            console.error('Error fetching QR code:', error)
          }
        }
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

  const handleDownloadQR = () => {
    if (qrCode && worker) {
      const link = document.createElement('a')
      link.download = `${worker.name}-attendance-qr.png`
      link.href = qrCode.qrCodeDataUrl
      link.click()
    }
  }

  const handlePrintQR = () => {
    if (qrCode && worker) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Attendance QR Code - ${worker.name}</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .qr-container { margin: 20px 0; }
                .worker-info { margin-bottom: 20px; }
                h1 { color: #333; }
                p { color: #666; margin: 5px 0; }
                img { border: 2px solid #ddd; padding: 10px; }
              </style>
            </head>
            <body>
              <div class="worker-info">
                <h1>Attendance QR Code</h1>
                <p><strong>Worker:</strong> ${worker.name}</p>
                <p><strong>Group:</strong> ${worker.group}</p>
                <p><strong>Supervisor:</strong> ${worker.supervisor}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="qr-container">
                <img src="${qrCode.qrCodeDataUrl}" alt="Attendance QR Code" />
              </div>
              <p><small>Present this QR code at your worksite for attendance scanning</small></p>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

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
          <p className="text-gray-600 mb-6">You haven&apos;t checked in yet today. Don&apos;t forget to scan your QR code when you arrive at work!</p>
          
          <div className="space-y-4">
            {/* Attendance Method Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              
              {worker.fingerprintEnabled && (worker.preferredAttendanceMethod === 'fingerprint' || worker.preferredAttendanceMethod === 'both') && (
                <button 
                  onClick={() => setShowFingerprintAuth(!showFingerprintAuth)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {showFingerprintAuth ? 'Hide Fingerprint' : 'Use Fingerprint'}
                </button>
              )}
              
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Settings
              </button>
            </div>
            
            {qrCode && showQRCode && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Attendance QR Code</h3>
                <div className="flex flex-col items-center space-y-4">
                  <Image 
                    src={qrCode.qrCodeDataUrl} 
                    alt="Attendance QR Code" 
                    width={200}
                    height={200}
                    className="border-2 border-gray-300 rounded-lg p-2 bg-white"
                  />
                  <div className="text-center text-sm text-gray-600">
                    <p><strong>Worker:</strong> {qrCode.qrData.workerName}</p>
                    <p><strong>Group:</strong> {qrCode.qrData.groupName || 'No Group'}</p>
                    <p><strong>Location:</strong> {qrCode.qrData.groupLocation || 'Not Assigned'}</p>
                    <p><strong>Valid Until:</strong> {new Date(qrCode.qrData.expirationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDownloadQR}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Download QR
                    </button>
                    <button
                      onClick={handlePrintQR}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Print QR
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">You&apos;re currently checked in. Remember to check out when you finish work.</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="text-gray-500 text-sm">
                Loading your QR code...
              </div>
            )}
            
            {!loading && !qrCode && (
              <div className="text-red-500 text-sm">
                Unable to generate QR code. Please contact your supervisor.
              </div>
            )}
            
            {/* Fingerprint Authentication */}
            {showFingerprintAuth && worker.fingerprintEnabled && (
              <div className="mt-6">
                <FingerprintAuthentication
                  onAuthenticationSuccess={async () => {
                    // Log attendance after successful fingerprint authentication
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
                        // Refresh attendance data
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
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-6">
                <AttendanceMethodSettings
                  worker={{
                    id: worker.id,
                    preferredAttendanceMethod: worker.preferredAttendanceMethod,
                    fingerprintEnabled: worker.fingerprintEnabled
                  }}
                  onSettingsUpdate={(updatedWorker) => {
                    setWorker({
                      ...worker,
                      preferredAttendanceMethod: updatedWorker.preferredAttendanceMethod,
                      fingerprintEnabled: updatedWorker.fingerprintEnabled
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
