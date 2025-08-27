'use client'

import WorkerSidebar from '@/components/WorkerSidebar'

interface Worker {
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
}

interface WorkerAttendanceClientProps {
  worker: Worker
}

export default function WorkerAttendanceClient({ worker }: WorkerAttendanceClientProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <WorkerSidebar 
        worker={worker}
        notifications={0}
      />

      {/* Main Content */}
      <div className="ml-64 p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
              <p className="text-gray-600 mt-1">Track your work hours and check-in status.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{worker.status}</span>
            </div>
          </div>
        </div>

        {/* Check-in Status */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Check In?</h2>
          <p className="text-gray-600 mb-6">Scan the QR code at your worksite to mark attendance</p>
          
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            Scan QR Code
          </button>
          
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
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">This Week's Attendance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">8:30 AM - 5:15 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tuesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">8:15 AM - 5:00 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wednesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">8:45 AM - 5:30 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thursday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">8:20 AM - 5:10 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Friday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">Absent</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-green-900">Attendance Rate</span>
                  <span className="text-sm font-bold text-green-700">80%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-green-700">Days Present</span>
                  <span className="text-sm text-green-700">4/5</span>
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Aug 22, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8:20 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5:10 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.5 hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Aug 21, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8:45 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5:30 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.5 hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Aug 20, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8:15 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.5 hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
