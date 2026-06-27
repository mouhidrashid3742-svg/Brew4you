# API Integration Guide - Brew4You

## Quick Start

### 1. User Authentication

#### Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+923001234567"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpForDemo": "123456"  // Only in demo mode
}
```

#### Verify OTP & Login
```bash
curl -X POST http://localhost:3000/api/auth/otp-verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+923001234567",
    "otp": "123456"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id_123",
    "phone": "+923001234567",
    "name": "User Name",
    "loyaltyPoints": 0
  },
  "token": "session_token_xyz"
}
```

### 2. Shopping Cart

#### Get Cart
```bash
curl http://localhost:3000/api/cart?userId=user_id_123
```

#### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_123",
    "item": {
      "itemId": "golden-spanish-latte",
      "name": "Golden Spanish Latte",
      "basePrice": 520,
      "customizations": {
        "milk": "Oat Milk",
        "size": "Large (350ml)",
        "extraShots": "+1 Shot"
      },
      "quantity": 1
    }
  }'
```

#### Update Cart Item
```bash
curl -X PUT http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_123",
    "itemIndex": 0,
    "quantity": 2
  }'
```

#### Clear Cart
```bash
curl -X DELETE "http://localhost:3000/api/cart?userId=user_id_123"
```

### 3. Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_123",
    "items": [
      {
        "itemId": "golden-spanish-latte",
        "name": "Golden Spanish Latte",
        "basePrice": 520,
        "customizations": {
          "milk": "Oat Milk",
          "size": "Large (350ml)"
        },
        "quantity": 1,
        "subtotal": 600
      }
    ],
    "deliveryAddress": {
      "address": "123 Main St",
      "city": "Karachi",
      "zipCode": "75500",
      "coordinates": {
        "lat": 24.8607,
        "lng": 67.0011
      }
    },
    "paymentMethod": "stripe",
    "scheduledFor": "2024-01-15T14:30:00Z",
    "notes": "Extra hot, no foam"
  }'
```

Response:
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-1705276800000-a1b2c3d4",
    "totalAmount": 945,
    "status": "pending",
    "estimatedDeliveryTime": "2024-01-15T14:35:00Z"
  }
}
```

### 4. Track Order

```bash
curl http://localhost:3000/api/orders/ORD-1705276800000-a1b2c3d4/track
```

Response:
```json
{
  "success": true,
  "orderId": "ORD-1705276800000-a1b2c3d4",
  "status": "brewing",
  "estimatedDeliveryTime": "2024-01-15T14:35:00Z",
  "items": [...],
  "totalAmount": 945,
  "trackingUpdates": [
    {
      "status": "pending",
      "timestamp": "2024-01-15T14:05:00Z",
      "message": "Order received. Awaiting confirmation."
    }
  ]
}
```

### 5. Loyalty Points

#### Get Loyalty Info
```bash
curl http://localhost:3000/api/loyalty?userId=user_id_123
```

Response:
```json
{
  "success": true,
  "loyalty": {
    "points": 2500,
    "tier": "Silver",
    "nextRewardAt": 5000,
    "totalSpent": 2500000,
    "orderCount": 45,
    "transactions": [...]
  }
}
```

#### Add Loyalty Points (Admin)
```bash
curl -X POST http://localhost:3000/api/loyalty \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: <ADMIN_SECRET>" \
  -d '{
    "userId": "user_id_123",
    "orderId": "ORD-1705276800000-a1b2c3d4",
    "pointsEarned": 945,
    "transactionType": "earn",
    "description": "Order #ORD-1705276800000-a1b2c3d4 placed"
  }'
```

### 6. Gift Cards

#### Create Gift Card
```bash
curl -X POST http://localhost:3000/api/gift-cards \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "senderName": "Ahmed",
    "senderPhone": "+923001234567",
    "recipientName": "Fatima",
    "recipientPhone": "+923009876543",
    "recipientEmail": "fatima@example.com",
    "message": "Enjoy your favorite coffee on me!"
  }'
```

Response:
```json
{
  "success": true,
  "giftCard": {
    "code": "BREW-A1B2-C3D4-E5F6",
    "amount": 5000,
    "expiresAt": "2025-01-15T00:00:00Z",
    "message": "Gift card created. Share code with recipient: BREW-A1B2-C3D4-E5F6"
  }
}
```

#### Check Gift Card
```bash
curl "http://localhost:3000/api/gift-cards?code=BREW-A1B2-C3D4-E5F6"
```

#### Redeem Gift Card
```bash
curl -X PUT http://localhost:3000/api/gift-cards \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BREW-A1B2-C3D4-E5F6",
    "userId": "user_id_456"
  }'
```

### 7. Subscriptions

#### Create Subscription
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_123",
    "subscriptionType": "daily",
    "items": [
      {
        "itemId": "golden-spanish-latte",
        "name": "Golden Spanish Latte",
        "quantity": 1,
        "customizations": {
          "milk": "Oat Milk"
        }
      }
    ],
    "deliveryAddress": {
      "address": "123 Main St",
      "city": "Karachi",
      "zipCode": "75500"
    },
    "paymentMethod": "stripe",
    "frequency": 1
  }'
```

#### Get Subscriptions
```bash
curl "http://localhost:3000/api/subscriptions?userId=user_id_123"
```

#### Update Subscription
```bash
curl -X PUT http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_id_123",
    "isActive": true,
    "items": [...]
  }'
```

#### Cancel Subscription
```bash
curl -X DELETE http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_id_123"
  }'
```

## Environment Variables

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
ADMIN_SECRET=<ADMIN_SECRET>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Human readable error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

Recommended rate limits:
- Authentication: 5 requests/minute per phone
- Cart operations: 30 requests/minute per user
- Orders: 10 requests/minute per user
- Loyalty: 20 requests/minute per user

## Testing

### Test Flow (Happy Path)
1. Send OTP: `+923001234567`
2. Verify OTP: `123456` (demo mode)
3. Add item to cart
4. Create order
5. Track order status
6. Create gift card
7. Redeem gift card
8. Create subscription

### Test Data
- **Demo OTP**: Any 6-digit code
- **Demo Phone**: Any valid Pakistan phone format
- **Demo User**: Auto-created on first OTP verification

