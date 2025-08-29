import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workers, users, groups } from '@/lib/db/schema'
import crypto from 'crypto'

// Helper function to ensure database connection
function ensureDb() {
  if (!db) {
    throw new Error('Database connection failed')
  }
  return db
}

// Validate QR code without logging attendance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrData } = body

    if (!qrData) {
      return NextResponse.json(
        { error: 'Missing QR code data' },
        { status: 400 }
      )
    }

    // Parse QR code data
    let parsedQRData
    try {
      parsedQRData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid QR code format' },
        { status: 400 }
      )
    }

    const { workerId, groupId, securityHash, expirationDate } = parsedQRData

    // Check if QR code has expired
    if (new Date(expirationDate) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'QR code has expired' },
        { status: 200 }
      )
    }

    // Verify security hash
    const expectedHash = crypto.createHash('sha256')
      .update(`${workerId}-${groupId}-${process.env.QR_SECRET || 'default-secret'}`)
      .digest('hex')

    if (securityHash !== expectedHash) {
      return NextResponse.json(
        { valid: false, error: 'Invalid QR code security hash' },
        { status: 200 }
      )
    }

    // Verify worker exists and is assigned to the group
    const worker = await ensureDb()
      .select({
        id: workers.id,
        userId: workers.userId,
        groupId: workers.groupId,
        firstName: users.firstName,
        lastName: users.lastName,
        groupName: groups.name,
        groupLocation: groups.location,
        isActive: workers.isActive
      })
      .from(workers)
      .innerJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(workers.groupId, groups.id))
      .where(eq(workers.id, workerId))
      .limit(1)

    if (!worker[0]) {
      return NextResponse.json(
        { valid: false, error: 'Worker not found' },
        { status: 200 }
      )
    }

    const workerData = worker[0]

    // Check if worker is active
    if (!workerData.isActive) {
      return NextResponse.json(
        { valid: false, error: 'Worker account is inactive' },
        { status: 200 }
      )
    }

    // Verify worker is assigned to the correct group
    if (workerData.groupId !== groupId) {
      return NextResponse.json(
        { valid: false, error: 'Worker not assigned to this group' },
        { status: 200 }
      )
    }

    return NextResponse.json({
      valid: true,
      worker: {
        id: workerData.id,
        name: `${workerData.firstName} ${workerData.lastName}`,
        group: workerData.groupName,
        location: workerData.groupLocation
      },
      qrData: parsedQRData
    })

  } catch (error) {
    console.error('QR validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
