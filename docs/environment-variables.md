# Environment Variables

This document lists all required environment variables for the Kazi Mtaani application.

## Database Configuration
```bash
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/kazi_mtaani"
```

## Authentication (Clerk)
```bash
# Clerk authentication keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
```

## WebAuthn Configuration (Required for Fingerprint Authentication)
```bash
# WebAuthn Relying Party ID (usually your domain)
WEBAUTHN_RP_ID="localhost"  # Use your domain in production (e.g., "kazi-mtaani.com")

# WebAuthn Relying Party Name (human-readable service name)
WEBAUTHN_RP_NAME="Kazi Mtaani Attendance System"

# WebAuthn Expected Origin (full URL including protocol)
WEBAUTHN_ORIGIN="http://localhost:3000"  # Use https:// in production
```

## Scanner API Security
```bash
# Secret key for QR code security hash validation
QR_SECRET="your-secure-random-secret-key-here"
```

## Setup Instructions

1. Copy these variables to your `.env.local` file
2. Replace placeholder values with your actual configuration
3. For production deployment:
   - Use your actual domain for `WEBAUTHN_RP_ID` and `WEBAUTHN_ORIGIN`
   - Ensure `WEBAUTHN_ORIGIN` uses HTTPS
   - Generate a strong random secret for `QR_SECRET`
   - Use production database credentials

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use strong, randomly generated secrets for production
- WebAuthn requires HTTPS in production environments
- Store sensitive credentials securely in your deployment platform
