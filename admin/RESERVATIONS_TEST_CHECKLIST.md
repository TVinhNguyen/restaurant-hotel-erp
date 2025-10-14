# ✅ Reservations Module - Test Checklist

## 🎯 Mục đích
Checklist này giúp verify rằng tất cả các tính năng của module Reservations hoạt động đúng sau khi fix navbar.

---

## 📋 NAVIGATION & LAYOUT

### Navbar/Header Display
- [ ] Logo hiển thị đúng vị trí
- [ ] Sidebar menu hiển thị
- [ ] User profile menu accessible
- [ ] Theme toggle (light/dark) hoạt động
- [ ] Property selector hiển thị
- [ ] Logout button hoạt động
- [ ] Navbar không bị che bởi content
- [ ] Navbar có proper z-index

### Navigation Menu
- [ ] Click vào "Reservations" trong menu → navigate đúng
- [ ] Click vào "Inventory Management" → chuyển module
- [ ] Click vào "HR Management" → chuyển module
- [ ] Active menu item được highlight
- [ ] Breadcrumb cập nhật theo page
- [ ] Back button hoạt động

### Responsive Design
- [ ] Desktop (> 1200px): Navbar full width
- [ ] Tablet (768-1200px): Sidebar collapse
- [ ] Mobile (< 768px): Hamburger menu
- [ ] Không có horizontal scroll
- [ ] Content không bị overflow

---

## 📄 PAGES FUNCTIONALITY

### 1. Main Reservations List (`/reservations`)
#### Display
- [ ] Table hiển thị danh sách reservations
- [ ] Statistics cards hiển thị đúng (6 cards)
- [ ] Search box hoạt động
- [ ] Filters hoạt động (status, payment, channel, dates)
- [ ] Pagination hoạt động
- [ ] Sorting theo columns

#### Actions
- [ ] "New Reservation" button → navigate to create
- [ ] "View" button → navigate to detail
- [ ] "Edit" button → navigate to edit
- [ ] "Check-in" button hiển thị khi status = confirmed
- [ ] "Check-out" button hiển thị khi status = checked_in
- [ ] "Cancel" button hiển thị khi status = pending/confirmed
- [ ] Confirmation codes clickable

#### Data
- [ ] Guest info hiển thị đúng
- [ ] Room type hiển thị
- [ ] Dates format đúng (DD/MM/YYYY)
- [ ] Status badges đúng màu
- [ ] Payment status đúng màu
- [ ] Amount format đúng (2 decimals)

---

### 2. Create Reservation (`/reservations/create`)
#### Step 1 - Guest Info
- [ ] Guest dropdown autocomplete hoạt động
- [ ] Channel selection hoạt động
- [ ] "Next" button navigate to step 2

#### Step 2 - Booking Details
- [ ] Date range picker hoạt động
- [ ] Adults/Children number inputs
- [ ] Room type dropdown populated
- [ ] Rate plan filters by room type
- [ ] Price calculation hiển thị
- [ ] "Previous" button quay về step 1
- [ ] "Next" button navigate to step 3

#### Step 3 - Contact & Notes
- [ ] Contact name input
- [ ] Email validation hoạt động
- [ ] Phone input
- [ ] Notes textarea
- [ ] Currency selection
- [ ] "Previous" button quay về step 2
- [ ] "Create Reservation" button submit form
- [ ] Loading state hiển thị
- [ ] Success → redirect to detail page
- [ ] Error → hiển thị error message

#### Validation
- [ ] Required fields có asterisk (*)
- [ ] Email format validation
- [ ] Check-out > check-in validation
- [ ] Min stay validation (if applicable)
- [ ] Max capacity validation

---

### 3. View Reservation (`/reservations/[id]`)
#### Header Actions
- [ ] "Back" button → list page
- [ ] "Edit" button → edit page
- [ ] "Print" button → print view
- [ ] Status tags hiển thị đúng màu
- [ ] Payment status tag đúng màu

#### Status Actions Card
- [ ] "Check-in" button (nếu confirmed)
- [ ] "Check-out" button (nếu checked_in)
- [ ] "Assign Room" button (nếu chưa assign)
- [ ] "Cancel" button (nếu pending/confirmed)
- [ ] "Add Payment" button (nếu chưa paid)

#### Information Sections
- [ ] Guest Information complete
- [ ] Booking Information complete
- [ ] Financial Information accurate
- [ ] Payment History table (nếu có)
- [ ] Services table (nếu có)
- [ ] System Information (created/updated dates)

