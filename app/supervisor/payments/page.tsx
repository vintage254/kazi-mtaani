import Sidebar from '@/components/supervisor/Sidebar'
import PaymentDashboard from '@/components/supervisor/PaymentDashboard'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function PaymentsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get current user
  if (!db) {
    redirect('/sign-in')
  }
  
  const currentUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId)
  })

  if (!currentUser || currentUser.role !== 'supervisor') {
    redirect('/')
  }

  // Parse filters from search params
  const filters = {
    groupId: searchParams.groupId ? parseInt(searchParams.groupId as string) : undefined,
    workerId: searchParams.workerId ? parseInt(searchParams.workerId as string) : undefined,
    status: searchParams.status as 'pending' | 'approved' | 'disbursed' | 'failed' | undefined,
    dateFrom: searchParams.dateFrom as string | undefined,
    dateTo: searchParams.dateTo as string | undefined
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">Manage worker payments and disbursements</p>
          </div>
          
          <PaymentDashboard 
            currentUser={currentUser}
            initialFilters={filters}
          />
        </div>
      </main>
    </div>
  )
}