import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkIdAction } from '@/lib/db/actions'
import { getPaymentRecords, getPaymentStats } from '@/lib/db/attendance-actions'
import Sidebar from '@/components/supervisor/Sidebar'
import PaymentDashboard from '@/components/supervisor/PaymentDashboard'

export default async function SupervisorPaymentsPage({
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

  // Parse search params for filters
  const filters = {
    groupId: searchParams.groupId ? parseInt(searchParams.groupId as string) : undefined,
    workerId: searchParams.workerId ? parseInt(searchParams.workerId as string) : undefined,
    status: searchParams.status as 'pending' | 'approved' | 'disbursed' | 'failed' | undefined,
    dateFrom: searchParams.dateFrom as string,
    dateTo: searchParams.dateTo as string
  }

  const [paymentRecords, paymentStats] = await Promise.all([
    getPaymentRecords(filters),
    getPaymentStats()
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Track and manage worker payments</p>
        </div>
        
        <PaymentDashboard 
          initialRecords={paymentRecords}
          paymentStats={paymentStats}
          currentUser={user}
          initialFilters={filters}
        />
      </div>
    </div>
  )
}