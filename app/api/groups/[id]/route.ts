import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { groups, workers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id)
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: 'Invalid group ID' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // First, update workers to remove group assignment
    await db.update(workers)
      .set({ groupId: null, isActive: false })
      .where(eq(workers.groupId, groupId))
    
    // Then delete the group
    await db.delete(groups).where(eq(groups.id, groupId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    )
  }
}
