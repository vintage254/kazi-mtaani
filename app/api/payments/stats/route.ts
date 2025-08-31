import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq, count, sum } from 'drizzle-orm'
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

    // Get payment stats by status
    const [pendingStats, approvedStats, disbursedStats] = await Promise.all([
      db
        .select({
          count: count(),
          totalAmount: sum(payments.amount)
        })
        .from(payments)
        .where(eq(payments.status, 'pending')),
      
      db
        .select({
          count: count(),
          totalAmount: sum(payments.amount)
        })
        .from(payments)
        .where(eq(payments.status, 'approved')),
      
      db
        .select({
          count: count(),
          totalAmount: sum(payments.amount)
        })
        .from(payments)
        .where(eq(payments.status, 'disbursed'))
    ])

    const stats = {
      pending: {
        count: pendingStats[0]?.count || 0,
        totalAmount: parseFloat(pendingStats[0]?.totalAmount || '0')
      },
      approved: {
        count: approvedStats[0]?.count || 0,
        totalAmount: parseFloat(approvedStats[0]?.totalAmount || '0')
      },
      disbursed: {
        count: disbursedStats[0]?.count || 0,
        totalAmount: parseFloat(disbursedStats[0]?.totalAmount || '0')
      }
    }

    return NextResponse.json(
      stats,
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching payment stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment stats' },
      { status: 500 }
    )
  }
}
