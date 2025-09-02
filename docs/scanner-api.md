# Scanner API Documentation

## Overview
The Kazi Mtaani Scanner API enables external scanner machines to process worker attendance using both QR codes and fingerprint authentication, providing flexible and secure attendance logging.

## Base URL
```
https://your-domain.com/api/scanner
```

## Authentication
Currently, the API uses QR code security hashes for validation. Future versions may include API keys for scanner authentication.

## Endpoints

### 1. Health Check
**GET** `/api/scanner`

Check if the scanner API is running.

**Response:**
```json
{
  "status": "active",
  "message": "Kazi Mtaani Scanner API is running",
  "timestamp": "2024-08-29T10:46:22.000Z",
  "version": "1.0.0"
}
```

### 2. Process QR Code Scan
**POST** `/api/scanner`

Process a QR code scan and log attendance (check-in or check-out).

### 3. Process Fingerprint Authentication
**POST** `/api/scanner/fingerprint`

Process fingerprint authentication and log attendance (check-in or check-out).

**Request Body:**
```json
{
  "workerId": 123,
  "credential": {
    "id": "base64url_credential_id",
    "response": {
      "authenticatorData": "...",
      "signature": "...",
      "userHandle": "..."
    }
  },
  "challenge": "base64url_challenge_from_server",
  "scannerId": "SCANNER_001",
  "scannerLocation": "Main Gate"
}
```

**Success Response:**
```json
{
  "success": true,
  "action": "check-in",
  "method": "fingerprint",
  "worker": {
    "id": 123,
    "name": "John Doe",
    "group": "Construction Team",
    "location": "Downtown Site"
  },
  "attendance": {
    "date": "2024-08-29",
    "checkInTime": "2024-08-29T10:46:22.000Z",
    "checkOutTime": null,
    "hoursWorked": null,
    "location": "Main Gate",
    "fingerprintMatchScore": 95.0
  },
  "timestamp": "2024-08-29T10:46:22.000Z"
}
```

### 4. Unified Authentication (QR Code or Fingerprint)
**POST** `/api/scanner/unified`

Process either QR code or fingerprint authentication based on the method parameter.

**Request Body (QR Code):**
```json
{
  "method": "qr_code",
  "qrData": "{\"workerId\":123,\"workerName\":\"John Doe\",...}",
  "scannerId": "SCANNER_001",
  "scannerLocation": "Main Gate"
}
```

**Request Body (Fingerprint):**
```json
{
  "method": "fingerprint",
  "workerId": 123,
  "credential": {...},
  "challenge": "base64url_challenge",
  "scannerId": "SCANNER_001",
  "scannerLocation": "Main Gate"
}
```

**Request Body:**
```json
{
  "qrData": "{\"workerId\":123,\"workerName\":\"John Doe\",\"groupId\":45,\"groupName\":\"Construction Team\",\"groupLocation\":\"Downtown Site\",\"expirationDate\":\"2024-09-28T10:46:22.000Z\",\"timestamp\":\"2024-08-29T10:46:22.000Z\",\"securityHash\":\"abc123...\"}",
  "scannerId": "SCANNER_001",
  "scannerLocation": "Main Gate",
  "timestamp": "2024-08-29T10:46:22.000Z"
}
```

**Success Response (Check-in):**
```json
{
  "success": true,
  "action": "check-in",
  "worker": {
    "id": 123,
    "name": "John Doe",
    "group": "Construction Team",
    "location": "Downtown Site"
  },
  "attendance": {
    "date": "2024-08-29",
    "checkInTime": "2024-08-29T10:46:22.000Z",
    "checkOutTime": null,
    "hoursWorked": null,
    "location": "Main Gate"
  },
  "timestamp": "2024-08-29T10:46:22.000Z"
}
```

**Success Response (Check-out):**
```json
{
  "success": true,
  "action": "check-out",
  "worker": {
    "id": 123,
    "name": "John Doe",
    "group": "Construction Team",
    "location": "Downtown Site"
  },
  "attendance": {
    "date": "2024-08-29",
    "checkInTime": "2024-08-29T08:00:00.000Z",
    "checkOutTime": "2024-08-29T17:00:00.000Z",
    "hoursWorked": 9.0,
    "location": "Main Gate"
  },
  "timestamp": "2024-08-29T17:00:00.000Z"
}
```

