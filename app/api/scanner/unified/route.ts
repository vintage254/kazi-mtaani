import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, groups, attendance, authenticators, faceEmbeddings, alerts } from '@/lib/db/schema'
import { verifyAuthenticationResponse, AuthenticatorTransport } from '@simplewebauthn/server'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Cosine similarity between two face descriptor vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Haversine formula to calculate distance between two GPS coordinates in meters
function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Create an alert for verification failures
async function createAlert(
  type: string, title: string, description: string,
  severity: string, workerId?: number | null, groupId?: number | null,
) {
  try {
    await ensureDb().insert(alerts).values({
      type,
      title,
      description,
      severity,
      workerId: workerId ?? undefined,
      groupId: groupId ?? undefined,
    })
  } catch (err) {
    console.error('Failed to create alert:', err)
  }
}

// POST /api/scanner/unified - Handle fingerprint or face authentication with GPS verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      method, // 'fingerprint' or 'face'
      workerId,
      credential,
      challenge,
      faceDescriptor, // 128-dim array from client-side face detection
      latitude,
      longitude,
    } = body

    if (!method || !workerId) {
      return NextResponse.json(
        { error: 'Missing required fields: method, workerId' },
        { status: 400 }
      )
    }

    if (!['fingerprint', 'face'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid authentication method. Use "fingerprint" or "face"' },
        { status: 400 }
      )
    }

    // Get worker data
    const worker = await ensureDb()
      .select({
        id: workers.id,
        userId: workers.userId,
        groupId: workers.groupId,
        fingerprintEnabled: workers.fingerprintEnabled,
        faceEnabled: workers.faceEnabled,
        firstName: users.firstName,
        lastName: users.lastName,
        groupName: groups.name,
        groupLocation: groups.location,
        groupLatitude: groups.latitude,
        groupLongitude: groups.longitude,
        geofenceRadius: groups.geofenceRadius,
      })
      .from(workers)
      .innerJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(workers.groupId, groups.id))
      .where(eq(workers.id, workerId))
      .limit(1)

    if (!worker[0]) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    const workerData = worker[0]

    // GPS Geofence verification
    let gpsDistance: number | null = null
    let gpsVerified = false

    if (latitude != null && longitude != null && workerData.groupLatitude && workerData.groupLongitude) {
      gpsDistance = calculateDistance(
        latitude, longitude,
        parseFloat(workerData.groupLatitude), parseFloat(workerData.groupLongitude)
      )
      const radius = workerData.geofenceRadius || 100
      gpsVerified = gpsDistance <= radius
    }

    // If GPS coordinates were provided but worker is outside geofence, block check-in
    if (latitude != null && longitude != null && workerData.groupLatitude && workerData.groupLongitude && !gpsVerified) {
      const workerName = `${workerData.firstName} ${workerData.lastName}`
      await createAlert(
        'gps_outside_geofence',
        'GPS Outside Geofence',
        `${workerName} attempted check-in ${Math.round(gpsDistance || 0)}m from ${workerData.groupName || 'site'} (limit: ${workerData.geofenceRadius || 100}m)`,
        'high',
        workerId,
        workerData.groupId,
      )
      return NextResponse.json(
        {
          error: 'You are outside the work site geofence',
          gpsDistance: Math.round(gpsDistance || 0),
          geofenceRadius: workerData.geofenceRadius || 100,
        },
        { status: 403 }
      )
    }

    // Biometric verification
    let matchScore: number | null = null

    if (method === 'fingerprint') {
      if (!credential || !challenge) {
        return NextResponse.json(
          { error: 'Missing required fields for fingerprint authentication' },
          { status: 400 }
        )
      }

      if (!workerData.fingerprintEnabled) {
        return NextResponse.json(
          { error: 'Fingerprint authentication not enabled' },
          { status: 403 }
        )
      }

      // Verify fingerprint
      const userAuthenticators = await ensureDb()
        .select()
        .from(authenticators)
        .where(eq(authenticators.userId, workerData.userId!))

      if (userAuthenticators.length === 0) {
        return NextResponse.json(
          { error: 'No fingerprint credentials found' },
          { status: 404 }
        )
      }

      const credentialIDBuffer = Buffer.from(credential.id, 'base64url')
      const credentialIDBase64 = credentialIDBuffer.toString('base64')

      const authenticator = userAuthenticators.find(auth => auth.credentialID === credentialIDBase64)

      if (!authenticator) {
        return NextResponse.json(
          { error: 'Authenticator not found' },
          { status: 404 }
        )
      }

      const rpID = process.env.WEBAUTHN_RP_ID || 'localhost'
      const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'

      try {
        const verification = await verifyAuthenticationResponse({
          response: credential,
          expectedChallenge: challenge,
          expectedOrigin,
          expectedRPID: rpID,
          credential: {
            id: authenticator.credentialID,
            publicKey: new Uint8Array(Buffer.from(authenticator.publicKey, 'base64')),
            counter: authenticator.counter,
            transports: authenticator.transports ? JSON.parse(authenticator.transports) as AuthenticatorTransport[] : undefined,
          },
        })

        if (!verification.verified) {
          await createAlert(
            'fingerprint_failed',
            'Fingerprint Verification Failed',
            `${workerData.firstName} ${workerData.lastName} failed fingerprint verification at ${workerData.groupName || 'site'}`,
            'medium',
            workerId,
            workerData.groupId,
          )
          return NextResponse.json(
            { error: 'Fingerprint authentication failed' },
            { status: 401 }
          )
        }

        await ensureDb()
          .update(authenticators)
          .set({ counter: verification.authenticationInfo.newCounter })
          .where(eq(authenticators.id, authenticator.id))

        matchScore = 95.0
      } catch {
        return NextResponse.json(
          { error: 'Fingerprint verification failed' },
          { status: 401 }
        )
      }
    } else if (method === 'face') {
      if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
        return NextResponse.json(
          { error: 'Missing face descriptor for face authentication' },
          { status: 400 }
        )
      }

      if (!workerData.faceEnabled) {
        return NextResponse.json(
          { error: 'Face recognition not enabled for this worker' },
          { status: 403 }
        )
      }

      // Load stored face embeddings for this worker
      const storedEmbeddings = await ensureDb()
        .select()
        .from(faceEmbeddings)
        .where(eq(faceEmbeddings.workerId, workerId))

      if (storedEmbeddings.length === 0) {
        return NextResponse.json(
          { error: 'No face enrollment found. Please enroll your face first.' },
          { status: 404 }
        )
      }

      // Compare against each stored embedding and take the best match
      let bestScore = 0
      for (const stored of storedEmbeddings) {
        if (!stored.embedding) continue
        const storedDescriptor = JSON.parse(stored.embedding) as number[]
        const similarity = cosineSimilarity(faceDescriptor, storedDescriptor)
        // Convert cosine similarity (0-1) to percentage (0-100)
        const scorePercent = similarity * 100
        if (scorePercent > bestScore) {
          bestScore = scorePercent
        }
      }

      matchScore = Math.round(bestScore * 100) / 100

      // Reject if face match is too low (70% threshold)
      if (matchScore < 70) {
        const severity = matchScore < 40 ? 'critical' : 'high'
        await createAlert(
          'face_recognition_failed',
          'Face Recognition Failed',
          `${workerData.firstName} ${workerData.lastName} failed face verification (${matchScore}% match) at ${workerData.groupName || 'site'}`,
          severity,
          workerId,
          workerData.groupId,
        )
        return NextResponse.json(
          { error: 'Face recognition failed. Score too low.', score: matchScore },
          { status: 401 }
        )
      }
    }

    // Process attendance (check-in or check-out)
    const today = new Date().toISOString().split('T')[0]

    const existingAttendance = await ensureDb()
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.workerId, workerId),
          eq(attendance.date, today)
        )
      )
      .limit(1)

    const isCheckOut = existingAttendance.length > 0 &&
      existingAttendance[0].checkInTime &&
      !existingAttendance[0].checkOutTime

    if (isCheckOut) {
      await ensureDb()
        .update(attendance)
        .set({
          checkOutTime: new Date(),
          attendanceMethod: method as 'fingerprint' | 'face',
          fingerprintMatchScore: method === 'fingerprint' ? String(matchScore) : null,
          faceRecognitionScore: method === 'face' ? String(matchScore) : null,
          notes: `Check-out via ${method}`,
        })
        .where(eq(attendance.id, existingAttendance[0].id))
    } else {
      await ensureDb().insert(attendance).values({
        workerId: workerId,
        groupId: workerData.groupId,
        date: today,
        checkInTime: new Date(),
        checkOutTime: null,
        status: 'present',
        location: workerData.groupLocation || 'Unknown',
        checkInLatitude: latitude != null ? String(latitude) : null,
        checkInLongitude: longitude != null ? String(longitude) : null,
        gpsDistanceMeters: gpsDistance != null ? String(Math.round(gpsDistance * 100) / 100) : null,
        gpsVerified,
        attendanceMethod: method as 'fingerprint' | 'face',
        fingerprintMatchScore: method === 'fingerprint' ? String(matchScore) : null,
        faceRecognitionScore: method === 'face' ? String(matchScore) : null,
        notes: `Check-in via ${method}`,
      })
    }

    let hoursWorked = null
    if (isCheckOut && existingAttendance[0].checkInTime) {
      const checkInTime = new Date(existingAttendance[0].checkInTime)
      const checkOutTime = new Date()
      hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    }

    return NextResponse.json({
      success: true,
      action: isCheckOut ? 'check-out' : 'check-in',
      method,
      worker: {
        id: workerId,
        name: `${workerData.firstName} ${workerData.lastName}`,
        group: workerData.groupName,
        location: workerData.groupLocation,
      },
      gps: {
        verified: gpsVerified,
        distanceMeters: gpsDistance != null ? Math.round(gpsDistance) : null,
        geofenceRadius: workerData.geofenceRadius || 100,
      },
      attendance: {
        date: today,
        checkInTime: isCheckOut ? existingAttendance[0].checkInTime : new Date(),
        checkOutTime: isCheckOut ? new Date() : null,
        hoursWorked: hoursWorked ? Math.round(hoursWorked * 100) / 100 : null,
        method,
        matchScore,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Unified scanner API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
