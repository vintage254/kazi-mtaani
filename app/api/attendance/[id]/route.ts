import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { attendance } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const attendanceId = parseInt(params.id)
    if (isNaN(attendanceId)) {
      return NextResponse.json(
        { error: 'Invalid attendance ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, supervisorId } = body

    if (action === 'approve') {
      await db
        .update(attendance)
        .set({ supervisorApproved: true })
        .where(eq(attendance.id, attendanceId))
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error updating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    )
  }
}

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
    const { attendanceIds, supervisorId } = body

    if (!Array.isArray(attendanceIds) || attendanceIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid attendance IDs' },
        { status: 400 }
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
