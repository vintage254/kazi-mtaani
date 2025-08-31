import { NextRequest, NextResponse } from 'next/server'
import { createUserWithUsername } from '@/lib/db/user-actions'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Onboarding API called')
    
    // Check database connection first
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not configured')
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      )
    }

    const { userId } = await auth()
    console.log('👤 User ID from auth:', userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let body
    try {
      const rawBody = await request.text()
      console.log('📝 Raw request body:', rawBody)
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error('Request body is empty')
      }
      
      body = JSON.parse(rawBody)
      console.log('📝 Parsed request body:', body)
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
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

    console.log('✅ Validation passed, creating user...')
    
    // Create user with username
    const user = await createUserWithUsername({
      clerkId: userId,
      username,
      firstName,
      lastName,
      phone,
      role
    })

    console.log('✅ User created successfully:', user)

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
    console.error('❌ Error in onboarding API:', error)
    
    if (error instanceof Error && error.message === 'Username is already taken') {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    if (error instanceof Error && error.message.includes('Database not available')) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