#### Modals
- [ ] Assign Room modal:
  - [ ] List available rooms
  - [ ] Submit assigns room
  - [ ] Success message
  - [ ] Page refresh với assigned room
- [ ] Add Payment modal:
  - [ ] Amount input với currency
  - [ ] Balance display
  - [ ] Payment method selection
  - [ ] Notes textarea
  - [ ] Submit adds payment
  - [ ] Success message
  - [ ] Payment status updates

#### Calculations
- [ ] Nights calculation đúng
- [ ] Balance = Total - Paid
- [ ] Tax amounts đúng
- [ ] Service amounts đúng
- [ ] Totals match

---

### 4. Edit Reservation (`/reservations/[id]/edit`)
#### Form Pre-population
- [ ] All fields populated với current data
- [ ] Guest pre-selected
- [ ] Dates pre-filled
- [ ] Room type pre-selected
- [ ] Rate plan pre-selected
- [ ] Contact info pre-filled

#### Editing
- [ ] Change guest
- [ ] Change dates
- [ ] Change room type → rate plans filter
- [ ] Change rate plan
- [ ] Change guests count
- [ ] Change contact info
- [ ] Change notes

#### Validation
- [ ] Same validations as create
- [ ] Check-out after check-in
- [ ] Email format
- [ ] Required fields

#### Actions
- [ ] "Cancel" button → back to detail
- [ ] "Save Changes" button submit
- [ ] Loading state
- [ ] Success → redirect to detail
- [ ] Error → show message

---

### 5. Payments Management (`/reservations/payments`)
#### Display
- [ ] Statistics cards (4 cards)
- [ ] Table với payment history
- [ ] Search hoạt động
- [ ] Date range filter
- [ ] Status filter
- [ ] Method filter
- [ ] Pagination

#### Data
- [ ] Payment dates format đúng
- [ ] Reservation codes clickable → detail
- [ ] Guest names hiển thị
- [ ] Amounts với currency
- [ ] Method tags đúng màu
- [ ] Status tags đúng màu
- [ ] Transaction IDs

#### Actions
- [ ] "View Reservation" → reservation detail
- [ ] "Refund" button (nếu captured)
- [ ] Refund modal:
  - [ ] Original amount display
  - [ ] Refund amount input
  - [ ] Reason textarea
  - [ ] Validation: amount <= original
  - [ ] Submit processes refund
  - [ ] Success message
  - [ ] Status updates to refunded

---

### 6. Services Management (`/reservations/services`)
#### Display
- [ ] Table với reservation services
- [ ] Search hoạt động
- [ ] Service names
- [ ] Quantities
- [ ] Total prices
- [ ] Dates provided
- [ ] Summary row với totals

#### Actions
- [ ] View Reservation link → detail
- [ ] "Edit" button → edit modal
- [ ] "Delete" button → confirmation → delete
- [ ] Edit modal:
  - [ ] Service dropdown
  - [ ] Quantity input
  - [ ] Date picker
  - [ ] Price auto-calculates
  - [ ] Submit updates service

---

### 7. Rate Plans (`/reservations/rate-plans`)
#### Display
- [ ] Table với rate plans
- [ ] Search hoạt động
- [ ] Room type filter
- [ ] Plan names
- [ ] Currency tags
- [ ] Stay requirements
- [ ] Refundable tags
- [ ] Cancellation policies

#### Actions
- [ ] "New Rate Plan" button → create modal
- [ ] "Daily Rates" button → daily rates page
- [ ] "Edit" button → edit modal
- [ ] "Delete" button → confirmation → delete

#### Create/Edit Modal
- [ ] Name input
- [ ] Room type selection
- [ ] Currency selection
- [ ] Refundable toggle
- [ ] Min stay (required, >= 1)
- [ ] Max stay (optional, >= min)
- [ ] Cancellation policy textarea
- [ ] Validation: max >= min
- [ ] Submit creates/updates
- [ ] Success message

---

### 8. Daily Rates (`/reservations/rate-plans/[id]/daily-rates`)
#### Header
- [ ] Rate plan name hiển thị
- [ ] Room type name hiển thị
- [ ] "Back to Rate Plans" button

#### Statistics
- [ ] Total days count
- [ ] Average price calculation
- [ ] Stop sell days count
- [ ] Available days count

#### Display
- [ ] Date range picker filter
- [ ] Table với daily rates
- [ ] Dates với day of week
- [ ] Weekends highlighted (blue)
- [ ] Prices với currency
- [ ] Available rooms (or "Unlimited")
- [ ] Status (Available/Stop Sell) với icons
- [ ] Pagination

