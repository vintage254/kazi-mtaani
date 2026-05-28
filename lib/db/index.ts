import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Only validate DATABASE_URL at runtime, not during next build's static generation phase
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }
}

// Create database connection only on server side
const sql = typeof window === 'undefined' && process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null

export const db = sql ? drizzle(sql, { schema }) : null
