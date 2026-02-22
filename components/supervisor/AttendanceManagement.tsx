'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'

interface AttendanceRecord {
  id: number
  date: string | null
  checkInTime: Date | null
  checkOutTime: Date | null
  status: 'present' | 'absent' | 'late' | null
  location: string | null
  supervisorApproved: boolean | null
  notes: string | null
  workerId: number
  workerName: string | null
  workerLastName: string | null
  groupId: number
  groupName: string | null
  groupLocation: string | null
  faceRecognitionScore: string | null
  dailyRate: string | null
}

interface User {
  id: number
  firstName: string | null
  lastName: string | null
  role: string | null
}

interface Filters {
  groupId?: number
  workerId?: number
  dateFrom?: string
  dateTo?: string
  status?: 'present' | 'absent' | 'late'
  approvalStatus?: boolean
}

interface AttendanceManagementProps {
  currentUser: User
  initialFilters: Filters
}

export default function AttendanceManagement({ 
  currentUser, 
  initialFilters 
}: AttendanceManagementProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecords, setSelectedRecords] = useState<number[]>([])
  const [filters, setFilters] = useState(initialFilters)
  const [isPending, startTransition] = useTransition()

  const fetchAttendanceRecords = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, value.toString())
        }
      })
      
      const response = await fetch(`/api/attendance?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records || [])
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAttendanceRecords()
  }, [filters, fetchAttendanceRecords])

  const handleApproveRecord = async (attendanceId: number) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/attendance/${attendanceId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: JSON.stringify({ action: 'approve', supervisorId: currentUser.id })
        })
        
        if (response.ok) {
          setRecords(prev => prev.map(record => 
            record.id === attendanceId 
              ? { ...record, supervisorApproved: true }
              : record
          ))
        }
      } catch (error) {
        console.error('Error approving attendance:', error)
      }
    })
  }

  const handleBulkApprove = async () => {
    if (selectedRecords.length === 0) return
    
    startTransition(async () => {
      try {
        const response = await fetch('/api/attendance/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: JSON.stringify({ attendanceIds: selectedRecords, supervisorId: currentUser.id })
        })
        
        if (response.ok) {
          setRecords(prev => prev.map(record => 
            selectedRecords.includes(record.id)
              ? { ...record, supervisorApproved: true }
              : record
          ))
          setSelectedRecords([])
        }
      } catch (error) {
        console.error('Error bulk approving attendance:', error)
      }
    })
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setLoading(true)
  }

  const handleSelectRecord = (recordId: number) => {
    setSelectedRecords(prev => 
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const handleSelectAll = () => {
    const unapprovedRecords = records.filter(r => !r.supervisorApproved).map(r => r.id)
    setSelectedRecords(
      selectedRecords.length === unapprovedRecords.length ? [] : unapprovedRecords
    )
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Worker', 'Group', 'Status', 'Check In', 'Check Out', 'Location', 'Approved', 'Daily Rate'],
      ...records.map(record => [
        record.date,
        `${record.workerName || ''} ${record.workerLastName || ''}`.trim(),
        record.groupName || '',
        record.status,
        record.checkInTime ? new Date(record.checkInTime).toLocaleString() : '',
        record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : '',
        record.location || '',
        record.supervisorApproved ? 'Yes' : 'No',
        `KSh ${record.dailyRate || '0'}`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-records-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const unapprovedCount = records.filter(r => !r.supervisorApproved).length
  const totalAmount = records
    .filter(r => r.supervisorApproved && r.status === 'present')
    .reduce((sum, r) => sum + parseFloat(r.dailyRate || '0'), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-gray-900">{records.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-orange-600">{unapprovedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Present Today</p>
          <p className="text-2xl font-bold text-green-600">
            {records.filter(r => r.status === 'present' && r.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Approved Amount</p>
          <p className="text-2xl font-bold text-blue-600">KSh {totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value === '' ? undefined : e.target.value as 'present' | 'absent' | 'late' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval</label>
            <select
              value={filters.approvalStatus === undefined ? '' : filters.approvalStatus.toString()}
              onChange={(e) => handleFilterChange({ 
                approvalStatus: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
            >
              <option value="">All</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleFilterChange({ 
                groupId: undefined, 
                workerId: undefined, 
                dateFrom: undefined, 
                dateTo: undefined, 
                status: undefined, 
                approvalStatus: undefined 
              })}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRecords.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-blue-800">
              {selectedRecords.length} record(s) selected
            </p>
            <button
              onClick={handleBulkApprove}
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Approving...' : 'Approve Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Attendance Records</h3>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedRecords.length === records.filter(r => !r.supervisorApproved).length ? 'Deselect All' : 'Select All Pending'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === records.filter(r => !r.supervisorApproved).length && records.filter(r => !r.supervisorApproved).length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        disabled={record.supervisorApproved ?? false}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.workerName} {record.workerLastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.groupName}</div>
                      <div className="text-sm text-gray-500">{record.groupLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {record.dailyRate || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.supervisorApproved ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!record.supervisorApproved && (
                        <button
                          onClick={() => handleApproveRecord(record.id)}
                          disabled={isPending}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
