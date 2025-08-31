import { redirect } from 'next/navigation'

// Redirect to main attendance page
export default function AttendanceApprovePage() {
  redirect('/supervisor/attendance')
}