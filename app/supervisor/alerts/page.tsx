import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkIdAction } from '@/lib/db/actions'
import { getAllAlerts } from '@/lib/db/alerts-actions'
import Sidebar from '@/components/supervisor/Sidebar'
import AlertsManagement from '@/components/supervisor/AlertsManagement'

export default async function SupervisorAlertsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUserByClerkIdAction(userId)
  
  if (!user || user.role !== 'supervisor') {
    redirect('/unauthorized')
  }

  const activeAlerts = await getAllAlerts()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alerts & Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitor system alerts and notifications</p>
        </div>
        
        <AlertsManagement 
          initialAlerts={activeAlerts}
          currentUser={user}
        />
      </div>
    </div>
  )
}