# Vercel Deployment Guide for Fingerprint Authentication

## Critical: Environment Variables on Vercel

### Step 1: Set Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

```bash
# WebAuthn Configuration (CRITICAL for fingerprint to work)
WEBAUTHN_RP_ID=your-app.vercel.app
WEBAUTHN_RP_NAME=Kazi Mtaani
WEBAUTHN_ORIGIN=https://your-app.vercel.app

# Example:
# WEBAUTHN_RP_ID=kazi-mtaani.vercel.app
# WEBAUTHN_ORIGIN=https://kazi-mtaani.vercel.app
```

**IMPORTANT:**
- `WEBAUTHN_RP_ID` = Your Vercel domain WITHOUT `https://`
- `WEBAUTHN_ORIGIN` = Your full Vercel URL WITH `https://`
- Must use HTTPS (Vercel provides this automatically)
- NO trailing slashes

### Step 2: Run Database Migration

After deploying, run this SQL migration on your production database:

```sql
-- Create webauthn_challenges table for serverless compatibility
CREATE TABLE IF NOT EXISTS "webauthn_challenges" (
	"user_id" text PRIMARY KEY NOT NULL,
	"challenge" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS "webauthn_challenges_expires_at_idx" ON "webauthn_challenges" ("expires_at");
```

You can run this via:
- Neon Console SQL Editor
- Vercel Postgres Dashboard
- Or any PostgreSQL client

### Step 3: Redeploy After Setting Environment Variables

After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" (optional)

## Why This Was Failing Before

### Problem 1: In-Memory Challenge Store
**Issue:** Vercel uses serverless functions that don't share memory between requests.

**Solution:** Now using database to store WebAuthn challenges.

### Problem 2: Wrong Domain Configuration
**Issue:** WebAuthn requires exact domain match. `localhost` doesn't work on Vercel.

**Solution:** Set `WEBAUTHN_RP_ID` and `WEBAUTHN_ORIGIN` to your actual Vercel domain.

### Problem 3: HTTP vs HTTPS
**Issue:** WebAuthn requires HTTPS in production (except localhost).

**Solution:** Vercel provides HTTPS automatically. Just use `https://` in `WEBAUTHN_ORIGIN`.

## Testing on Your Phone

### Step 1: Enroll Fingerprint
1. Open your Vercel app on your phone
2. Log in as a worker
3. Go to Attendance page
4. Click "Settings" → "Enroll Fingerprint"
5. Follow the prompts to scan your fingerprint
6. Should see: "✓ Fingerprint enrolled successfully"

### Step 2: Daily Check-In
1. Open app on your phone
2. Go to Attendance page
3. Click "Use Fingerprint"
4. Scan your fingerprint when prompted
5. Should see: "✓ Check-in successful!"

### Step 3: Verify on Supervisor Dashboard
1. Log in as supervisor/admin
2. Go to Attendance Management
3. Should see the worker's attendance record
4. Status: "Pending" (orange badge)
5. Click "Approve"

## Troubleshooting

### Error: "Authentication timed out"
**Cause:** Took too long to scan fingerprint (60 second timeout)

**Solution:** Try again and scan fingerprint immediately when prompted.

### Error: "No challenge found for user"
**Cause:** Database migration not run, or challenge expired

**Solution:** 
1. Run the database migration (see Step 2 above)
2. Try enrolling/authenticating again

### Error: "Invalid origin"
**Cause:** `WEBAUTHN_ORIGIN` doesn't match your actual Vercel URL

**Solution:** 
1. Check your Vercel domain (e.g., `kazi-mtaani.vercel.app`)
2. Set `WEBAUTHN_ORIGIN=https://kazi-mtaani.vercel.app` (exact match)
3. Redeploy

### Error: "Authenticator not found"
**Cause:** Credential ID format mismatch

**Solution:** 
1. Delete old authenticator from database
2. Re-enroll fingerprint
3. Try authentication again

## Verification Checklist

✅ Environment variables set in Vercel Dashboard  
✅ `WEBAUTHN_RP_ID` = your Vercel domain (no https://)  
✅ `WEBAUTHN_ORIGIN` = your full Vercel URL (with https://)  
✅ Database migration run  
✅ Redeployed after setting environment variables  
✅ Testing on HTTPS (Vercel provides this)  
✅ Using a phone with fingerprint sensor  
✅ Browser supports WebAuthn (Chrome, Safari, Firefox, Edge)  

## Debug Endpoint

Visit this URL while logged in to check your configuration:

```
https://your-app.vercel.app/api/webauthn/debug
```

This will show:
- Number of authenticators enrolled
- WebAuthn configuration (RP ID, Origin)
- Credential details

## Custom Domain (Optional)

If you're using a custom domain (e.g., `kazi-mtaani.com`):

```bash
WEBAUTHN_RP_ID=kazi-mtaani.com
WEBAUTHN_ORIGIN=https://kazi-mtaani.com
```

**Important:** Re-enroll fingerprints after changing domain!

## Support

If issues persist:
1. Check Vercel Function Logs (Dashboard → Logs)
2. Check browser console (F12) for errors
3. Visit `/api/webauthn/debug` to verify configuration
4. Ensure database migration was successful
