import { NextRequest, NextResponse } from 'next/server'
import { createUserWithUsername } from '@/lib/db/user-actions'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, firstName, lastName, phone, role } = body

    // Validate required fields
    if (!username || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Username, first name, last name, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['worker', 'supervisor', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Create user with username
    const user = await createUserWithUsername({
      clerkId: userId,
      username,
      firstName,
      lastName,
      phone,
      role
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error creating user with username:', error)
    
    if (error instanceof Error && error.message === 'Username is already taken') {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
