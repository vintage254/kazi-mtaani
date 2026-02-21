import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, faceEmbeddings } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()

  if (!clerkId || !db) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const worker = await db.query.workers.findFirst({
    where: eq(workers.userId, user.id),
  })

  if (!worker) {
    return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const { descriptor } = body

    if (!descriptor || !Array.isArray(descriptor) || descriptor.length < 64) {
      return NextResponse.json(
        { error: 'Invalid face descriptor. Must be an array of at least 64 numbers.' },
        { status: 400 }
      )
    }

    // Delete any existing face embeddings for this worker (re-enrollment)
    await db.delete(faceEmbeddings).where(eq(faceEmbeddings.workerId, worker.id))

    // Store the new face embedding
    await db.insert(faceEmbeddings).values({
      workerId: worker.id,
      embedding: JSON.stringify(descriptor),
    })

    // Enable face recognition for the worker
    await db.update(workers)
      .set({ faceEnabled: true })
      .where(eq(workers.id, worker.id))

    return NextResponse.json({
      success: true,
      message: 'Face enrolled successfully',
    })
  } catch (error) {
    console.error('Face enrollment error:', error)
    return NextResponse.json(
      { error: 'Failed to enroll face' },
      { status: 500 }
    )
  }
}
