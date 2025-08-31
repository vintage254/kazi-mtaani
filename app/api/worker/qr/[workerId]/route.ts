import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getWorkerQRCode } from '@/lib/db/actions'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workerId: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { workerId } = await params
    const workerIdNum = parseInt(workerId)
    if (isNaN(workerIdNum)) {
      return NextResponse.json(
        { error: 'Invalid worker ID' },
        { status: 400 }
      )
    }

    const qrData = await getWorkerQRCode(workerIdNum)

    return NextResponse.json(
      qrData,
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching worker QR code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    )
  }
}
