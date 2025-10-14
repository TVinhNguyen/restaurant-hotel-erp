# Reservations Module - Quick Reference Guide

## 📋 Module Structure

```
/reservations
├── / ........................... Main list page with filters & statistics
├── /create ..................... Create new reservation (3-step form)
├── /[id] ....................... View reservation details
├── /[id]/edit .................. Edit reservation
├── /payments ................... Payments management & refunds
├── /services ................... Additional services management
├── /rate-plans ................. Rate plans configuration
└── /rate-plans/[id]/daily-rates  Daily pricing calendar
```

## 🔑 Key Features by Page

### 1. Reservations List (`/reservations`)
- View all reservations with pagination
- Filter by: status, payment status, channel, date range
- Search: confirmation code, guest name, email, phone
- Quick actions: check-in, check-out, cancel
- Statistics: total, pending, confirmed, checked-in, revenue, unpaid

### 2. Create Reservation (`/reservations/create`)
**Step 1:** Guest selection & booking channel
**Step 2:** Dates, room type, rate plan, guests count
**Step 3:** Contact info & special requests
- Real-time price calculation
- Date validation
- Guest capacity checking

### 3. View Reservation (`/reservations/[id]`)
- Complete reservation information
- Status-based action buttons
- Financial breakdown with balance
- Payment history table
- Services list
- Assign room functionality
- Add payment modal
- Print support

### 4. Edit Reservation (`/reservations/[id]/edit`)
- Modify all reservation details
- Date validation
- Pre-populated form
- Rate plan filtering by room type

### 5. Payments (`/reservations/payments`)
- Complete payment history
- Filter by status, method, date
- Process refunds
- Link to reservations
- Statistics: total payments, amount, captured, refunded

### 6. Services (`/reservations/services`)
- List all reservation services
- Add/edit services with auto-pricing
- Link to reservations
- Summary totals

### 7. Rate Plans (`/reservations/rate-plans`)
- Manage pricing strategies
- Set minimum/maximum stay
- Cancellation policies
- Refundable/non-refundable options
- Link to daily rates

### 8. Daily Rates (`/reservations/rate-plans/[id]/daily-rates`)
- Calendar-based pricing
- Single day pricing
- Bulk pricing for date ranges
- Available rooms control
- Stop sell functionality
- Weekend highlighting
- Statistics: avg price, stop sell days

## 🎨 Status Colors

### Reservation Status
- 🟠 Pending (orange)
- 🔵 Confirmed (blue)
- 🟢 Checked In (green)
- ⚪ Checked Out (default)
- 🔴 Cancelled (red)
- 🔴 No Show (red)

### Payment Status
- 🔴 Unpaid (red)
- 🟠 Partial (orange)
- 🟢 Paid (green)
- 🟣 Refunded (purple)

### Channel
- 🔵 OTA (blue)
- 🟢 Website (green)
- 🟠 Walk-in (orange)
- 🟣 Phone (purple)

## 🔄 Workflows

### Check-in Flow
1. Reservation status: Confirmed
2. Click "Check-in" button
3. API: `POST /api/reservations/:id/checkin`
4. Status changes to: Checked In

### Check-out Flow
1. Reservation status: Checked In
2. Ensure payment complete
3. Click "Check-out" button
4. API: `POST /api/reservations/:id/checkout`
5. Status changes to: Checked Out

### Payment Flow
1. View reservation details
2. Click "Add Payment"
3. Enter amount, method, notes
4. API: `POST /api/payments`
5. Payment status updates automatically

### Room Assignment Flow
1. Reservation confirmed
2. Click "Assign Room"
3. Select available room
4. API: `PUT /api/reservations/:id/room`
5. Room assigned

## 📊 Key Validations

### Dates
- ✓ Check-in must be today or future
- ✓ Check-out must be after check-in
- ✓ Min stay requirements (from rate plan)
- ✓ Max stay requirements (from rate plan)

### Payments
- ✓ Amount > 0
- ✓ Cannot exceed balance
- ✓ Refund cannot exceed payment amount

### Room Assignment
- ✓ Room must be available
- ✓ Room type must match reservation

### Rate Plans
- ✓ Max stay >= min stay
- ✓ Min stay >= 1

## 🔌 API Integration

### Main Endpoints
```
GET    /api/reservations              List with filters
POST   /api/reservations              Create
GET    /api/reservations/:id          Details
PUT    /api/reservations/:id          Update
DELETE /api/reservations/:id          Delete
POST   /api/reservations/:id/checkin  Check-in
POST   /api/reservations/:id/checkout Check-out
PUT    /api/reservations/:id/room     Assign room
PUT    /api/reservations/:id/cancel   Cancel

GET    /api/payments                  List
POST   /api/payments                  Create
POST   /api/payments/:id/refund       Refund

GET    /api/rate-plans                List
POST   /api/rate-plans                Create
PUT    /api/rate-plans/:id            Update
DELETE /api/rate-plans/:id            Delete

GET    /api/daily-rates               List
POST   /api/daily-rates               Create
PUT    /api/daily-rates/:id           Update
DELETE /api/daily-rates/:id           Delete
```

## 💡 Pro Tips

### For Best User Experience
1. Always check payment status before check-out
2. Assign rooms early for better planning
3. Use bulk daily rates for consistent periods
4. Set stop sell dates for maintenance
5. Review cancellation policies per rate plan

### Performance
- Use date range filters to limit data
- Pagination handles large datasets
- Search is debounced for better performance

### Data Entry
- Guest selection autocomplete
- Rate plans auto-filter by room type
- Prices auto-calculate based on dates
- Contact info can prefill from guest

## 🐛 Common Issues & Solutions

### Issue: Cannot create reservation
- ✓ Check property is selected
- ✓ Verify room type has rate plans
- ✓ Ensure dates are valid
- ✓ Check guest exists

### Issue: Cannot check-in
- ✓ Status must be "confirmed"
- ✓ Check date must be today or past
- ✓ Room assignment recommended

### Issue: Payment not adding
- ✓ Verify amount <= balance
- ✓ Check payment method selected
- ✓ Ensure reservation not cancelled

### Issue: Daily rates not showing
- ✓ Check date range filter
- ✓ Verify rate plan has rates
- ✓ Ensure not deleted

## 📱 Responsive Design
- ✅ Desktop: Full table with all columns
- ✅ Tablet: Horizontal scroll for tables
- ✅ Mobile: Stacked cards or scrollable tables

## 🔐 Permissions
All pages require:
- Valid authentication token
- Property selection
- Appropriate role permissions

## 📈 Statistics & Reports
Available metrics:
- Total reservations count
- Revenue totals
- Occupancy indicators
- Payment status breakdown
- Channel performance
- Average rates

## 🎯 Next Steps
After implementing reservations:
1. Test all workflows end-to-end
2. Verify calculations are correct
3. Test edge cases (overbooking, refunds)
4. Add additional reports if needed
5. Integrate with email notifications
6. Add calendar view option
7. Implement revenue management features
