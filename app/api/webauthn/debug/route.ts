import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
      with: {
        authenticators: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.id,
      username: user.username,
      authenticatorsCount: user.authenticators.length,
      authenticators: user.authenticators.map(auth => ({
        id: auth.id,
        credentialIDLength: auth.credentialID.length,
        credentialIDPreview: auth.credentialID.substring(0, 20) + '...',
        hasPublicKey: !!auth.publicKey,
        counter: auth.counter,
        transports: auth.transports,
        createdAt: auth.createdAt
      })),
      webauthnConfig: {
        rpID: process.env.WEBAUTHN_RP_ID || 'localhost',
        rpName: process.env.WEBAUTHN_RP_NAME || 'Kazi Mtaani',
        origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
