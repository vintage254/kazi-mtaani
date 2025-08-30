import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkIdAction } from '@/lib/db/actions'
import Sidebar from '@/components/supervisor/Sidebar'

export default async function SupervisorAttendancePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUserByClerkIdAction(userId)
  
  if (!user || user.role !== 'supervisor') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Monitor and approve worker attendance</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">Attendance management functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  )
}