# Room Types API (Markdown)

**Base URL**
```
http://localhost:3000/api
```
**Authentication**: All protected endpoints require `Authorization: Bearer <token>`

---

## List Room Types
### GET `/room-types`
**Query Parameters**
- `property_id` (string, required)
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "name": "Deluxe Room",
      "description": "Spacious room with city view",
      "max_adults": 2,
      "max_children": 1,
      "base_price": 150.00,
      "bed_type": "Queen",
      "amenities": [
        { "id": "uuid", "name": "WiFi", "category": "room" }
      ],
      "photos": [
        { "id": "uuid", "url": "https://example.com/room1.jpg", "caption": "Room view" }
      ],
      "total_rooms": 25,
      "available_rooms": 18
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

## Create Room Type
### POST `/room-types`
**Request Body**
```json
{
  "property_id": "uuid",
  "name": "Deluxe Room",
  "description": "Spacious room with city view",
  "max_adults": 2,
  "max_children": 1,
  "base_price": 150.00,
  "bed_type": "Queen"
}
```
**Response**
```json
{
  "id": "uuid",
  "property_id": "uuid",
  "name": "Deluxe Room",
  "description": "Spacious room with city view",
  "max_adults": 2,
  "max_children": 1,
  "base_price": 150.00,
  "bed_type": "Queen",
  "created_at": "2025-09-12T00:00:00Z"
}
```

---

## Get Room Type by ID
### GET `/room-types/:id`
**Response**
```json
{
  "id": "uuid",
  "property_id": "uuid",
  "name": "Deluxe Room",
  "description": "Spacious room with city view",
  "max_adults": 2,
  "max_children": 1,
  "base_price": 150.00,
  "bed_type": "Queen",
  "amenities": [
    { "id": "uuid", "name": "WiFi", "category": "room" },
    { "id": "uuid", "name": "Air Conditioning", "category": "room" }
  ],
  "photos": [
    { "id": "uuid", "url": "https://example.com/room1.jpg", "caption": "Room overview" },
    { "id": "uuid", "url": "https://example.com/room1-bathroom.jpg", "caption": "Bathroom view" }
  ],
  "rooms": [
    {
      "id": "uuid",
      "number": "101",
      "floor": "1",
      "operational_status": "available",
      "housekeeping_status": "clean"
    }
  ],
  "created_at": "2025-09-12T00:00:00Z",
  "updated_at": "2025-09-12T00:00:00Z"
}
```

---

## Update Room Type
### PUT `/room-types/:id`
**Request Body**
```json
{
  "name": "Premium Deluxe Room",
  "description": "Updated description with premium amenities",
  "base_price": 180.00,
  "max_adults": 3
}
```
**Response**
```json
{
  "id": "uuid",
  "property_id": "uuid",
  "name": "Premium Deluxe Room",
  "description": "Updated description with premium amenities",
  "max_adults": 3,
  "max_children": 1,
  "base_price": 180.00,
  "bed_type": "Queen",
  "updated_at": "2025-09-12T00:00:00Z"
}
```

---

## Delete Room Type
### DELETE `/room-types/:id`
**Response**
```json
{
  "message": "Room type deleted successfully",
  "deleted_at": "2025-09-12T00:00:00Z"
}
```

---

## Add Amenity to Room Type
### POST `/room-types/:id/amenities`
**Request Body**
```json
{ "amenity_id": "uuid" }
```
**Response**
```json
{
  "room_type_id": "uuid",
  "amenity_id": "uuid",
  "amenity": { "id": "uuid", "name": "WiFi", "category": "room" },
  "created_at": "2025-09-12T00:00:00Z"
}
```

---

## Remove Amenity from Room Type
### DELETE `/room-types/:room_type_id/amenities/:amenity_id`
**Response**
```json
{
  "message": "Amenity removed from room type successfully",
  "deleted_at": "2025-09-12T00:00:00Z"
}
```

---

## Bulk Add Amenities to Room Type
### POST `/room-types/:id/amenities/bulk`
**Request Body**
```json
{ "amenity_ids": ["uuid1", "uuid2", "uuid3"] }
```
**Response**
```json
{
  "room_type_id": "uuid",
  "added_amenities": [
    { "amenity_id": "uuid1", "name": "WiFi" },
    { "amenity_id": "uuid2", "name": "Air Conditioning" }
  ],
  "created_count": 2
}
```

---

## List Photos of a Room Type
### GET `/room-types/:id/photos`
**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "room_type_id": "uuid",
      "url": "https://example.com/room1.jpg",
      "caption": "Room overview",
      "display_order": 1,
      "created_at": "2025-09-12T00:00:00Z"
    },
    {
      "id": "uuid",
      "room_type_id": "uuid",
      "url": "https://example.com/room1-bathroom.jpg",
      "caption": "Bathroom view",
      "display_order": 2,
      "created_at": "2025-09-12T00:00:00Z"
    }
  ]
}
```

---

## Upload Photo for a Room Type
### POST `/room-types/:id/photos`
**Request (multipart/form-data)**
```
file: <image file>
caption: "Room overview"
display_order: 1
```
**Response**
```json
{
  "id": "uuid",
  "room_type_id": "uuid",
  "url": "https://example.com/uploads/room1.jpg",
  "caption": "Room overview",
  "display_order": 1,
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "created_at": "2025-09-12T00:00:00Z"
}
```