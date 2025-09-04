import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { db } from '@/lib/db';
import { users, authenticators, workers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { challengeStore } from '@/lib/webauthn-challenge-store';

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { credential } = body;

  if (!credential) {
    return NextResponse.json({ error: 'Missing credential data' }, { status: 400 });
  }

  const expectedChallenge = challengeStore.get(user.id.toString());
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'No challenge found for user' }, { status: 400 });
  }

  const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';
  const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential: cred } = verification.registrationInfo;

      // Store the authenticator in the database
      await db.insert(authenticators).values({
        userId: user.id,
        credentialID: Buffer.from(cred.id).toString('base64'),
        publicKey: Buffer.from(cred.publicKey).toString('base64'),
        counter: cred.counter,
        transports: credential.response.transports?.join(',') || '',
      });

      // Enable fingerprint for the worker
      await db.update(workers)
        .set({ fingerprintEnabled: true })
        .where(eq(workers.userId, user.id));

      // Clean up the challenge using the shared store
      challengeStore.delete(user.id.toString());

      return NextResponse.json({ 
        verified: true,
        message: 'Fingerprint enrolled successfully' 
      });
    } else {
      return NextResponse.json({ 
        verified: false,
        error: 'Registration verification failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Registration verification error:', error);
    return NextResponse.json({ 
      verified: false,
      error: 'Registration verification failed' 
    }, { status: 500 });
  }
}
