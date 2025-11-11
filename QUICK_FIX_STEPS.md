# Quick Fix Steps for "No Passkey Available" Error

## The Problem
The credential ID format was inconsistent between enrollment and authentication, causing the "No passkey available" error.

## Solution: Reset and Re-Enroll

### Step 1: Delete Old Authenticators from Database

Go to your Neon Console (the screenshot you showed) and run this SQL:

```sql
-- Delete all old authenticators
DELETE FROM authenticators;

-- Reset fingerprint enabled flag
UPDATE workers SET fingerprint_enabled = false;
```

### Step 2: Deploy the Fixed Code

```bash
git add .
git commit -m "fix: credential ID format consistency for WebAuthn"
git push
```

Wait for Vercel to deploy (usually 1-2 minutes).

### Step 3: Re-Enroll Fingerprint on Your Phone

1. Open your Vercel app on your phone
2. Log in as a worker
3. Go to Attendance page
4. Click "Settings"
5. Click "Enroll Fingerprint"
6. Follow the prompts to scan your fingerprint
7. Should see: "✓ Fingerprint enrolled successfully"

### Step 4: Test Authentication

1. Go back to Attendance page
2. Click "Use Fingerprint"
3. Scan your fingerprint when prompted
4. Should see: "✓ Check-in successful!"

## Alternative: Use Reset Endpoint

Instead of manually deleting from database, you can use the reset endpoint:

1. While logged in on your phone, visit:
   ```
   https://your-app.vercel.app/api/webauthn/reset
   ```

2. This will show a JSON response confirming reset

3. Then re-enroll fingerprint as described in Step 3 above

## What Was Fixed

### Before (BROKEN):
- **Registration**: Stored credential ID as base64
- **Authentication**: Converted base64 → base64url
- **Result**: Mismatch! "No passkey available"

### After (FIXED):
- **Registration**: Stores credential ID as base64
- **Authentication**: Uses credential ID as-is (base64)
- **Result**: Match! ✅

## Verification

After re-enrolling, check the database:

```sql
SELECT 
  u.username,
  a.credential_id,
  LENGTH(a.credential_id) as id_length,
  a.created_at
FROM authenticators a
JOIN users u ON a.user_id = u.id;
```

You should see:
- One row per enrolled user
- `credential_id` should be a long base64 string
- `created_at` should be recent (after you re-enrolled)

## Still Having Issues?

### Check Environment Variables in Vercel

Make sure these are set correctly:

```bash
WEBAUTHN_RP_ID=your-actual-domain.vercel.app
WEBAUTHN_ORIGIN=https://your-actual-domain.vercel.app
```

### Check Browser Console

Open browser console (F12) and look for errors when clicking "Use Fingerprint".

### Visit Debug Endpoint

```
https://your-app.vercel.app/api/webauthn/debug
```

Should show:
- `authenticatorsCount: 1` (or more)
- Correct `rpID` and `origin`

## Common Errors and Solutions

### "No passkey available"
- **Cause**: No fingerprint enrolled, or old enrollment with wrong format
- **Solution**: Delete old authenticators and re-enroll

### "Authentication timed out"
- **Cause**: Took too long to scan fingerprint (60 second timeout)
- **Solution**: Try again and scan immediately when prompted

### "Invalid origin"
- **Cause**: `WEBAUTHN_ORIGIN` doesn't match your actual URL
- **Solution**: Check environment variables in Vercel Dashboard

### "No challenge found"
- **Cause**: Challenge expired or not stored in database
- **Solution**: Make sure database migration was run, try again

## Success Checklist

✅ Old authenticators deleted from database  
✅ Code deployed to Vercel  
✅ Environment variables set correctly  
✅ Fingerprint re-enrolled on phone  
✅ Authentication works without errors  
✅ Attendance record created and visible to supervisor  

## Next Steps After Success

1. Test check-out (use fingerprint again)
2. Verify attendance shows on supervisor dashboard
3. Test supervisor approval workflow
4. Celebrate! 🎉
