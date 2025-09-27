# Inventory & Rooms Dashboard — Implementation Plan

> Stack assumption: **NestJS + TypeORM (PostgreSQL)** for APIs, **Next.js (App Router) + React + Tailwind** for admin UI. Auth via JWT or session; RBAC via roles/permissions. i18n: `vi` default.

## 0) Scope & Entities

Covers these entities and relations:

* `inventory.room_types` ↔ `inventory.photos` (1–N)
* `inventory.room_types` ↔ `inventory.room_type_amenities` ↔ `inventory.amenities` (N–N)
* `inventory.rooms` ↔ `inventory.room_status_history` (1–N)
* References: `core.properties`, `core.employees`, `reservation.rate_plans`, `reservation.reservations`

## 1) Personas & Roles

* **Admin**: full access, global settings.
* **Front Desk**: manage rooms, assign reservations, change operational/housekeeping status.
* **Housekeeping**: see HK board, update `housekeepingStatus`, notes.
* **Maintenance**: mark `operationalStatus` (e.g., out_of_service), attach notes.
* **Revenue Manager**: manage room type attributes, base price, rate plans.

### RBAC Matrix (summary)

| Module         | Admin | Front Desk         | Housekeeping | Maint.    | Revenue |
| -------------- | ----- | ------------------ | ------------ | --------- | ------- |
| Room Grid      | CRUD  | R/U                | R/U (HK)     | R/U (Ops) | R       |
| Room Types     | CRUD  | R                  | R            | R         | CRUD    |
| Amenities      | CRUD  | R                  | –            | –         | R       |
| Photos         | CRUD  | R                  | –            | –         | CRUD    |
| HK Board       | R     | R                  | U            | R         | –       |
| Status History | R     | R                  | R            | R         | R       |
| Reservations*  | R     | CRUD (assign room) | –            | –         | R       |
| Rate Plans*    | R     | –                  | –            | –         | CRUD    |

* depends on reservation module availability.

## 2) Information Architecture (Routes)

```
/admin
  ├─ /dashboard                      # KPIs snapshot (occupancy, OOS, dirty rooms, etc.)
  ├─ /rooms                           # Room Grid + filters + bulk actions
  │    └─ /[roomId]                   # Room detail + timeline
  ├─ /housekeeping                    # HK Kanban/board
  ├─ /room-types                      # List & manage Room Types
  │    └─ /create                     # New Room Type wizard
  │    └─ /[roomTypeId]               # Details: info, photos, amenities, rate plans
  ├─ /amenities                       # Amenity catalog
  ├─ /photos                          # (optional) Photo gallery by Room Type
  ├─ /reports                         # Inventory & operations reports
  └─ /settings                        # Property switcher, enums, roles
```

## 3) Dashboard Widgets (Home)

* **Occupancy today** (requires reservations): % and counts by status
* **Rooms out of service**: count & list top reasons
* **Housekeeping status**: Clean / Dirty / Inspected counts
* **Turnover forecast (next 7 days)**: expected check-ins/outs (if reservations available)
* **Alerts**: rooms without roomType, missing photos, no amenities, rate plan gaps

## 4) Rooms Module

### 4.1 Room Grid

* Columns: Room #, Floor, View, Room Type, Operational, HK Status, Notes, Property
* Filters: Property, Room Type, Floor, Operational (available/out_of_service), HK (clean/dirty/inspected)
* Bulk actions: Set HK status, Set Operational status, Assign to reservation*, Add note
* Inline edit: HK status (select), Operational status (select), Housekeeper notes (textarea modal)

### 4.2 Room Detail (/rooms/[id])

* **Header**: `Property • Room # • Room Type`
* **Tabs**:

  1. **Overview**: metadata (floor, viewType, statuses), quick actions
  2. **Status Timeline** (from `room_status_history`): filters by type (operational/housekeeping)
  3. **Current/Upcoming Stays***: active reservation, ETA/ETD, guest name
  4. **Notes**: long notes

### 4.3 Status Updates (Write paths)