#### Actions
- [ ] "Bulk Create" button → bulk modal
- [ ] "Add Single Rate" button → create modal
- [ ] "Edit" button → edit modal
- [ ] "Delete" button → confirmation → delete

#### Create/Edit Modal
- [ ] Date picker
- [ ] Price input với currency
- [ ] Available rooms (optional)
- [ ] Stop sell toggle
- [ ] Validation: price > 0
- [ ] Submit creates/updates
- [ ] Success message

#### Bulk Create Modal
- [ ] Date range picker
- [ ] Price input
- [ ] Available rooms
- [ ] Stop sell toggle
- [ ] Submit creates multiple rates
- [ ] Success với count message

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Session Management
- [ ] Logged in user → access pages
- [ ] Not logged in → redirect to /login
- [ ] Session expires → redirect to /login
- [ ] Token refresh hoạt động

### Protected Routes
- [ ] All /reservations/* pages require auth
- [ ] Login page accessible without auth
- [ ] After login → redirect back to intended page

---

## 🎨 UI/UX CONSISTENCY

### Design System
- [ ] Ant Design components used consistently
- [ ] Colors match theme
- [ ] Icons consistent
- [ ] Buttons có proper types (primary, default, danger)
- [ ] Spacing consistent (16px, 24px margins)
- [ ] Typography sizes consistent

### Status Colors
- [ ] Pending = orange
- [ ] Confirmed = blue
- [ ] Checked In = green
- [ ] Checked Out = default/gray
- [ ] Cancelled = red
- [ ] No Show = red

### Payment Status Colors
- [ ] Unpaid = red
- [ ] Partial = orange
- [ ] Paid = green
- [ ] Refunded = purple

### Loading States
- [ ] Spinners show during API calls
- [ ] Button loading states
- [ ] Skeleton loaders (if applicable)
- [ ] Disable buttons during loading

### Error Handling
- [ ] Error messages hiển thị với message.error()
- [ ] Success messages với message.success()
- [ ] Warning messages với message.warning()
- [ ] Network errors handled gracefully
- [ ] 404 errors handled
- [ ] 500 errors handled

---

## 📱 RESPONSIVE DESIGN

### Desktop (> 1200px)
- [ ] Full layout với sidebar
- [ ] Tables full width
- [ ] Modals center screen
- [ ] Forms multi-column

### Tablet (768-1200px)
- [ ] Sidebar collapsible
- [ ] Tables scrollable horizontally
- [ ] Forms 1-2 columns
- [ ] Buttons stack appropriately

### Mobile (< 768px)
- [ ] Hamburger menu
- [ ] Tables card view or scroll
- [ ] Forms single column
- [ ] Buttons full width
- [ ] Statistics cards stack

---

## ⚡ PERFORMANCE

### Load Times
- [ ] Initial page load < 3s
- [ ] Navigation instant
- [ ] API calls < 2s
- [ ] Search debounced (300ms)
- [ ] Filter updates smooth

### Data Management
- [ ] Pagination prevents large datasets
- [ ] Filters reduce data load
- [ ] Lazy loading where applicable
- [ ] No memory leaks
- [ ] Re-renders optimized

---

## 🐛 EDGE CASES

### Empty States
- [ ] No reservations → empty state message
- [ ] No payments → empty state
- [ ] No services → empty state
- [ ] No rate plans → empty state
- [ ] No daily rates → empty state

### Error States
- [ ] Network error → retry option
- [ ] 404 → not found message
- [ ] 403 → unauthorized message
- [ ] 500 → server error message
- [ ] Validation errors → field-level errors

### Data Validation
- [ ] XSS protection
- [ ] SQL injection protection
- [ ] Max length validation
- [ ] Number range validation
- [ ] Date range validation
- [ ] Currency format validation

---

## ✅ SIGN-OFF

### Tested By: _______________
### Date: _______________
### Environment: _______________
### Browser: _______________
### Screen Size: _______________

### Overall Status:
- [ ] All tests passed
- [ ] Some issues found (list below)
- [ ] Critical issues found (list below)

### Issues Found:
1. _______________________________
2. _______________________________
3. _______________________________

### Notes:
_________________________________________
_________________________________________
_________________________________________

---

**Total Test Items: 300+**  
**Estimated Test Time: 2-3 hours**  
**Priority: HIGH**
