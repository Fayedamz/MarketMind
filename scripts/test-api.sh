#!/bin/bash

# API Test Script for MarketMind

API_URL="${API_URL:-http://localhost:3001}"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Testing MarketMind API at $API_URL"
echo ""

# Test health endpoint
echo "Testing health endpoint..."
HEALTH=$(curl -s "$API_URL/health")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✓${NC} Health check passed"
else
    echo -e "${RED}✗${NC} Health check failed"
    exit 1
fi

# Test user registration
echo ""
echo "Testing user registration..."
TIMESTAMP=$(date +%s)
REGISTER=$(curl -s -X POST "$API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test${TIMESTAMP}@example.com\",\"password\":\"Test123456\",\"name\":\"Test User\"}")

if echo "$REGISTER" | grep -q '"token"'; then
    echo -e "${GREEN}✓${NC} Registration passed"
    TOKEN=$(echo "$REGISTER" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗${NC} Registration failed"
    echo "$REGISTER"
    exit 1
fi

# Test protected endpoint
echo ""
echo "Testing protected endpoint..."
ME=$(curl -s "$API_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN")

if echo "$ME" | grep -q '"email"'; then
    echo -e "${GREEN}✓${NC} Protected endpoint passed"
else
    echo -e "${RED}✗${NC} Protected endpoint failed"
    exit 1
fi

# Test stock search
echo ""
echo "Testing stock search..."
SEARCH=$(curl -s "$API_URL/api/stocks/search?q=AAPL")

if echo "$SEARCH" | grep -q 'results'; then
    echo -e "${GREEN}✓${NC} Stock search passed"
else
    echo -e "${RED}✗${NC} Stock search failed"
fi

# Test stock quote
echo ""
echo "Testing stock quote..."
QUOTE=$(curl -s "$API_URL/api/stocks/AAPL/quote")

if echo "$QUOTE" | grep -q 'price'; then
    echo -e "${GREEN}✓${NC} Stock quote passed"
else
    echo -e "${RED}✗${NC} Stock quote failed"
fi

# Test lessons endpoint
echo ""
echo "Testing lessons endpoint..."
LESSONS=$(curl -s "$API_URL/api/academy/lessons")

if echo "$LESSONS" | grep -q 'lessons'; then
    echo -e "${GREEN}✓${NC} Lessons endpoint passed"
else
    echo -e "${RED}✗${NC} Lessons endpoint failed"
fi

echo ""
echo -e "${GREEN}✅ All API tests passed!${NC}"
