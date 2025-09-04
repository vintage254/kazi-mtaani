// Shared challenge store for WebAuthn operations
// In production, this should be replaced with Redis or database storage

interface Challenge {
  challenge: string;
  timestamp: number;
}

class ChallengeStore {
  private store: { [key: string]: Challenge } = {};
  private readonly CHALLENGE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  set(userId: string, challenge: string): void {
    this.store[userId] = {
      challenge,
      timestamp: Date.now()
    };
  }

  get(userId: string): string | null {
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

  delete(userId: string): void {
    delete this.store[userId];
  }

  // Clean up expired challenges periodically
  cleanup(): void {
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

// Clean up expired challenges every 10 minutes
setInterval(() => {
  challengeStore.cleanup();
}, 10 * 60 * 1000);
