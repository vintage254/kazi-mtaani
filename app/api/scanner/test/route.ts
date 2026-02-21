import { NextRequest, NextResponse } from 'next/server'

// Test endpoint for scanner machines to verify connectivity
export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Scanner API test endpoint is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      unified: '/api/scanner/unified (POST) - Fingerprint or face authentication with GPS',
      fingerprint: '/api/scanner/fingerprint (POST) - Fingerprint-only authentication',
      attendance: '/api/scanner/attendance (GET) - Get attendance records',
      test: '/api/scanner/test (GET) - This test endpoint',
    },
  })
}

// POST test with sample data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      status: 'success',
      message: 'Test POST request received',
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid JSON in request body',
      timestamp: new Date().toISOString(),
    }, { status: 400 })
  }
}
