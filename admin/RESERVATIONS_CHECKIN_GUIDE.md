# Reservations Check-in & Workflow Guide

## 🎯 Complete Reservation Workflow

### Status Flow
```
pending → confirmed → checked_in → checked_out
         ↘ cancelled
```

---

## 📝 Create Reservation Workflow

### Step 1: Navigate to Create Page
```
URL: /reservations/create
Button: "New Reservation" on main list page
```

### Step 2: Fill 3-Step Form

#### **Step 1: Guest Information**
- Select existing guest OR create new guest
- Guest email must be unique
- Guest phone must be valid

#### **Step 2: Booking Details**
- **Check-in Date**: Must be today or future
- **Check-out Date**: Must be after check-in
- **Adults**: Minimum 1 required
- **Children**: Optional (default 0)
- **Room Type**: Select from available room types
- **Rate Plan**: Auto-filtered by selected room type
- **Channel**: OTA/Website/Walk-in/Phone

#### **Step 3: Contact & Notes**
- **Contact Name**: Primary contact (can be different from guest)
- **Contact Email**: For confirmation
- **Contact Phone**: For communication
- **Guest Notes**: Special requests, preferences

### Step 3: Submit
- Click "Create Reservation"
- Confirmation code generated automatically
- Status set to "pending"
- Total amount calculated from rate plan

---

## ✅ Confirm Reservation

### Method 1: From List Page
1. Go to `/reservations`
2. Find reservation with status "pending"
3. Click "Confirm" button
4. Reservation status changes to "confirmed"

### Method 2: From Details Page
1. Go to `/reservations/[id]`
2. If status is "pending", click "Confirm" button
3. Status changes to "confirmed"

---

## 🏠 Assign Room (Required before Check-in)

### Option 1: Before Check-in
1. Go to reservation details `/reservations/[id]`
2. Status must be "confirmed"
3. Click "Assign Room" button
4. Select available room from dropdown
5. Click "Assign"
6. System will ask: "Check-in now?"

### Option 2: During Check-in
1. Click "Check-in" button
2. If no room assigned, system prompts:
   - "Room Assignment Required"
   - "Would you like to assign a room now?"
3. Click "Assign Room"
4. Select room and assign
5. Then proceed to check-in

### Available Rooms Filter
- Only shows rooms matching reservation's room type
- Only shows rooms with status "available"
- Shows room number, floor, and view type

---

## 🎫 Check-in Process

### Prerequisites
- ✅ Reservation status must be "confirmed"
- ✅ Room must be assigned
- ✅ Check-in date must be today or past

### Steps
1. Navigate to `/reservations/[id]`
2. Verify:
   - Status: "confirmed" ✓
   - Room: Assigned ✓
   - Date: Check-in date is today or past ✓
3. Click "Check-in" button
4. System validates:
   - If no room → Prompt to assign room
   - If date not valid → Show error
5. Success:
   - Status changes to "checked_in"
   - Room status changes to "occupied"
   - Success message displayed

### API Call
```typescript
POST /api/reservations/:id/checkin
Body: { roomId: "uuid" }
```

---

## 🚪 Check-out Process

### Prerequisites
- ✅ Reservation status must be "checked_in"
- ✅ All payments should be settled (recommended)

### Steps
1. Navigate to `/reservations/[id]`
2. Verify status is "checked_in"
3. Check payment balance:
   - If unpaid → Consider processing payment first
   - Can still checkout with pending payment
4. Click "Check-out" button
5. Success:
   - Status changes to "checked_out"
   - Room status changes to "needs_cleaning"
   - Checkout timestamp recorded

### API Call
```typescript
POST /api/reservations/:id/checkout
```

---

## 💳 Payment Management

### Add Payment During Stay
1. Go to reservation details
2. Click "Add Payment" button
3. Enter:
   - Amount (max = remaining balance)
   - Payment method (cash/card/bank transfer/other)
   - Transaction ID (optional)
   - Notes (optional)
4. Click "Submit"
5. Payment status auto-updates:
   - Full payment → "paid"
   - Partial payment → "partial"

### Payment Status Colors
- 🔴 **Unpaid** (Red) - No payment made
- 🟠 **Partial** (Orange) - Some payment made
- 🟢 **Paid** (Green) - Fully paid
- 🟣 **Refunded** (Purple) - Payment refunded

---

## 🛎️ Add Services

### During Stay (checked_in)
1. Go to reservation details
2. Click "Add Service" button
3. Select service from dropdown
4. Enter quantity
5. Price auto-calculated
6. Click "Add"
7. Service amount added to total

