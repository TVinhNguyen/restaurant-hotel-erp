# Swagger API Documentation - Completion Summary

## ✅ Completed Controllers (10 Controllers)

All controllers below have been enhanced with comprehensive Swagger documentation including:
- `@ApiTags` - Grouping endpoints by resource
- `@ApiOperation` - Clear operation descriptions
- `@ApiResponse` - Response status codes and descriptions
- `@ApiBearerAuth` - JWT authentication requirement
- `@ApiQuery` - Query parameter documentation
- `@ApiParam` - Path parameter documentation
- `@ApiBody` - Request body schemas

---

### 1. **Rate Plans** (`/api/rate-plans`)

**Tag:** Rate Plans  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all rate plans with pagination and filters
  - Query: page, limit, propertyId, roomTypeId
- `GET /:id` - Get rate plan by ID
- `POST /` - Create a new rate plan
- `PUT /:id` - Update a rate plan
- `DELETE /:id` - Delete a rate plan
- `POST /:id/daily-rates` - Set daily rate for specific date
- `GET /:id/daily-rates` - Get daily rates for rate plan
  - Query: startDate, endDate

---

### 2. **Daily Rates** (`/api/daily-rates`)

**Tag:** Daily Rates  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all daily rates with filters
  - Query: page, limit, ratePlanId, startDate, endDate
- `GET /:id` - Get daily rate by ID
- `POST /` - Create a new daily rate
- `PUT /:id` - Update a daily rate
- `DELETE /:id` - Delete a daily rate
- `GET /rate-plan/:ratePlanId` - Get daily rates by rate plan
  - Query: startDate, endDate

---

### 3. **Reservations** (`/api/reservations`)

**Tag:** Reservations  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all reservations with filters
  - Query: page, limit, propertyId, status, checkInFrom, checkInTo, guestId
  - Status enum: pending, confirmed, checked_in, checked_out, cancelled, no_show
- `GET /:id` - Get reservation by ID
- `POST /` - Create a new reservation
- `PUT /:id` - Update a reservation
- `POST /:id/checkin` - Check-in a reservation
  - Body: { roomId?: string }
- `POST /:id/checkout` - Check-out a reservation
- `PUT /:id/room` - Assign room to reservation
  - Body: { roomId: string }
- `PUT /:id/cancel` - Cancel a reservation
- `DELETE /:id` - Delete a reservation

---

### 4. **Payments** (`/api/payments`)

**Tag:** Payments  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all payments with filters
  - Query: page, limit, reservationId, status, method
  - Status enum: authorized, captured, refunded, voided
  - Method enum: cash, card, bank, e_wallet, ota_virtual
- `GET /:id` - Get payment by ID
- `POST /` - Create a new payment
- `PUT /:id` - Update a payment
- `POST /:id/process` - Process a payment
- `POST /:id/refund` - Refund a payment
  - Body: { amount?: number }
- `DELETE /:id` - Delete a payment

---

### 5. **Services** (`/api/services`)

**Tag:** Services  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all services
  - Query: page, limit, category
- `GET /:id` - Get service by ID
- `POST /` - Create a new service
- `PUT /:id` - Update a service
- `DELETE /:id` - Delete a service

---

### 6. **Property Services** (`/api/property-services`)

**Tag:** Property Services  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all property services
  - Query: page, limit, propertyId, isActive
- `GET /:id` - Get property service by ID
- `POST /` - Create a new property service
- `PUT /:id` - Update a property service
- `DELETE /:id` - Delete a property service

---

### 7. **Reservation Services** (`/api/reservation-services`)

**Tag:** Reservation Services  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all reservation services
  - Query: page, limit, reservationId, propertyServiceId
- `GET /:id` - Get reservation service by ID
- `POST /` - Add service to reservation
- `PUT /:id` - Update reservation service
- `DELETE /:id` - Remove service from reservation
- `GET /reservation/:reservationId` - Get all services for a reservation
- `GET /reservation/:reservationId/total` - Get total service amount
- `GET /statistics/services` - Get service usage statistics
  - Query: propertyId, startDate, endDate

---

### 8. **Promotions** (`/api/promotions`)

**Tag:** Promotions  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all promotions
  - Query: page, limit, propertyId, active (boolean)
