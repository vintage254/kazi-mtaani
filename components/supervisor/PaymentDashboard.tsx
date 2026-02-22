'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'

interface PaymentRecord {
  id: number
  amount: string
  period: string | null
  status: 'pending' | 'approved' | 'disbursed' | 'failed' | null
  createdAt: Date | null
  approvedAt: Date | null
  disbursedAt: Date | null
  workerId: number
  workerName: string | null
  workerLastName: string | null
  groupId: number
  groupName: string | null
}

interface PaymentStats {
  pending: { count: number; totalAmount: number }
  approved: { count: number; totalAmount: number }
  disbursed: { count: number; totalAmount: number }
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
  status?: 'pending' | 'approved' | 'disbursed' | 'failed'
  dateFrom?: string
  dateTo?: string
}

interface PaymentDashboardProps {
  currentUser: User
  initialFilters: Filters
}

export default function PaymentDashboard({ 
  currentUser, 
  initialFilters 
}: PaymentDashboardProps) {
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    pending: { count: 0, totalAmount: 0 },
    approved: { count: 0, totalAmount: 0 },
    disbursed: { count: 0, totalAmount: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initialFilters)
  const [isPending, startTransition] = useTransition()

  const fetchPaymentRecords = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, value.toString())
        }
      })
      
      const [recordsRes, statsRes] = await Promise.all([
        fetch(`/api/payments?${params.toString()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/payments/stats', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
      ])
      
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json()
        setRecords(recordsData.records || [])
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setPaymentStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching payment records:', error)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchPaymentRecords()
  }, [filters, fetchPaymentRecords])

  const handleApprovePayment = async (paymentId: number) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: JSON.stringify({ action: 'approve', supervisorId: currentUser.id })
        })
        
        if (response.ok) {
          setRecords(prev => prev.map(record => 
            record.id === paymentId 
              ? { ...record, status: 'approved' as const, approvedAt: new Date() }
              : record
          ))
          // Refresh stats
          await fetchPaymentRecords()
        }
      } catch (error) {
        console.error('Error approving payment:', error)
      }
    })
  }

  const handleMarkAsDisbursed = async (paymentId: number) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: JSON.stringify({ action: 'disburse' })
        })
        
        if (response.ok) {
          setRecords(prev => prev.map(record => 
            record.id === paymentId 
              ? { ...record, status: 'disbursed' as const, disbursedAt: new Date() }
              : record
          ))
          // Refresh stats
          await fetchPaymentRecords()
        }
      } catch (error) {
        console.error('Error marking payment as disbursed:', error)
      }
    })
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setLoading(true)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Worker', 'Group', 'Amount', 'Status', 'Approved At', 'Disbursed At'],
      ...records.map(record => [
        record.period,
        `${record.workerName || ''} ${record.workerLastName || ''}`.trim(),
        record.groupName || '',
        `KSh ${record.amount}`,
        record.status,
        record.approvedAt ? new Date(record.approvedAt).toLocaleDateString() : '',
        record.disbursedAt ? new Date(record.disbursedAt).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-records-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
      {/* Payment Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-600">{paymentStats.pending.count}</p>
              <p className="text-sm text-gray-500">KSh {paymentStats.pending.totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Payments</p>
              <p className="text-2xl font-bold text-blue-600">{paymentStats.approved.count}</p>
              <p className="text-sm text-gray-500">KSh {paymentStats.approved.totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disbursed Payments</p>
              <p className="text-2xl font-bold text-green-600">{paymentStats.disbursed.count}</p>
              <p className="text-sm text-gray-500">KSh {paymentStats.disbursed.totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              onChange={(e) => handleFilterChange({ status: e.target.value === '' ? undefined : e.target.value as 'pending' | 'approved' | 'disbursed' | 'failed' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="disbursed">Disbursed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleFilterChange({ 
                groupId: undefined, 
                workerId: undefined, 
                status: undefined, 
                dateFrom: undefined, 
                dateTo: undefined 
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

      {/* Payment Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Payment Records</h3>
          <p className="text-sm text-gray-600 mt-1">
            Note: M-Pesa integration will be handled separately. These are payment tracking records.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.period || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.workerName} {record.workerLastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.groupName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      KSh {parseFloat(record.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        record.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        record.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.approvedAt ? new Date(record.approvedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {record.status === 'pending' && (
                        <button
                          onClick={() => handleApprovePayment(record.id)}
                          disabled={isPending}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {record.status === 'approved' && (
                        <button
                          onClick={() => handleMarkAsDisbursed(record.id)}
                          disabled={isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Mark Disbursed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">Payment Process</h4>
        <div className="text-blue-800 space-y-2">
          <p>• <strong>Pending:</strong> Payment created from approved attendance</p>
          <p>• <strong>Approved:</strong> Payment approved by supervisor, ready for disbursement</p>
          <p>• <strong>Disbursed:</strong> Payment marked as completed (M-Pesa integration will be added later)</p>
          <p>• <strong>Failed:</strong> Payment failed during processing</p>
        </div>
      </div>
    </div>
  )
}
