import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, workers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(req: NextRequest) {
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

  const worker = await db.query.workers.findFirst({
    where: eq(workers.userId, user.id),
  });

  if (!worker) {
    return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { preferredAttendanceMethod, fingerprintEnabled, faceEnabled } = body;

    const updateData: Partial<typeof workers.$inferInsert> = {};

    if (preferredAttendanceMethod !== undefined) {
      if (!['fingerprint', 'face'].includes(preferredAttendanceMethod)) {
        return NextResponse.json({ error: 'Invalid attendance method' }, { status: 400 });
      }
      updateData.preferredAttendanceMethod = preferredAttendanceMethod;
    }

    if (fingerprintEnabled !== undefined) {
      updateData.fingerprintEnabled = fingerprintEnabled;
    }

    if (faceEnabled !== undefined) {
      updateData.faceEnabled = faceEnabled;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await db.update(workers)
      .set(updateData)
      .where(eq(workers.id, worker.id));

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating worker settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update settings' 
    }, { status: 500 });
  }
}
