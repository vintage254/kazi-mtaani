import { NextResponse } from 'next/server';
import { generateRegistrationOptions, AuthenticatorTransport } from '@simplewebauthn/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// In-memory store for challenges. In a real app, use a database or a session store.
const challengeStore: { [key: string]: string } = {};

export async function POST() {
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

  const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';
  const rpName = process.env.WEBAUTHN_RP_NAME || 'Kazi Mtaani';

  const options = await generateRegistrationOptions({
    rpID,
    rpName,
    userID: new TextEncoder().encode(user.id.toString()),
    userName: user.username,
    excludeCredentials: user.authenticators.map(auth => ({
      id: auth.credentialID,
      type: 'public-key' as const,
      transports: auth.transports ? auth.transports.split(',') as AuthenticatorTransport[] : undefined,
    })),
    authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
    },
  });

  // Store the challenge temporarily
  challengeStore[user.id] = options.challenge;

  return NextResponse.json(options);
}
