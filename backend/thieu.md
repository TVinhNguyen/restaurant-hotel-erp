Inventory / Rooms

Amenities & liên kết RoomType
Thiếu CRUD cho inventory.amenities và gắn/bỏ gắn inventory.room_type_amenities.
Đề xuất:

GET/POST/PUT/DELETE /amenities

GET /room-types/:id/amenities, POST /room-types/:id/amenities, DELETE /room-types/:id/amenities/:amenityId

Photos cho RoomType (inventory.photos)
Đề xuất: GET /room-types/:id/photos, POST /room-types/:id/photos, PUT /photos/:id, DELETE /photos/:id

Room Status History (inventory.room_status_history)
Đề xuất: GET /rooms/:id/history?type=operational|housekeeping, POST /rooms/:id/history
(Khi PUT /rooms/:id/status cũng cần ghi log history.)

Reservation / Pricing

Services catalog & Property services
Thiếu CRUD cho reservation.services (catalog) và đã không có endpoint cho reservation.property_services (giá theo property).
Đề xuất:

GET/POST/PUT/DELETE /services (catalog)

GET/POST/PUT/DELETE /services/property-services

Reservation services (line items) (reservation.reservation_services)
Đề xuất: GET /reservations/:id/services, POST /reservations/:id/services, PUT /reservation-services/:id, DELETE /reservation-services/:id

Promotions (reservation.promotions)
Đề xuất: GET/POST/PUT/DELETE /promotions, GET /promotions/validate?...

Tax rules (reservation.tax_rules)
Đề xuất: GET/POST/PUT/DELETE /tax-rules

Availability/Quote (kết hợp daily_rates.stop_sell + available_rooms)
Đề xuất: GET /availability/quote?propertyId=&checkIn=&checkOut=&adults=&children=&roomTypeId?=&ratePlanId?=

Payments

DB có trạng thái authorized|captured|refunded|voided, nhưng API hiện chỉ “process(capture)” + “refund”.
Đề xuất: bổ sung POST /payments/:id/void (và tuỳ kiến trúc: authorize/capture riêng), GET /payments/:id.

Roles / Employee Roles

Roles: có GET/POST nhưng chưa có PUT/DELETE.

EmployeeRoles (core.employee_roles): chỉ có POST /employees/:id/roles; thiếu liệt kê, cập nhật, xoá, filter theo property.
Đề xuất:

GET /employee-roles?employeeId=&propertyId=

PUT /employee-roles/:id, DELETE /employee-roles/:id

Restaurant

Restaurant Areas (restaurant.restaurant_areas) chưa có CRUD.

Restaurant Tables: có GET/POST, thiếu PUT/DELETE, GET single.

Table Bookings (restaurant.table_bookings): có list/create và PUT status, thiếu:

GET /table-bookings/:id, DELETE /table-bookings/:id, PUT /table-bookings/:id (sửa chi tiết)

GET /tables/availability?...

Hỗ trợ đặt bởi user nội bộ (DB cho phép guest_id hoặc user); hiện body chỉ có guest_id.

(Tuỳ bạn) endpoint riêng POST /table-bookings/:id/assign-table

HR nâng cao

Employee Evaluations (hr.employee_evaluations): thiếu toàn bộ CRUD.

Overtimes (hr.overtimes): thiếu CRUD + approve.

Deductions (hr.deductions): thiếu CRUD.

Working Shifts: thiếu DELETE /working-shifts/:id và (nên có) POST /working-shifts/bulk.

Leaves: đang gộp approve/reject vào một endpoint, có thể tách POST /leaves/:id/reject nếu muốn rõ ràng.

Payrolls: có tạo & xem chi tiết, nhưng (nên có) PUT/DELETE, POST /payrolls/preview, POST /payrolls/:id/finalize.

Những phần có trong .txt nhưng KHÔNG có trong DB

Menu & Orders nhà hàng (menu categories/items, orders, order_items, order payments): DB hiện chưa có bảng cho các thực thể này.
→ Nếu muốn giữ API này, cần bổ sung bảng tương ứng; nếu bám chuẩn DB hiện tại, nên loại phần “Restaurant Menu” và “Restaurant Orders” khỏi doc.

Một vài lệch nhỏ khác

/roles nên có PUT/DELETE.

/restaurants nên có GET /restaurants/:id, PUT /restaurants/:id, DELETE /restaurants/:id.

/reservations: bạn dùng PUT /reservations/:id/status và check-in/check-out là ổn; nếu muốn tách rõ assign room, có thể thêm PUT /reservations/:id/room.