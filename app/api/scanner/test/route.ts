import { NextRequest, NextResponse } from 'next/server'

// Test endpoint for scanner machines to verify connectivity
export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Scanner API test endpoint is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      scan: '/api/scanner (POST) - Process QR code scans',
      validate: '/api/scanner/validate (POST) - Validate QR codes only',
      attendance: '/api/scanner/attendance (GET) - Get attendance records',
      test: '/api/scanner/test (GET) - This test endpoint'
    }
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
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid JSON in request body',
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}
