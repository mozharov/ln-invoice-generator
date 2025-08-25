# Lightning Network Invoice Generator Service

A minimalistic service for generating Lightning Network invoices through API, allowing website owners to easily integrate Bitcoin Lightning payments via a "Donate" button.

## Features

- **Simple Web Interface**: Generate API endpoints by entering your NWC secret
- **RESTful API**: Create Lightning invoices programmatically
- **Rate Limiting**: Built-in protection against spam
- **SQLite Database**: Lightweight data storage
- **Security-First**: NWC secrets are never logged or returned in responses

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the service**:
   ```bash
   npm start
   ```

3. **Visit the web interface**:
   Open `http://localhost:3000` in your browser

4. **Enter your NWC secret** and get your unique API endpoint

## API Endpoints

### Register NWC Secret
```
POST /api/register
Content-Type: application/json

{
  "nwc_secret": "nostr+walletconnect://..."
}
```

**Response**:
```json
{
  "success": true,
  "endpoint": "https://domain.com/api/invoice/550e8400-e29b-41d4-a716-446655440000",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Generate Invoice
```
POST /api/invoice/:id
Content-Type: application/json

{
  "amount": 1000,
  "description": "Website donation"
}
```

**Response**:
```json
{
  "success": true,
  "invoice": "lnbc1000n1p0xyz...",
  "amount": 1000
}
```

## Integration Example

```javascript
// Simple donation button
document.getElementById('donate-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('YOUR_ENDPOINT_HERE', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: 1000, // satoshis
                description: 'Website donation'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Open Lightning wallet
            window.open(`lightning:${data.invoice}`);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error generating invoice:', error);
    }
});
```

## Configuration
```bash
PORT=3000
NODE_ENV=production
HOST=https://yourdomain.com
DATABASE_PATH=./data/invoices.db
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=60000
```

**Important**: Set `HOST` to your public domain URL (e.g., `https://yourdomain.com`) to ensure generated endpoint URLs are correct for your deployment.

## Security

- NWC secrets are never logged or returned in API responses
- Rate limiting prevents spam (10 requests per minute by default)
- Input validation on all endpoints
- HTTPS recommended in production
- Parameterized database queries prevent SQL injection

## Requirements

- Node.js 18+ (for native fetch support)
- A Nostr Wallet Connect (NWC) enabled wallet
- NWC connection string from compatible wallets:
  - Alby Hub
  - coinos
  - Primal
  - lnwallet.app
  - Yakihonne
  - And other NWC-enabled wallets

## License

MIT