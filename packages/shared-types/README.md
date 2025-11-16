# @restaurant-hotel-erp/shared-types

Shared TypeScript types for the Restaurant-Hotel ERP system. This package provides type definitions that are used across frontend, backend, and admin applications to ensure type safety and prevent type drift.

## Installation

```bash
# From the monorepo root
cd packages/shared-types
npm install
npm run build
```

## Usage

### In Backend (NestJS)

```typescript
import { 
  CreateReservationDto, 
  ReservationStatus,
  UserRole 
} from '@restaurant-hotel-erp/shared-types';

@Controller('reservations')
export class ReservationsController {
  @Post()
  async create(@Body() dto: CreateReservationDto) {
    // TypeScript knows the exact shape of dto
  }
}
```

### In Frontend/Admin (Next.js)

```typescript
import { 
  Reservation, 
  ReservationStatus,
  ApiResponse 
} from '@restaurant-hotel-erp/shared-types';

async function fetchReservation(id: string): Promise<Reservation> {
  const response = await fetch(`/api/reservations/${id}`);
  const data: ApiResponse<Reservation> = await response.json();
  return data.data!;
}
```

## Package Structure

```
src/
├── index.ts          # Main export file
├── common.ts         # Common types (pagination, API responses, etc.)
├── auth.ts           # Authentication & authorization types
├── property.ts       # Property (hotel/restaurant) types
├── room.ts           # Room and room type types
├── guest.ts          # Guest types
├── reservation.ts    # Reservation and payment types
└── employee.ts       # Employee and HR types
```

## Type Categories

### Common Types
- `PaginationParams` - Query parameters for pagination
- `PaginatedResponse<T>` - Standardized paginated response
- `ApiResponse<T>` - Standardized API response wrapper
- `TimestampFields` - createdAt, updatedAt, deletedAt
- `Status` - Common status enum

### Auth Types
- `LoginDto`, `RegisterDto` - Authentication DTOs
- `AuthResponse` - Login/register response with tokens
- `UserProfile` - User information
- `UserRole` - Role enum (admin, manager, receptionist, etc.)
- `JwtPayload` - JWT token payload structure

### Property Types
- `Property` - Hotel/restaurant entity
- `PropertyImage` - Property images
- `CreatePropertyDto`, `UpdatePropertyDto` - Mutation DTOs
- `PropertyAmenity` - Amenities
- `AmenityCategory` - Amenity categories

### Room Types
- `RoomType` - Room type configuration
- `Room` - Individual room entity
- `BedType` - Bed types enum
- `RoomOperationalStatus` - available, occupied, out_of_order, etc.
- `RoomCleaningStatus` - clean, dirty, inspected, etc.

### Guest Types
- `Guest` - Guest entity
- `GuestPreferences` - Guest preferences and special requests
- `IdType` - ID document types
- `CreateGuestDto`, `UpdateGuestDto` - Mutation DTOs

### Reservation Types
- `Reservation` - Reservation entity
- `ReservationStatus` - pending, confirmed, checked_in, etc.
- `ReservationSource` - direct, booking_com, airbnb, etc.
- `Payment` - Payment entity
- `PaymentMethod` - cash, credit_card, bank_transfer, etc.
- `PaymentStatus` - pending, completed, refunded, etc.
- `CheckInDto`, `CheckOutDto`, `CancelReservationDto` - Action DTOs

### Employee Types
- `Employee` - Employee entity
- `Department` - Department enum
- `EmployeeStatus` - active, on_leave, terminated, etc.
- `WorkingShift` - Shift scheduling
- `Attendance` - Attendance tracking
- `Leave` - Leave management
- `LeaveType` - annual, sick, personal, etc.

## Development

### Build

```bash
npm run build
```

This compiles TypeScript files to the `dist/` directory with type definitions.

### Watch Mode

```bash
npm run watch
```

Automatically rebuilds on file changes during development.

### Clean

```bash
npm run clean
```

Removes the `dist/` directory.

## Integration

To use this package in other apps, add it as a dependency:

```json
{
  "dependencies": {
    "@restaurant-hotel-erp/shared-types": "file:../packages/shared-types"
  }
}
```

Or with workspace configuration (pnpm):

```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'frontend'
  - 'admin'
  - 'packages/*'
```

Then import in any project:

```typescript
import { Reservation } from '@restaurant-hotel-erp/shared-types';
```

## Benefits

1. **Type Safety**: Catch type errors at compile time
2. **Single Source of Truth**: One place to define all types
3. **No Type Drift**: Frontend and backend always in sync
4. **Better IDE Support**: Full autocomplete and IntelliSense
5. **Refactoring**: Change types once, update everywhere
6. **Documentation**: Types serve as inline documentation

## Maintenance

### Adding New Types

1. Create or update a file in `src/`
2. Export the types in that file
3. Add the export to `src/index.ts`
4. Run `npm run build`

### Breaking Changes

When making breaking changes:
1. Increment the major version in `package.json`
2. Update dependent packages
3. Document migration steps

## Alternative: Generate from OpenAPI

For a fully automated approach, consider generating types from Swagger/OpenAPI spec:

```bash
npm install --save-dev openapi-typescript
npx openapi-typescript http://localhost:4000/api/docs-json -o src/generated.ts
```

This ensures types are always in sync with backend API definitions.

## License

MIT
