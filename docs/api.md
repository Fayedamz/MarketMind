# MarketMind API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Users

### Get Profile
```
GET /users/profile
Authorization: Bearer {token}
```

### Update Profile
```
PATCH /users/profile
Authorization: Bearer {token}
```

## Stocks

### Get Stock Data
```
GET /stocks/:symbol
```

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "change": 2.5,
  "changePercent": 1.69,
  "marketCap": 2500000000000,
  "pe": 28.5
}
```

### Search Stocks
```
GET /stocks/search?q=apple
```

## Portfolios

### Get User Portfolios
```
GET /portfolios
Authorization: Bearer {token}
```

### Create Portfolio
```
POST /portfolios
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "My Portfolio",
  "type": "PAPER"
}
```

## Academy

### Get All Lessons
```
GET /academy/lessons
```

### Get Lesson
```
GET /academy/lessons/:id
```

## AI

### Chat with AI Tutor
```
POST /ai/chat
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "What is a P/E ratio?",
  "context": "beginner"
}
```

### Explain Stock Movement
```
POST /ai/explain/:symbol
Authorization: Bearer {token}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

**401 Unauthorized**
```json
{
  "error": "Authentication required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```
