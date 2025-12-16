# Gemini AI Chatbot Module

## Overview
This module implements a RAG (Retrieval-Augmented Generation) chatbot using Google Gemini AI that answers user questions based on **REAL DATA** from the hotel database.

## Features
- ✅ Fetches real-time data from PostgreSQL database (RoomTypes, Promotions, Restaurants)
- ✅ Uses Google Gemini 1.5 Flash model for intelligent responses
- ✅ TypeORM integration for database queries
- ✅ Swagger API documentation
- ✅ Error handling and logging
- ✅ Docker-ready configuration

## Architecture

### Files Structure
```
src/gemini/
├── dto/
│   └── chat.dto.ts          # Request/Response DTOs
├── gemini.controller.ts     # REST API endpoint
├── gemini.service.ts        # Business logic + AI integration
└── gemini.module.ts         # NestJS module configuration
```

### Data Flow
1. User sends message via `POST /api/gemini/chat`
2. `GeminiService.buildContext()` fetches fresh data from DB:
   - All RoomTypes (name, price, description, capacity)
   - Active Promotions (code, discount, valid dates)
   - Restaurants (name, hours, cuisine, location)
3. Context + User message → Gemini API
4. AI generates response based on real hotel data
5. Response returned to user

## Setup

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with Google account
3. Create a new API key
4. Copy the key

### 2. Configure Environment Variables
Add to your `.env` file:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Docker Setup
If using Docker, rebuild the container to install the new dependency:
```bash
# From backend directory
docker-compose down
docker-compose up --build
```

Or if using the root docker-compose:
```bash
# From project root
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build backend
```

### 4. Verify Installation
Check the logs to ensure Gemini module is loaded:
```bash
docker-compose logs backend
```

## API Usage

### Endpoint
```
POST /api/gemini/chat
Content-Type: application/json
```

### Request Body
```json
{
  "message": "What types of rooms do you have?"
}
```

### Response
```json
{
  "response": "We have the following room types available:\n- Deluxe Room: Spacious room with ocean view | Price: $150/night | Max Adults: 2 | Max Children: 1 | Bed: King\n- Suite: Luxury suite with separate living area | Price: $300/night | Max Adults: 4 | Max Children: 2 | Bed: King\n\nWould you like more information about any specific room type?"
}
```

### Example Questions
- "What types of rooms are available?"
- "Do you have any active promotions?"
- "What restaurants are in the hotel?"
- "Tell me about your deluxe rooms"
- "What are the opening hours of your restaurant?"

## Testing with Swagger
1. Start the backend server
2. Navigate to: `http://localhost:4000/api`
3. Find the "Gemini AI Chatbot" section
4. Click "Try it out" on `/gemini/chat`
5. Enter your message and execute

## Testing with cURL
```bash
curl -X POST http://localhost:4000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What rooms do you have?"}'
```

## Implementation Details

### Database Queries
The service uses TypeORM repositories to fetch:
- **RoomTypes**: Selected fields to minimize token usage
- **Promotions**: Only active promotions where `validTo > now`
- **Restaurants**: All restaurant information

### AI Constraints
The prompt instructs Gemini to:
- Answer **strictly** based on provided context
- Not make up information
- Direct users to contact support if info is missing
- Be friendly and professional

### Error Handling
- Missing API key → Warning logged + 500 error
- Database errors → Logged + InternalServerErrorException
- Gemini API errors → Logged + InternalServerErrorException

## Troubleshooting

### Error: "Gemini API is not configured"
**Solution**: Add `GEMINI_API_KEY` to your `.env` file

### Error: "Cannot find module '@google/generative-ai'"
**Solution**: Rebuild Docker container:
```bash
docker-compose down
docker-compose up --build
```

### Chatbot returns generic responses
**Solution**: Check if database has data:
```sql
SELECT COUNT(*) FROM inventory.room_types;
SELECT COUNT(*) FROM reservation.promotions WHERE active = true;
SELECT COUNT(*) FROM restaurant.restaurants;
```

## Future Enhancements
- [ ] Add conversation history/memory
- [ ] Support for image uploads (room photos)
- [ ] Multi-language support
- [ ] User feedback system
- [ ] Rate limiting per user
- [ ] Caching frequent questions

## License
Part of the Restaurant Hotel ERP system.
