# Reservations Module - Simple Testing Guide

## 🎯 Mục Đích
Hướng dẫn test đơn giản cho Reservations module với dữ liệu thật từ API.

## ✅ Pre-requisites Checklist

### Backend Setup
- [ ] Backend đang chạy tại `http://localhost:4000`
- [ ] Database có dữ liệu mẫu
- [ ] Có ít nhất 1 property trong database
- [ ] Có ít nhất 1 guest trong database
- [ ] Có ít nhất 1 room type trong database
- [ ] Có ít nhất 1 rate plan trong database

### Frontend Setup
- [ ] File `.env.local` có `NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000/api`
- [ ] `npm install` đã chạy thành công
- [ ] `npm run dev` đang chạy
- [ ] Đã login vào hệ thống
- [ ] Đã chọn một property (selectedPropertyId trong localStorage)

## 🧪 Test Steps

### 1. Test Dashboard (Đơn Giản Nhất)

**URL:** `http://localhost:3000/reservations/dashboard`

**Expected:**
- [ ] Trang load không có lỗi
- [ ] Hiện 8 statistics cards (có thể giá trị = 0 nếu chưa có data)
- [ ] Hiện date range picker
- [ ] Hiện bảng "Recent Reservations" (có thể empty)
- [ ] Không có error trong console

**Nếu lỗi:**
- Check console log
- Check Network tab → API calls
- Verify `selectedPropertyId` trong localStorage

---

### 2. Test Reservations List

**URL:** `http://localhost:3000/reservations`

**Expected:**
- [ ] Trang load không có lỗi
- [ ] Hiện 6 statistics cards ở top
- [ ] Hiện search box
- [ ] Hiện filter dropdowns (Status, Payment, Channel)
- [ ] Hiện date range picker
- [ ] Hiện bảng reservations (có thể empty)
- [ ] Button "Create Reservation" màu xanh

**Nếu lỗi:**
- Kiểm tra API endpoint: `GET /reservations?propertyId={id}`
- Kiểm tra token trong localStorage
- Kiểm tra propertyId trong localStorage

---

### 3. Test Create Reservation (Quan Trọng)

**URL:** `http://localhost:3000/reservations/create`

**Step 1: Guest Information**
- [ ] Trang hiện Step 1 form
- [ ] Dropdown "Select Guest" load được danh sách guests
- [ ] Hoặc có thể điền New Guest Info
- [ ] Button "Next" enabled khi điền đủ thông tin

**Step 2: Booking Details**
- [ ] Dropdown "Room Type" load được danh sách
- [ ] Dropdown "Rate Plan" load được danh sách
- [ ] Date pickers cho Check-In / Check-Out
- [ ] Input fields cho Adults / Children
- [ ] Hiện tính toán giá tự động
- [ ] Button "Next" enabled

**Step 3: Contact & Confirmation**
- [ ] Form hiện contact information
- [ ] Dropdown "Channel" có options
- [ ] Textarea cho Guest Notes
- [ ] Button "Create Reservation" màu xanh

**Submit:**
- [ ] Click "Create Reservation"
- [ ] Hiện loading state
- [ ] Success message xuất hiện
- [ ] Redirect về reservations list
- [ ] Reservation mới xuất hiện trong list

**Nếu lỗi:**
- API `GET /guests?propertyId={id}` phải có data
- API `GET /room-types?propertyId={id}` phải có data
- API `GET /rate-plans?propertyId={id}` phải có data
- API `POST /reservations` phải accept đúng format

---

### 4. Test View Reservation

**Prerequisites:** Phải có ít nhất 1 reservation trong database

**URL:** `http://localhost:3000/reservations/{id}`

**Expected:**
- [ ] Trang load reservation details
- [ ] Hiện Guest Information
- [ ] Hiện Booking Information
- [ ] Hiện Pricing Breakdown
- [ ] Hiện Payment Information
- [ ] Hiện Action buttons (tùy status)
  - Pending → "Confirm", "Cancel"
  - Confirmed → "Check In", "Assign Room", "Cancel"
  - Checked In → "Check Out"

**Test Actions:**
- [ ] Click "Check In" → API call → Success message
- [ ] Click "Check Out" → API call → Success message
- [ ] Click "Assign Room" → Modal hiện → Select room → Success
- [ ] Click "Add Payment" → Modal hiện → Enter amount → Success

**Nếu lỗi:**
- API `GET /reservations/{id}` phải return full object
- API `POST /reservations/{id}/checkin` phải hoạt động
- API `POST /reservations/{id}/checkout` phải hoạt động

---

### 5. Test Payments

**URL:** `http://localhost:3000/reservations/payments`