**Error Responses:**
```json
// Invalid QR Code
{
  "error": "Invalid or expired QR code"
}

// Worker not found
{
  "error": "Worker not found"
}

// Worker not assigned to group
{
  "error": "Worker not assigned to this group"
}
```

### 3. Validate QR Code
**POST** `/api/scanner/validate`

Validate a QR code without logging attendance.

**Request Body:**
```json
{
  "qrData": "{\"workerId\":123,\"groupId\":45,\"securityHash\":\"abc123...\",\"expirationDate\":\"2024-09-28T10:46:22.000Z\"}"
}
```

**Success Response:**
```json
{
  "valid": true,
  "worker": {
    "id": 123,
    "name": "John Doe",
    "group": "Construction Team",
    "location": "Downtown Site"
  },
  "qrData": {
    "workerId": 123,
    "workerName": "John Doe",
    "groupId": 45,
    "groupName": "Construction Team",
    "groupLocation": "Downtown Site",
    "expirationDate": "2024-09-28T10:46:22.000Z",
    "securityHash": "abc123..."
  }
}
```

**Invalid Response:**
```json
{
  "valid": false,
  "error": "QR code has expired"
}
```

### 4. Get Attendance Records
**GET** `/api/scanner/attendance`

Retrieve attendance records with optional filters.

**Query Parameters:**
- `workerId` (optional): Filter by worker ID
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `startDate` & `endDate` (optional): Filter by date range

**Examples:**
```
GET /api/scanner/attendance?workerId=123
GET /api/scanner/attendance?date=2024-08-29
GET /api/scanner/attendance?startDate=2024-08-01&endDate=2024-08-31
```

**Response:**
```json
{
  "success": true,
  "attendance": [
    {
      "id": 1,
      "workerId": 123,
      "workerName": "John Doe",
      "date": "2024-08-29",
      "checkInTime": "2024-08-29T08:00:00.000Z",
      "checkOutTime": "2024-08-29T17:00:00.000Z",
      "status": "present",
      "location": "Main Gate",
      "notes": "Scanned by SCANNER_001 at Main Gate",
      "scannerId": "SCANNER_001",
      "hoursWorked": 9.0
    }
  ],
  "count": 1
}
```

### 5. Test Endpoint
**GET** `/api/scanner/test`

Test endpoint for scanner connectivity.

**Response:**
```json
{
  "status": "success",
  "message": "Scanner API test endpoint is working",
  "timestamp": "2024-08-29T10:46:22.000Z",
  "endpoints": {
    "scan": "/api/scanner (POST) - Process QR code scans",
    "validate": "/api/scanner/validate (POST) - Validate QR codes only",
    "attendance": "/api/scanner/attendance (GET) - Get attendance records",
    "test": "/api/scanner/test (GET) - This test endpoint"
  }
}
```

## QR Code Format

QR codes contain JSON data with the following structure:

```json
{
  "workerId": 123,
  "workerName": "John Doe",
  "groupId": 45,
  "groupName": "Construction Team",
  "groupLocation": "Downtown Site",
  "expirationDate": "2024-09-28T10:46:22.000Z",
  "timestamp": "2024-08-29T10:46:22.000Z",
  "securityHash": "sha256_hash_for_validation"
}
```

## Security

- QR codes expire after 30 days
- Each QR code has a SHA-256 security hash
- Hash is generated using: `workerId-groupId-SECRET_KEY`
- Invalid or expired QR codes are rejected

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (invalid QR code)
- `403` - Forbidden (worker not assigned to group)
- `404` - Not Found (worker not found)
- `500` - Internal Server Error

## Integration Example

```javascript
// Scanner machine code example
async function scanQRCode(qrCodeData, scannerId) {
  try {
    const response = await fetch('/api/scanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrData: qrCodeData,
        scannerId: scannerId,
        scannerLocation: 'Main Entrance',
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`${result.action} successful for ${result.worker.name}`);
      // Display success message on scanner screen
    } else {
      console.error('Scan failed:', result.error);
      // Display error message on scanner screen
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

## Environment Variables

Required environment variables:
```
QR_SECRET=your-secret-key-for-qr-validation
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```
