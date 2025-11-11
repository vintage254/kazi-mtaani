import { NextResponse } from 'next/server';
import { generateAuthenticationOptions, AuthenticatorTransport } from '@simplewebauthn/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { challengeStore } from '@/lib/webauthn-challenge-store';

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

  if (user.authenticators.length === 0) {
    return NextResponse.json({ error: 'No authenticators registered' }, { status: 400 });
  }

  const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.authenticators.map(auth => ({
      id: auth.credentialID, // Already in correct format
      type: 'public-key' as const,
      transports: auth.transports ? auth.transports.split(',') as AuthenticatorTransport[] : undefined,
    })),
    userVerification: 'preferred',
    timeout: 60000, // 60 seconds timeout
  });

  // Store the challenge using the shared store
  await challengeStore.set(user.id.toString(), options.challenge);

  return NextResponse.json(options);
}