* `PATCH /rooms/:id` to change `operationalStatus`, `housekeepingStatus`, `housekeeperNotes`
* `POST /room-status-history` on each change with: `roomId`, `statusType`, `status`, `changedBy`, `notes`
* If status flips to `out_of_service`, prompt memo: reason, expected return (store in `notes`)

## 5) Housekeeping Board

* Board (Kanban) or 2-pane list grouped by HK status.
* Cards show: Room #, Room Type, last change time, notes, assignee (employee)
* Drag & drop between **Dirty → Clean → Inspected** (writes both `rooms` and history)
* Quick filters: by floor, property, assignee
* Mobile-friendly screen for on-floor updates

## 6) Room Types Module

### 6.1 List

* Columns: Name, Property, Base Price, Max Pax (adults/children), Bed Type, Photos (#), Amenities (#)
* Filters: Property, price range, bed type, has photos?, has amenities?

### 6.2 Create/Edit Wizard

**Step 1: Basics**

* Property, Name, Description, Max Adults/Children, Bed Type, Base Price

**Step 2: Photos**

* Uploader (multi), reorder; API: `POST /room-types/:id/photos`

**Step 3: Amenities**

* Dual-list or multiselect grouped by category (`room`/`facility`)
* API: `PUT /room-types/:id/amenities` with `[{amenityId}]`

**Step 4: Rooms (optional)**

* Attach existing rooms to this type or create in bulk (e.g., floors 3–5, numbers 301–325)

**Step 5: Rate Plans***

* Link to rate-plan setup if module present

### 6.3 Inline Metrics

* Occupancy by room type (today/7d)
* Photo coverage (≥3 photos recommended)
* Amenity coverage (min baseline)

## 7) Amenities Catalog

* List + CRUD
* Fields: Name, Category (`room`/`facility`)
* Deduplication check on create (unique per property optional); Bulk import CSV

## 8) Photos

* Generally managed under Room Type detail
* Store `url` + optional `caption`
* Image policy: min resolution; order/index for display

## 9) Status History & Audit

* `room_status_history` rendered as timeline with badges: (Operational vs HK)
* Filters: date range, employee, statusTypes, specific status
* Export CSV/PDF

## 10) KPIs & Reports (Inventory)

* **Rooms summary** by property and type
* **Out-of-service duration** by room (mean time to recover)
* **Housekeeping turnaround time** (Dirty→Clean→Inspected)
* **Photo/Amenity completeness** per room type
* (If reservations present) **Occupancy**, **ADR**, **RevPAR** by room type

## 11) API Contract (sample)

### 11.1 Rooms

```http
GET    /api/rooms?propertyId=&roomTypeId=&floor=&operational=&hk=
GET    /api/rooms/:id
PATCH  /api/rooms/:id
Body: { operationalStatus?: 'available'|'out_of_service', housekeepingStatus?: 'clean'|'dirty'|'inspected', housekeeperNotes?: string }
```

### 11.2 Room Status History

```http
GET   /api/room-status-history?roomId=&type=&from=&to=
POST  /api/room-status-history
Body: { roomId: string, statusType: 'operational'|'housekeeping', status: string, notes?: string }
```

### 11.3 Room Types

```http
GET    /api/room-types?propertyId=&q=&hasPhotos=&hasAmenities=
GET    /api/room-types/:id
POST   /api/room-types
PATCH  /api/room-types/:id
```

### 11.4 Photos

```http
POST   /api/room-types/:id/photos             # multipart/form-data or JSON with URL
DELETE /api/photos/:photoId
PATCH  /api/photos/:photoId                   # update caption
```

### 11.5 Amenities

```http
GET    /api/amenities?category=&q=
POST   /api/amenities
PATCH  /api/amenities/:id
DELETE /api/amenities/:id
PUT    /api/room-types/:id/amenities          # replace all mappings
```

## 12) Validation & Business Rules

* **Enum enforcement**: Use DB enum or CHECK for: `Amenity.category`, `Room.operationalStatus`, `Room.housekeepingStatus`, `RoomStatusHistory.statusType`.
* **Unique**: `(propertyId, number)` for rooms is unique.
* **History write**: Every status change must create a history row.
* **Cascade**: Photos and join rows cascade delete with RoomType; History may cascade with Room or be retained per policy.

## 13) UI Components

* **DataTable** with server-side sorting/filter/pagination
* **Status Pills**: available/out_of_service; clean/dirty/inspected
* **Kanban** for Housekeeping
* **Photo Uploader** with reorder (drag)
* **Amenity Multiselect** with category group
* **Timeline** component for status history
* **Bulk Create Rooms** modal
* **Property Switcher** (top navbar)

## 14) State Management

* React Query for data fetching & caching
* Optimistic updates for status flips
* Toasts on success/error; centralized error boundary

## 15) Migrations (DB)

* Create enums; add indexes (`rooms.room_type_id`, `rooms.property_id`, `photos.room_type_id`, `room_status_history.room_id, changed_at`)
* Add `ON DELETE` rules:

  * `photos.room_type_id` → CASCADE
  * `room_type_amenities.*` → CASCADE
  * `room_status_history.changed_by` → SET NULL

## 16) Seeders

* Amenities: base sets (room: Wi-Fi, AC, Desk; facility: Pool, Gym, Parking)
* Sample properties, room types, rooms, photos
* A few status-history records per room for timeline demo

## 17) Testing Plan

* **Unit**: DTO validation, service logic for status change → history write
* **Integration**: Room Type create → photos attach → amenities mapping
* **E2E**: HK board drag & drop changes both room and history
* **Performance**: Room Grid with 10k rooms (index verification)

## 18) Performance & Caching

* Pagination always; avoid N+1 through `select` + `relations` wisely
* Cache amenities and room types per property (short TTL)
* Precompute dashboard KPIs with nightly/materialized views if needed

## 19) Observability & Audit

* Request logging (user, route, duration)
* Structured log fields for status changes (roomId, old→new)
* Admin audit screen querying `room_status_history`

## 20) Security

* Auth guard on all routes; role guard per module
* Input validation via `class-validator`
* Object-level permissions: restrict cross-property access unless Admin

## 21) Edge Cases & UX

* Prevent changing HK status to `inspected` if not `clean` first (optional rule)
* Warn before setting `out_of_service` when reservation is active (if reservation module present)
* Empty states: no photos/amenities → show CTA

## 22) Delivery Checklist

* [ ] DB enums & indexes migrated
* [ ] API endpoints implemented & documented (OpenAPI)
* [ ] Room Grid with bulk actions
* [ ] HK Board with DnD & mobile view
* [ ] Room Type wizard (basics → photos → amenities → rooms)
* [ ] Amenities CRUD + bulk import
* [ ] Status timeline on Room detail
* [ ] Dashboard KPIs
* [ ] RBAC policies & tests
* [ ] Seed data for demo

## 23) Example DTOs (NestJS)

```ts
export class UpdateRoomDto {
  @IsOptional() @IsEnum(['available','out_of_service'])
  operationalStatus?: 'available'|'out_of_service';

  @IsOptional() @IsEnum(['clean','dirty','inspected'])
  housekeepingStatus?: 'clean'|'dirty'|'inspected';

  @IsOptional() @IsString() @MaxLength(2000)
  housekeeperNotes?: string;
}

export class CreateHistoryDto {
  @IsUUID() roomId: string;
  @IsEnum(['operational','housekeeping']) statusType: 'operational'|'housekeeping';
  @IsString() status: string;
  @IsOptional() @IsString() notes?: string;
}
```

## 24) Example React Screens (outline)

```tsx
// /admin/rooms/page.tsx
export default function RoomsPage(){
  return (
    <div className="space-y-4">
      <Header title="Rooms" actions={<BulkActions/>}>
        <Filters/>
      </Header>
      <RoomTable/>
    </div>
  )
}

// /admin/housekeeping/page.tsx
export default function Housekeeping(){
  return <HKBoard/> // columns: Dirty, Clean, Inspected
}
```

## 25) Future Roadmap

* Assignment of rooms to employees/shifts
* Maintenance tasks & work orders linked to out_of_service
* SLA tracking for turnaround
* Image CDN & transformations
* Offline-first mobile for housekeeping
