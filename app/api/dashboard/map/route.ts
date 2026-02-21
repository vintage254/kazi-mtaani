import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { attendance, workers, users, groups } from '@/lib/db/schema'
import { eq, gte, desc, and, isNotNull } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Get all groups with GPS coordinates
    const groupSites = await db
      .select({
        id: groups.id,
        name: groups.name,
        location: groups.location,
        latitude: groups.latitude,
        longitude: groups.longitude,
        geofenceRadius: groups.geofenceRadius,
        status: groups.status,
      })
      .from(groups)
      .where(
        and(
          isNotNull(groups.latitude),
          isNotNull(groups.longitude)
        )
      )

    // Get today's check-ins with GPS data
    const today = new Date().toISOString().split('T')[0]
    const todayCheckIns = await db
      .select({
        id: attendance.id,
        workerId: attendance.workerId,
        workerName: users.firstName,
        workerLastName: users.lastName,
        groupName: groups.name,
        checkInTime: attendance.checkInTime,
        checkInLatitude: attendance.checkInLatitude,
        checkInLongitude: attendance.checkInLongitude,
        gpsVerified: attendance.gpsVerified,
        gpsDistanceMeters: attendance.gpsDistanceMeters,
        attendanceMethod: attendance.attendanceMethod,
        status: attendance.status,
      })
      .from(attendance)
      .innerJoin(workers, eq(attendance.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(attendance.groupId, groups.id))
      .where(
        and(
          eq(attendance.date, today),
          isNotNull(attendance.checkInLatitude),
          isNotNull(attendance.checkInLongitude)
        )
      )
      .orderBy(desc(attendance.checkInTime))

    // Get recent failed check-ins (GPS outside geofence) from alerts
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const recentActivity = await db
      .select({
        id: attendance.id,
        workerName: users.firstName,
        workerLastName: users.lastName,
        groupName: groups.name,
        checkInLatitude: attendance.checkInLatitude,
        checkInLongitude: attendance.checkInLongitude,
        gpsVerified: attendance.gpsVerified,
        gpsDistanceMeters: attendance.gpsDistanceMeters,
        checkInTime: attendance.checkInTime,
      })
      .from(attendance)
      .innerJoin(workers, eq(attendance.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))
      .leftJoin(groups, eq(attendance.groupId, groups.id))
      .where(gte(attendance.checkInTime, yesterday))
      .orderBy(desc(attendance.checkInTime))
      .limit(50)

    return NextResponse.json({
      sites: groupSites,
      checkIns: todayCheckIns,
      recentActivity,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      }
    })
  } catch (error) {
    console.error('Error fetching map data:', error)
    return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 })
  }
}
