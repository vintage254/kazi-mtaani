import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Only create database connection on server side
if (typeof window === 'undefined') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }
}

// Create database connection only on server side
const sql = typeof window === 'undefined' && process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : null

export const db = sql ? drizzle(sql, { schema }) : null
