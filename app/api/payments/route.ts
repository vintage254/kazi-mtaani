import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, workers, users, groups } from '@/lib/db/schema'
import { eq, and, gte, lte, desc, count, sum } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const workerId = searchParams.get('workerId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status')

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    let baseQuery = db
      .select({
        id: payments.id,
        amount: payments.amount,
        period: payments.period,
        status: payments.status,
        createdAt: payments.createdAt,
        approvedAt: payments.approvedAt,
        disbursedAt: payments.disbursedAt,
        workerId: workers.id,
        workerName: users.firstName,
        workerLastName: users.lastName,
        groupId: groups.id,
        groupName: groups.name
      })
      .from(payments)
      .innerJoin(workers, eq(payments.workerId, workers.id))
      .innerJoin(users, eq(workers.userId, users.id))
      .innerJoin(groups, eq(payments.groupId, groups.id))

    // Apply filters
    const conditions = []
    
    if (groupId) {
      conditions.push(eq(payments.groupId, parseInt(groupId)))
    }
    
    if (workerId) {
      conditions.push(eq(payments.workerId, parseInt(workerId)))
    }
    
    if (dateFrom) {
      conditions.push(gte(payments.createdAt, new Date(dateFrom)))
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      conditions.push(lte(payments.createdAt, endDate))
    }
    
    if (status) {
      conditions.push(eq(payments.status, status as 'pending' | 'approved' | 'disbursed' | 'failed'))
    }

    const records = conditions.length > 0 
      ? await baseQuery.where(and(...conditions)).orderBy(desc(payments.createdAt))
      : await baseQuery.orderBy(desc(payments.createdAt))

    return NextResponse.json(
      { records },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching payment records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment records' },
      { status: 500 }
    )
  }
}
