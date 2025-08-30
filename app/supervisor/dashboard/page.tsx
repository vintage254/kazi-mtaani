import React from 'react'
import Sidebar from '@/components/supervisor/Sidebar'
import { getDashboardStats, getRecentActivity, getActiveAlerts } from '@/lib/db/actions'

const SupervisorDashboard = async () => {
  const stats = await getDashboardStats()
  const recentActivity = await getRecentActivity()
  const activeAlerts = await getActiveAlerts()

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your supervised groups and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-500 text-sm">Active workers</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Groups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeGroups}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-500 text-sm">Currently active</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-500 text-sm">Today&apos;s attendance</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.222 3.777l6.717 6.717m0 0l2.828 2.828m-2.828-2.828L13.767 8.04m0 0l3.356-3.356a1 1 0 011.414 0l2.828 2.828a1 1 0 010 1.414l-3.356 3.356m-1.414-1.414L9.04 13.767m0 0L6.222 16.555a1 1 0 01-1.414 0L2 13.767a1 1 0 010-1.414l2.828-2.828a1 1 0 011.414 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-red-600 text-sm font-medium">{stats.pendingApprovals > 0 ? 'Requires attention' : 'All up to date'}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'present' ? 'bg-green-500' : 
                        activity.status === 'absent' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.workerName} {activity.status === 'present' ? 'checked in' : activity.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.groupName} - {activity.location} | {activity.checkInTime ? new Date(activity.checkInTime).toLocaleString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activeAlerts.length > 0 ? (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                      alert.severity === 'critical' || alert.severity === 'high' ? 'bg-red-50' :
                      alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      <svg className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className={`text-sm font-medium ${
                          alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-900' :
                          alert.severity === 'medium' ? 'text-yellow-900' : 'text-blue-900'
                        }`}>{alert.title}</p>
                        <p className={`text-xs ${
                          alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-700' :
                          alert.severity === 'medium' ? 'text-yellow-700' : 'text-blue-700'
                        }`}>
                          {alert.groupName && `${alert.groupName} - `}{alert.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No active alerts</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard