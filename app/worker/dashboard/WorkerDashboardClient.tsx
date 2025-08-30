'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import WorkerSidebar from '@/components/WorkerSidebar'

interface Worker {
  name: string
  avatar: string
  handle: string
  status: string
  group: string
  supervisor: string
}

interface Stats {
  daysWorked: number
  totalHours: number
  attendanceRate: number
  pendingPayments: number
}

interface Activity {
  id: number
  date: Date | null
  activity: string | null
  location: string | null
  checkInTime: Date | null
  checkOutTime: Date | null
  groupName: string | null
  supervisorApproved: boolean | null
}

interface Payment {
  id: number
  amount: string
  period: string | null
  status: string | null
  createdAt: Date | null
  disbursedAt: Date | null
  mpesaTransactionId: string | null
}

interface WorkerDashboardClientProps {
  worker: Worker
  stats: Stats
  recentActivity: Activity[]
  paymentHistory: Payment[]
}

export default function WorkerDashboardClient({ 
  worker, 
  stats, 
  recentActivity, 
  paymentHistory 
}: WorkerDashboardClientProps) {
  const handleEditProfile = () => {
    console.log('Edit profile clicked')
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateHours = (checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut) return 'N/A'
    const hours = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60)
    return `${hours.toFixed(1)}h`
  }

  const getStatusBadge = (status: string | null) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case 'present':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getPaymentStatusBadge = (status: string | null) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'disbursed':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <WorkerSidebar 
        worker={worker}
        notifications={0}
      />

      {/* Main Content */}
      <div className="ml-64 p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Worked</h3>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {worker.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your work today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:text-white">
              <option>Last week</option>
              <option>This week</option>
              <option>This month</option>
            </select>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{worker.status}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-lg hover:shadow-gray-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.daysWorked || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center relative hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-1">{stats.totalHours}</div>
                <div className="text-sm uppercase tracking-wide">HOURS</div>
                <div className="text-sm uppercase tracking-wide">LOGGED</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-lg hover:shadow-gray-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <p className="text-3xl font-bold text-blue-600">{stats?.attendanceRate || 0}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-lg hover:shadow-gray-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <p className="text-3xl font-bold text-orange-600">{stats?.pendingPayments || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</h3>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                {recentActivity.length > 0 ? (
                  <div className="w-full">
                    <div className="text-sm mb-4">Recent Activity</div>
                    <div className="space-y-3">
                      {recentActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="text-sm font-medium">{formatDate(activity.date)}</div>
                            <div className="text-xs text-gray-500">{activity.location || 'No location'}</div>
                          </div>
                          <span className={getStatusBadge(activity.activity)}>
                            {activity.activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-sm mb-2">No attendance data available</div>
                    <div className="text-xs">Check in to start tracking your attendance</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Logged</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats?.totalHours || 0}</p>
                <p className="text-sm text-gray-600">You&apos;re doing great! Keep up the excellent work.</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average daily hours</span>
                    <span className="font-medium">{(stats.daysWorked || 0) > 0 ? ((stats.totalHours || 0) / (stats.daysWorked || 1)).toFixed(1) : '0.0'} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days present</span>
                    <span className="font-medium">{stats.daysWorked || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days absent</span>
                    <span className="font-medium">{Math.max(0, 5 - (stats.daysWorked || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance rate</span>
                    <span className="font-medium">{stats.attendanceRate || 0}%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</div>
                      <div className="text-xs text-gray-600 uppercase">ON TIME</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{Math.max(0, 100 - stats.attendanceRate)}%</div>
                      <div className="text-xs text-gray-600 uppercase">LATE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Pending</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disbursed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        You&apos;re all set for today!
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.period || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getPaymentStatusBadge(payment.status)}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.mpesaTransactionId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.disbursedAt ? formatDate(payment.disbursedAt) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="text-sm">No payment history available</div>
                      <div className="text-xs mt-1">Payments will appear here once processed</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Work Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(activity.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(activity.activity)}>
                          {activity.activity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateHours(activity.checkInTime, activity.checkOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(activity.checkInTime)} - {formatTime(activity.checkOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          activity.supervisorApproved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Today&apos;s attendance is pending approval
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="text-sm">No work activity recorded yet</div>
                      <div className="text-xs mt-1">Check in to start tracking your work activity</div>
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