### Services Included
- Room service
- Laundry
- Minibar items
- Spa treatments
- Restaurant charges
- etc.

---

## ❌ Cancel Reservation

### When to Cancel
- Guest requests cancellation
- No-show situation
- Overbooking resolution

### Steps
1. Go to reservation details
2. Click "Cancel" button
3. Confirm action
4. Status changes to "cancelled"
5. Assigned room (if any) becomes "available"

### Note
- Cancelled reservations cannot be reactivated
- Consider refund policy
- Can process refunds from Payments page

---

## 📊 Status-Based Actions

### Pending → Confirmed
- **Actions Available**: Confirm, Cancel, Edit
- **Cannot**: Check-in, Check-out, Assign Room

### Confirmed → Checked-in
- **Actions Available**: Assign Room, Check-in, Cancel, Edit
- **Cannot**: Check-out

### Checked-in → Checked-out
- **Actions Available**: Add Payment, Add Service, Check-out
- **Cannot**: Cancel, Edit (booking details)

### Checked-out (Final State)
- **Actions Available**: View only, Print, Refund
- **Cannot**: Modify booking details

---

## 🔄 Complete Example Workflow

### Scenario: Walk-in Guest

```
1. Create Reservation
   - Guest: John Doe
   - Check-in: Today
   - Check-out: Tomorrow
   - Room Type: Deluxe
   - Status: pending

2. Confirm Reservation
   - Review booking details
   - Click "Confirm"
   - Status: confirmed

3. Assign Room
   - Click "Assign Room"
   - Select: Room 101
   - Room assigned successfully

4. Check-in
   - Click "Check-in"
   - Verify guest ID
   - Status: checked_in
   - Room 101: occupied

5. Add Services (Optional)
   - Add breakfast: $20
   - Add laundry: $15
   - Total services: $35

6. Process Payment
   - Room charge: $150
   - Services: $35
   - Tax: $18.50
   - Total: $203.50
   - Payment: Cash $203.50
   - Status: paid

7. Check-out
   - Next day
   - Click "Check-out"
   - Status: checked_out
   - Room 101: needs_cleaning
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Reservation must be confirmed to check in"
**Solution**: Click "Confirm" button first, then check-in

### Issue 2: "Room Assignment Required"
**Solution**: Assign a room before checking in

### Issue 3: "Cannot check in before check-in date"
**Solution**: Wait until check-in date, or modify booking dates

### Issue 4: "No available rooms"
**Solution**: 
- Check room status in Inventory Management
- Consider different room type
- Check overbooking situation

### Issue 5: "Error loading reservation"
**Solution**:
- Refresh page
- Check network connection
- Verify reservation ID in URL

---

## 🎯 Best Practices

### 1. **Confirm Quickly**
- Confirm reservations as soon as payment received
- Don't leave reservations in "pending" status too long

### 2. **Assign Rooms Early**
- Assign rooms before check-in date if possible
- Consider guest preferences (floor, view)

### 3. **Payment Collection**
- Collect payment before or during check-in
- Don't let guests check-out with unpaid balance

### 4. **Service Tracking**
- Add services immediately when consumed
- Don't wait until check-out

### 5. **Communication**
- Use guest notes for special requests
- Keep contact information updated

---

## 📱 Quick Actions Reference

| Status | Available Actions |
|--------|------------------|
| **Pending** | Confirm, Cancel, Edit, Delete |
| **Confirmed** | Assign Room, Check-in, Cancel, Edit |
| **Checked-in** | Add Service, Add Payment, Check-out |
| **Checked-out** | View, Print, Refund (if needed) |
| **Cancelled** | View, Delete |

---

## 🔐 Permissions Required

- **View Reservations**: Read access
- **Create/Edit**: Write access
- **Check-in/Check-out**: Receptionist role
- **Cancel**: Manager approval may be required
- **Process Payment**: Cashier/Receptionist role
- **Add Services**: Staff role

---

## 📞 Support

### Need Help?
- Check documentation: `/admin/RESERVATIONS_*.md`
- Review API docs: `/backend/api_doc.txt`
- Contact system administrator

### Report Issues
- Backend errors: Check logs at `/backend/src/reservations/`
- Frontend issues: Check browser console
- API problems: Review network tab

---

**Status**: ✅ Complete & Production Ready  
**Last Updated**: October 12, 2025  
**Version**: 1.0.0