**Expected:**
- [ ] Trang load payments list
- [ ] Hiện 4 statistics cards
- [ ] Hiện filter options
- [ ] Hiện bảng payments
- [ ] Action buttons: View, Refund (nếu có)

**Test Refund:**
- [ ] Click "Refund" trên 1 payment
- [ ] Modal hiện
- [ ] Enter refund amount
- [ ] Enter reason
- [ ] Click "Process Refund"
- [ ] Success message
- [ ] Payment status update

---

### 6. Test Services

**URL:** `http://localhost:3000/reservations/services`

**Expected:**
- [ ] Trang load services list
- [ ] Hiện 4 statistics cards
- [ ] Hiện search và filters
- [ ] Hiện bảng reservation services
- [ ] Button "Add Service"

---

### 7. Test Rate Plans

**URL:** `http://localhost:3000/reservations/rate-plans`

**Expected:**
- [ ] Trang load rate plans list
- [ ] Hiện 4 statistics cards
- [ ] Hiện search
- [ ] Hiện bảng rate plans
- [ ] Button "Create Rate Plan"
- [ ] Action: View Daily Rates

---

### 8. Test Daily Rates

**Prerequisites:** Phải có ít nhất 1 rate plan

**URL:** `http://localhost:3000/reservations/rate-plans/{id}/daily-rates`

**Expected:**
- [ ] Trang load daily rates
- [ ] Hiện rate plan info
- [ ] Hiện date range và amount inputs
- [ ] Button "Bulk Create"
- [ ] Bảng daily rates
- [ ] Actions: Edit, Delete

---

## 🐛 Common Issues & Solutions

### Issue 1: "Please select a property first"
**Solution:**
```javascript
// In browser console:
localStorage.setItem('selectedPropertyId', 'your-property-uuid-here');
// Then refresh page
```

### Issue 2: "401 Unauthorized"
**Solution:**
```javascript
// Check token:
console.log(localStorage.getItem('token'));
// If null, login again
```

### Issue 3: "Network Error"
**Solution:**
- Check backend is running: `curl http://localhost:4000/api/health`
- Check .env.local file
- Restart frontend: `npm run dev`

### Issue 4: Empty dropdowns
**Solution:**
- Verify database has sample data
- Check API responses in Network tab
- Ensure propertyId filter is correct

### Issue 5: "Cannot read property of undefined"
**Solution:**
- Backend API might not return expected fields
- Check API response structure
- Add null checks in code: `r.property?.name || ''`

---

## 🎯 Quick Test Script (Browser Console)

```javascript
// 1. Check environment
console.log('API Endpoint:', process.env.NEXT_PUBLIC_API_ENDPOINT);
console.log('Token:', localStorage.getItem('token'));
console.log('Property ID:', localStorage.getItem('selectedPropertyId'));

// 2. Test API call
fetch('http://localhost:4000/api/reservations?propertyId=' + localStorage.getItem('selectedPropertyId'), {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Reservations:', d))
.catch(e => console.error('Error:', e));

// 3. Test guests endpoint
fetch('http://localhost:4000/api/guests?propertyId=' + localStorage.getItem('selectedPropertyId'), {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Guests:', d))
.catch(e => console.error('Error:', e));
```

---

## ✅ Success Criteria

**Module hoạt động tốt khi:**
1. ✅ Tất cả 9 pages load không lỗi
2. ✅ API calls trả về data (hoặc empty array nếu chưa có)
3. ✅ Create reservation thành công
4. ✅ Update/Delete operations hoạt động
5. ✅ Status changes (check-in, check-out) hoạt động
6. ✅ Filters và search hoạt động
7. ✅ Không có error trong browser console
8. ✅ Navigation giữa các pages mượt mà

---

## 📝 Test Log Template

```
Date: ___________
Tester: ___________

Dashboard: [ PASS / FAIL ] - Notes: _____________
Reservations List: [ PASS / FAIL ] - Notes: _____________
Create Reservation: [ PASS / FAIL ] - Notes: _____________
View Reservation: [ PASS / FAIL ] - Notes: _____________
Edit Reservation: [ PASS / FAIL ] - Notes: _____________
Payments: [ PASS / FAIL ] - Notes: _____________
Services: [ PASS / FAIL ] - Notes: _____________
Rate Plans: [ PASS / FAIL ] - Notes: _____________
Daily Rates: [ PASS / FAIL ] - Notes: _____________

Overall Status: [ PASS / FAIL ]
Issues Found: _____________
```

---

## 🚀 Next Steps After Testing

If all tests pass:
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Performance testing with large datasets
- [ ] Security audit

If tests fail:
- [ ] Document all errors
- [ ] Check API responses
- [ ] Review error logs
- [ ] Fix issues one by one
- [ ] Re-test
