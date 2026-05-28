export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

export default function SupervisorPage() {
  redirect('/supervisor/dashboard')
}