import { NextRequest, NextResponse } from 'next/server'
import { checkUsernameAvailability } from '@/lib/db/user-actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { available: false, error: 'Username must be at least 3 characters long' },
        { status: 200 }
      )
    }

    if (username.length > 20) {
      return NextResponse.json(
        { available: false, error: 'Username must be no more than 20 characters long' },
        { status: 200 }
      )
    }

    // Check if username contains only allowed characters (alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Username can only contain letters, numbers, and underscores' },
        { status: 200 }
      )
    }

    const isAvailable = await checkUsernameAvailability(username)

    return NextResponse.json({
      available: isAvailable,
      username: username
    })

  } catch (error) {
    console.error('Error checking username availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
