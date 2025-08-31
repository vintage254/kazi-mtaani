import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { groups, workers, users } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get all groups with worker count and supervisor info
    const groupsWithStats = await db
      .select({
        id: groups.id,
        name: groups.name,
        location: groups.location,
        status: groups.status,
        supervisorName: users.firstName,
        supervisorLastName: users.lastName,
        workerCount: count(workers.id),
        updatedAt: groups.updatedAt
      })
      .from(groups)
      .leftJoin(users, eq(groups.supervisorId, users.id))
      .leftJoin(workers, eq(groups.id, workers.groupId))
      .groupBy(groups.id, users.firstName, users.lastName)

    return NextResponse.json(
      { groups: groupsWithStats },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, location, supervisorId } = body

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      )
    }

    const newGroup = await db
      .insert(groups)
      .values({
        name,
        location,
        supervisorId: supervisorId || null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return NextResponse.json(
      { group: newGroup[0] },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}
