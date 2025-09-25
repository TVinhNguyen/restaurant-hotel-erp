#!/bin/bash

# API Testing Script for ROOMS & INVENTORY Module
# Base URL
BASE_URL="http://localhost:3000"

echo "🚀 Testing ROOMS & INVENTORY API Endpoints"
echo "==========================================="

# Test Health Check first
echo "📊 Testing Health Check..."
curl -X GET "$BASE_URL/health" -H "Content-Type: application/json"
echo -e "\n"

# Test Auth Login (to get JWT token)
echo "🔐 Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hotel.com",
    "password": "admin123"
  }')

# Extract token (assuming response format {"access_token": "..."})
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

# Test Room Types API
echo "🏠 Testing Room Types API..."
echo "GET /room-types"
curl -X GET "$BASE_URL/room-types" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo "POST /room-types - Create new room type"
ROOM_TYPE_RESPONSE=$(curl -s -X POST "$BASE_URL/room-types" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop-001",
    "name": "Deluxe Room Test",
    "description": "Test room type created via API",
    "maxAdults": 2,
    "maxChildren": 1,
    "basePrice": 150.00,
    "bedType": "Queen"
  }')
echo $ROOM_TYPE_RESPONSE
echo -e "\n"

# Test Rooms API
echo "🛏️ Testing Rooms API..."
echo "GET /rooms"
curl -X GET "$BASE_URL/rooms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo "POST /rooms - Create new room"
ROOM_RESPONSE=$(curl -s -X POST "$BASE_URL/rooms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop-001",
    "roomTypeId": "room-type-001", 
    "number": "101-TEST",
    "floor": "1",
    "viewType": "City View"
  }')
echo $ROOM_RESPONSE
echo -e "\n"

# Test Properties API (to get valid property IDs)
echo "🏢 Testing Properties API..."
echo "GET /properties"
curl -X GET "$BASE_URL/properties" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo "✅ API Testing Complete!"
echo "Check the responses above for any errors."