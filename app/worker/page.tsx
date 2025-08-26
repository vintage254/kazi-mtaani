import React from 'react'
import { redirect } from 'next/navigation'

// Redirect worker root to dashboard
const WorkerPage = () => {
  redirect('/worker/dashboard')
}

export default WorkerPage
