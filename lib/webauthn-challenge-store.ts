// Shared challenge store for WebAuthn operations
// Uses database storage for serverless compatibility (Vercel)

import { db } from './db';
import { sql } from 'drizzle-orm';

interface Challenge {
  challenge: string;
  timestamp: number;
}

class ChallengeStore {
  private store: { [key: string]: Challenge } = {};
  private readonly CHALLENGE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private useDatabase = true; // Use database for serverless environments

  async set(userId: string, challenge: string): Promise<void> {
    if (this.useDatabase && db) {
      try {
        // Store in database for serverless compatibility
        await db.execute(sql`
          INSERT INTO webauthn_challenges (user_id, challenge, expires_at)
          VALUES (${userId}, ${challenge}, ${new Date(Date.now() + this.CHALLENGE_TIMEOUT)})
          ON CONFLICT (user_id) 
          DO UPDATE SET challenge = ${challenge}, expires_at = ${new Date(Date.now() + this.CHALLENGE_TIMEOUT)}
        `);
        return;
      } catch (error) {
        console.error('Failed to store challenge in database, falling back to memory:', error);
      }
    }
    
    // Fallback to in-memory storage
    this.store[userId] = {
      challenge,
      timestamp: Date.now()
    };
  }

  async get(userId: string): Promise<string | null> {
    if (this.useDatabase && db) {
      try {
        // Get from database
        const result = await db.execute(sql`
          SELECT challenge FROM webauthn_challenges 
          WHERE user_id = ${userId} AND expires_at > NOW()
        `);
        
        if (result.rows && result.rows.length > 0) {
          return (result.rows[0] as { challenge: string }).challenge;
        }
        return null;
      } catch (error) {
        console.error('Failed to get challenge from database, falling back to memory:', error);
      }
    }
    
    // Fallback to in-memory storage
    const entry = this.store[userId];
    if (!entry) {
      return null;
    }

    // Check if challenge has expired
    if (Date.now() - entry.timestamp > this.CHALLENGE_TIMEOUT) {
      delete this.store[userId];
      return null;
    }

    return entry.challenge;
  }

  async delete(userId: string): Promise<void> {
    if (this.useDatabase && db) {
      try {
        await db.execute(sql`
          DELETE FROM webauthn_challenges WHERE user_id = ${userId}
        `);
        return;
      } catch (error) {
        console.error('Failed to delete challenge from database:', error);
      }
    }
    
    // Fallback to in-memory storage
    delete this.store[userId];
  }

  // Clean up expired challenges periodically
  async cleanup(): Promise<void> {
    if (this.useDatabase && db) {
      try {
        await db.execute(sql`
          DELETE FROM webauthn_challenges WHERE expires_at < NOW()
        `);
        return;
      } catch (error) {
        console.error('Failed to cleanup challenges from database:', error);
      }
    }
    
    // Fallback to in-memory cleanup
    const now = Date.now();
    Object.keys(this.store).forEach(userId => {
      if (now - this.store[userId].timestamp > this.CHALLENGE_TIMEOUT) {
        delete this.store[userId];
      }
    });
  }
}

// Export a singleton instance
export const challengeStore = new ChallengeStore();
