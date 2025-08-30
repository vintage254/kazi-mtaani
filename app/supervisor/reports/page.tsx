import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkIdAction } from '@/lib/db/actions'
import { getAttendanceRecords, getPaymentRecords } from '@/lib/db/attendance-actions'
import Sidebar from '@/components/supervisor/Sidebar'
import ReportsAnalytics from '@/components/supervisor/ReportsAnalytics'

export default async function SupervisorReportsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUserByClerkIdAction(userId)
  
  if (!user || user.role !== 'supervisor') {
    redirect('/unauthorized')
  }

  // Parse search params for date range
  const dateFrom = searchParams.dateFrom as string || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const dateTo = searchParams.dateTo as string || new Date().toISOString().split('T')[0]
  const groupId = searchParams.groupId ? parseInt(searchParams.groupId as string) : undefined

  const [attendanceData, paymentData] = await Promise.all([
    getAttendanceRecords({ dateFrom, dateTo, groupId }),
    getPaymentRecords({ dateFrom, dateTo, groupId })
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive attendance and payment analytics</p>
        </div>
        
        <ReportsAnalytics 
          attendanceData={attendanceData}
          paymentData={paymentData}
          currentUser={user}
          initialDateRange={{ dateFrom, dateTo, groupId }}
        />
      </div>
    </div>
  )
}