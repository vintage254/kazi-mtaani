import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { db } from '@/lib/db';
import { users, authenticators } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// Import the challenge store from the authentication options endpoint
const challengeStore: { [key: string]: string } = {};

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { credential } = body;

  if (!credential) {
    return NextResponse.json({ error: 'Missing credential data' }, { status: 400 });
  }

  const expectedChallenge = challengeStore[user.id];
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'No challenge found for user' }, { status: 400 });
  }

  // Find the authenticator that matches the credential ID
  const credentialIDBuffer = Buffer.from(credential.id, 'base64url');
  const credentialIDBase64 = credentialIDBuffer.toString('base64');
  
  const authenticator = user.authenticators.find(auth => auth.credentialID === credentialIDBase64);
  
  if (!authenticator) {
    return NextResponse.json({ error: 'Authenticator not found' }, { status: 400 });
  }

  const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';
  const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: Uint8Array.from(Buffer.from(authenticator.credentialID, 'base64')),
        publicKey: Uint8Array.from(Buffer.from(authenticator.publicKey, 'base64')),
        counter: authenticator.counter,
        transports: authenticator.transports ? JSON.parse(authenticator.transports) as AuthenticatorTransport[] : undefined,
      },
    });

    if (verification.verified) {
      // Update the counter in the database
      await db.update(authenticators)
        .set({ counter: verification.authenticationInfo.newCounter })
        .where(eq(authenticators.id, authenticator.id));

      // Clean up the challenge
      delete challengeStore[user.id];

      return NextResponse.json({ 
        verified: true,
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json({ 
        verified: false,
        error: 'Authentication verification failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Authentication verification error:', error);
    return NextResponse.json({ 
      verified: false,
      error: 'Authentication verification failed' 
    }, { status: 500 });
  }
}
