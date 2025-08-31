import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkIdAction } from '@/lib/db/actions'
import Sidebar from '@/components/supervisor/Sidebar'
import AttendanceManagement from '@/components/supervisor/AttendanceManagement'

export default async function SupervisorAttendancePage({
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
    dateFrom: searchParams.dateFrom as string,
    dateTo: searchParams.dateTo as string,
    status: searchParams.status as 'present' | 'absent' | 'late' | undefined,
    approvalStatus: searchParams.approvalStatus === 'true' ? true : searchParams.approvalStatus === 'false' ? false : undefined
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Monitor and approve worker attendance</p>
        </div>
        
        <AttendanceManagement 
          currentUser={user}
          initialFilters={filters}
        />
      </div>
    </div>
  )
}