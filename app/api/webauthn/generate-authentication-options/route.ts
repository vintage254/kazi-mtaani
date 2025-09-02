import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions, AuthenticatorTransport } from '@simplewebauthn/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// In-memory store for challenges. In a real app, use a database or session store.
const challengeStore: { [key: string]: string } = {};

export async function POST(_req: NextRequest) {
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

  if (user.authenticators.length === 0) {
    return NextResponse.json({ error: 'No authenticators registered' }, { status: 400 });
  }

  const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.authenticators.map(auth => ({
      id: auth.credentialID,
      type: 'public-key' as const,
      transports: auth.transports ? auth.transports.split(',') as AuthenticatorTransport[] : undefined,
    })),
    userVerification: 'preferred',
  });

  // Store the challenge temporarily
  challengeStore[user.id] = options.challenge;

  return NextResponse.json(options);
}
