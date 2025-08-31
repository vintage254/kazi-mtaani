import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { attendance } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { attendanceIds } = body

    if (!Array.isArray(attendanceIds) || attendanceIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid attendance IDs' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Bulk approve attendance records
    for (const id of attendanceIds) {
      await db
        .update(attendance)
        .set({ supervisorApproved: true })
        .where(eq(attendance.id, id))
    }

    return NextResponse.json(
      { success: true, approved: attendanceIds.length },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error bulk approving attendance:', error)
    return NextResponse.json(
      { error: 'Failed to bulk approve attendance' },
      { status: 500 }
    )
  }
}
