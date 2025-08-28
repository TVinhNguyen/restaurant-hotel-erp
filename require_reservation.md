Mục tiêu: “quản lý trọn vòng đời đặt phòng đa cơ sở” – từ báo giá → giữ chỗ → gán phòng → check-in → phát sinh dịch vụ & thanh toán → check-out / hủy / no-show.

Booking Pipeline (Danh sách & lịch đặt phòng)

List + Calendar theo ngày đến/đi; lọc theo status (pending/confirmed/checked_in/…), channel (OTA/website/walk-in/phone), RoomType, payment status.

Kanban theo trạng thái để kéo-thả (pending → confirmed → assigned → …).

Tìm nhanh theo guest/phone/email/confirmation code.

Availability & Pricing (Kiểm tra tồn & tính giá)

Kiểm tra còn phòng theo RoomType, dải ngày (đọc từ DailyRate.availableRooms, stopSell).

Engine tính giá: RatePlan + giá theo ngày + thuế/phí (TaxRule) − khuyến mãi (Promotion) → ra total_amount (snapshot).

Rule min/max stay, chính sách hoàn/hủy/đặt cọc theo RatePlan.

Create/Edit Reservation (Tạo/Sửa đặt phòng)

Chọn Guest/tạo mới; nhập snapshot liên hệ.

Chọn RoomType, RatePlan, ngày, số khách; áp Promotion.

Tự tính tổng (room charge + service + tax − discount); hỗ trợ đặt cọc/authorize.

Assign Room (Gán phòng)

Từ trạng thái Unassigned → liệt kê phòng trống hợp lệ (cùng property, available, không dirty).

Cho phép override có kiểm soát (ví dụ phòng đang clean nhưng chưa inspected).

Log lịch sử gán/đổi phòng.

Stay Operations (Check-in / Check-out)

Check-in: yêu cầu đã gán phòng hợp lệ; có thể thu tiền đặt cọc; chuyển status → checked_in.

Check-out: tổng hợp folio (tiền phòng theo đêm + dịch vụ + thuế); thu phần còn thiếu; status → checked_out.

Tự động chuyển phòng sang housekeepingStatus = dirty sau check-out.

Payments & Folio (Thu/Hoàn & sổ chi tiết)

Tạo thu (cash/card/bank/e-wallet/OTA virtual); trạng thái authorized|captured|refunded|voided.

Hỗ trợ refund/void với chuỗi parent_payment_id.

Đồng bộ payment_status (unpaid|partial|paid|refunded) theo amount_paid.

In/xuất hóa đơn; khóa folio khi hoàn tất.

Reservation Services (Dịch vụ phát sinh)

Gắn dịch vụ từ PropertyService (giặt ủi, spa…): số lượng, ngày dùng → ReservationService.

Tự tính thuế/phí theo cấu hình; cộng vào service_amount.

Cancellations & No-show (Hủy & vắng mặt)

Áp phí hủy/no-show theo policy của RatePlan (tính thành dòng charge riêng hoặc discount âm).

Cập nhật tồn phòng (availableRooms) nếu bạn đang dùng allotment.

Link với TableBooking (F&B)

Tạo/đính kèm đặt bàn (pax, thời gian, duration, yêu cầu đặc biệt); xem trạng thái bàn; liên hệ nhà hàng cho khách lưu trú.

Reports (Báo cáo)

Booking pace & pick-up, nguồn kênh (OTA vs direct), cancellation/no-show rate.

Doanh thu: room vs services, ADR, RevPAR (kết hợp Rooms), thuế/phí.

Length of stay, occupancy theo RoomType/RatePlan.