- `GET /:id` - Get promotion by ID
- `GET /code/:code` - Get promotion by code
- `POST /` - Create a new promotion
- `PUT /:id` - Update a promotion
- `DELETE /:id` - Delete a promotion
- `POST /validate` - Validate a promotion code
  - Body: { code: string, propertyId: string }

---

### 9. **Tax Rules** (`/api/tax-rules`)

**Tag:** Tax Rules  
**Authentication:** Bearer JWT Required

**Endpoints:**
- `GET /` - Get all tax rules
  - Query: page, limit, propertyId, type (VAT, service)
- `GET /:id` - Get tax rule by ID
- `POST /` - Create a new tax rule
- `PUT /:id` - Update a tax rule
- `DELETE /:id` - Delete a tax rule
- `GET /property/:propertyId` - Get all tax rules for a property
- `POST /calculate` - Calculate tax for an amount
  - Body: { amount: number, propertyId: string, taxType?: 'VAT' | 'service' }
  - Response: { amount, taxAmount, totalAmount }

---

### 10. **Restaurants** (`/api/restaurants`)

**Tag:** Restaurants  
**Authentication:** Bearer JWT Required

**Restaurant Management Endpoints:**
- `GET /` - Get all restaurants with filters
  - Query: page, limit, propertyId, cuisineType
- `GET /:id` - Get restaurant by ID
- `POST /` - Create a new restaurant
- `PUT /:id` - Update a restaurant
- `DELETE /:id` - Delete a restaurant

**Restaurant Area Management Endpoints:**
- `POST /areas` - Create a new restaurant area
- `GET /:restaurantId/areas` - Get all areas for a restaurant
- `GET /areas/:id` - Get restaurant area by ID
- `PUT /areas/:id` - Update a restaurant area
- `DELETE /areas/:id` - Delete a restaurant area

**Table Management Endpoints:**
- `POST /tables` - Create a new table
- `GET /tables` - Get all tables with filters
  - Query: page, limit, restaurantId, status, areaId
  - Status enum: available, occupied, reserved
- `GET /tables/available` - Check table availability
  - Query: restaurantId, date (YYYY-MM-DD), time (HH:mm), partySize
- `GET /tables/:id` - Get table by ID
- `PUT /tables/:id` - Update a table
- `DELETE /tables/:id` - Delete a table

**Table Booking Management Endpoints:**
- `POST /bookings` - Create a new table booking
- `GET /bookings` - Get all bookings with filters
  - Query: page, limit, restaurantId, status, date
  - Status enum: pending, confirmed, seated, completed, no_show, cancelled
- `GET /bookings/:id` - Get booking by ID
- `PUT /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Cancel a booking

**Booking Workflow Endpoints:**
- `POST /bookings/:id/confirm` - Confirm a booking
- `POST /bookings/:id/cancel` - Cancel a confirmed booking
- `POST /bookings/:id/seat` - Seat guests for a booking
  - Body: { tableId: string (uuid) }
- `POST /bookings/:id/complete` - Complete a booking

---

## 📊 Summary Statistics

- **Total Controllers Documented:** 10
- **Total Endpoints:** 84+
- **Authentication:** All endpoints require JWT Bearer token
- **API Tags:** 10 distinct resource groups
- **Documentation Features:**
  - ✅ Request/Response schemas
  - ✅ Query parameters with types
  - ✅ Path parameters with descriptions
  - ✅ Request body schemas
  - ✅ Response status codes
  - ✅ Enum values for dropdown fields
  - ✅ Authentication requirements

---

## 🚀 Accessing the Documentation

Once the backend is running, access the interactive Swagger UI at:

```
http://localhost:4000/api/docs
```

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing
- Try-it-out functionality

---

## 🔐 Authentication

All endpoints require JWT Bearer authentication. To test in Swagger UI:

1. Click the **"Authorize"** button (lock icon) at the top
2. Enter: `Bearer <your_jwt_token>`
3. Click "Authorize"
4. All subsequent requests will include the token

---

## 📝 Notes

- All DTOs (CreateDto, UpdateDto) are automatically documented via class-validator decorators
- Pagination follows consistent pattern: `?page=1&limit=10`
- All IDs are UUIDs
- Date formats follow ISO 8601: `YYYY-MM-DD`
- Enum values are strictly validated
- Soft deletes are used where applicable

---

**Last Updated:** January 22, 2025  
**Status:** ✅ Complete - All 10 controllers fully documented
