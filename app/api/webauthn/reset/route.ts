import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, authenticators, workers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// DELETE endpoint to reset fingerprint enrollment
export async function DELETE() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all authenticators for this user
    await db.delete(authenticators).where(eq(authenticators.userId, user.id));

    // Disable fingerprint for the worker
    await db.update(workers)
      .set({ fingerprintEnabled: false })
      .where(eq(workers.userId, user.id));

    return NextResponse.json({
      success: true,
      message: 'All fingerprint enrollments have been reset. You can now enroll again.'
    });
  } catch (error) {
    console.error('Reset endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
