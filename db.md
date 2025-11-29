classDiagram
direction TB

%% =========================
%% 0) PROPERTY (TRUNG TÂM)
%% =========================
class Property {
  +string id
  +string name
  +string address
  +string city
  +string country
  +string phone
  +string email
  +string website
  +string property_type "Hotel|Resort|Restaurant Chain"
  +time   check_in_time
  +time   check_out_time
}

%% =========================
%% 1) CORE & STAFF (UPDATED)
%% =========================
class User {
  +string id
  +string email
  +string name
  +string phone
  +string password_hash
  +datetime created_at
  +datetime updated_at
}

class Role {
  +string id
  +string name "CHAIN_ADMIN|PROPERTY_MANAGER|RECEPTIONIST"
  +string description
  +string scope "global|per_property"
}

class Permission {
  +string id
  +string slug "reservation.view|room.edit|user.delete"
  +string name "Mô tả ngắn gọn"
  +string module "FrontDesk|Housekeeping|System"
}

class RolePermission {
  +string role_id
  +string permission_id
}

class Employee {
  +string id
  +string user_id
  +string employeeId
  +string fullName
  +string department "Front Desk|Housekeeping|HR|F&B"
  +string status "active|on_leave|terminated"
  +date   hire_date
  +date   termination_date
}

class EmployeeRole {
  +string id
  +string employee_id
  +string property_id
  +string role_id
  +date   effective_from
  +date   effective_to
}

class Guest {
  +string id
  +string name
  +string email
  +string phone
  +string loyalty_tier
  +string passport_id
  +boolean consent_marketing
  +string privacy_version
  +datetime created_at
  +datetime updated_at
}

%% =========================
%% 3) ROOMS & INVENTORY
%% =========================
class RoomType {
  +string id
  +string property_id
  +string name
  +string description
  +number maxAdults
  +number maxChildren
  +number base_price
  +string bed_type
}

class Amenity {
  +string id
  +string name
  +string category "room|facility"
}

class RoomTypeAmenity {
  +string roomTypeId
  +string amenityId
}

class Photo {
  +string id
  +string roomTypeId
  +string url
  +string caption
}

class Room {
  +string id
  +string property_id
  +string roomTypeId
  +string number
  +string floor
  +string view_type
  +string operationalStatus "available|out_of_service"
  +string housekeepingStatus "clean|dirty|inspected"
  +string housekeeperNotes
}

class RoomStatusHistory {
  +string id
  +string roomId
  +string statusType "operational|housekeeping"
  +string status
  +datetime changedAt
  +string changed_by "employee_id"
  +string notes
}

%% =========================
%% 4) RATES & AVAILABILITY
%% =========================
class RatePlan {
  +string id
  +string property_id
  +string roomTypeId
  +string name
  +string cancellationPolicyText
  +string currency
  +number min_stay
  +number max_stay
  +boolean is_refundable
}

class DailyRate {
  +string id
  +string ratePlanId
  +date   date
  +number price
  +number availableRooms
  +boolean stopSell
}

%% =========================
%% 5) RESERVATION & PAYMENT
%% =========================
class Reservation {
  +string id
  +string property_id
  +string guestId
  +string booker_user_id "nullable"
  +string channel "ota|website|walkin|phone"
  +string external_ref "mã từ OTA/đối tác"
  +string promotion_id "nullable"
  +date   checkIn
  +date   checkOut
  +string status "pending|confirmed|checked_in|checked_out|cancelled|no_show"
  +string roomTypeId
  +string ratePlanId
  +string assigned_room_id "nullable"
  +number adults
  +number children
  +string contact_name "snapshot"
  +string contact_email "snapshot"
  +string contact_phone "snapshot"
  +string guestNotes
  +string confirmation_code
  +number totalAmount
  +number taxAmount
  +number discountAmount
  +number serviceAmount
  +number amountPaid
  +string currency
  +string paymentStatus "unpaid|partial|paid|refunded"
}

class Payment {
  +string id
  +string reservationId
  +string parent_payment_id "nullable - link refund/void"
  +number amount
  +string currency
  +string method "cash|card|bank|e_wallet|ota_virtual"
  +string transaction_id
  +string status "authorized|captured|refunded|voided"
  +datetime paidAt
  +string notes
}

class Service {
  +string id
  +string name
  +string unit
}

class PropertyService {
  +string id
  +string property_id
  +string service_id
  +number price
  +number tax_rate
  +string currency
}

class ReservationService {
  +string id
  +string reservationId
  +string property_service_id
  +number quantity
  +number totalPrice
  +date   dateProvided
}

class Promotion {
  +string id
  +string code
  +number discount_percent
  +date   valid_from
  +date   valid_to
  +string property_id "nullable = áp dụng toàn chuỗi"
}

class TaxRule {
  +string id
  +string property_id
  +number rate
  +string type "VAT|service"
}

%% =========================
%% 6) RESTAURANT / TABLE
%% =========================
class Restaurant {
  +string id
  +string property_id
  +string name
  +string description
  +string location
  +string openingHours
  +string cuisine_type
}

class RestaurantArea {
  +string id
  +string restaurantId
  +string name
}

class RestaurantTable {
  +string id
  +string restaurantId
  +string areaId
  +string tableNumber
  +number capacity
  +string status "available|occupied|reserved"
}

class TableBooking {
  +string id
  +string restaurantId
  +string guestId "hoặc user nội bộ"
  +string reservation_id "nullable"
  +date   bookingDate
  +time   bookingTime
  +number pax
  +string status "pending|confirmed|seated|completed|no_show|cancelled"
  +string assigned_table_id "nullable"
  +string specialRequests
  +number duration_minutes
}

%% =========================
%% 7) HR (GỌN)
%% =========================
class WorkingShift {
  +string id
  +string property_id
  +string employee_id
  +date   workingDate
  +time   start_time
  +time   end_time
  +string shift_type "morning|night|other"
  +string additionalNotes
  +boolean isReassigned
  +datetime created_at
  +datetime updated_at
}

class Attendance {
  +string id
  +string employee_id
  +string working_shift_id
  +datetime check_in_time
  +datetime check_out_time
  +string notes
}

class Leave {
  +string id
  +string employee_id
  +date   leaveDate
  +number numberOfDays
  +string leave_type "annual|sick|unpaid|other"
  +string status "pending|approved|rejected"
  +string reason
  +string approvedBy
  +string hrNote
  +datetime created_at
  +datetime updated_at
}

class EmployeeEvaluation {
  +string id
  +string employee_id
  +string evaluatedBy
  +number rate "1..10"
  +string period "quarterly|annual"
  +string goals
  +string strength
  +string improvement
  +string comments
  +datetime created_at
  +datetime updated_at
}

class PayRoll {
  +string id
  +string employee_id
  +string period "YYYY-MM"
  +number basicSalary
  +number netSalary
  +number bonus
  +string currency
  +datetime created_at
  +datetime updated_at
}

class Overtime {
  +string id
  +string employee_id
  +string working_shift_id
  +number numberOfHours
  +number rate
  +number amount
  +string approved_by
  +datetime created_at
  +datetime updated_at
}

class Deduction {
  +string id
  +string employee_id
  +string leave_id "nullable"
  +string type "tax|insurance|other"
  +number amount
  +date   date
  +string reason_details
  +datetime created_at
  +datetime updated_at
}

%% =========================
%% 8) RELATIONSHIPS
%% =========================

%% --- NEW PERMISSION LINKS ---
Role "1" -- "0..*" RolePermission : has_permissions
Permission "1" -- "0..*" RolePermission : defined_in
%% ----------------------------

Property "1" -- "0..*" EmployeeRole : has_roles
Property "1" -- "0..*" RoomType : offers
Property "1" -- "0..*" Room : contains
Property "1" -- "0..*" RatePlan : has
Property "1" -- "0..*" Reservation : receives
Property "1" -- "0..*" Restaurant : operates
Property "1" -- "0..*" PropertyService : provides
Property "1" -- "0..*" Promotion : offers
Property "1" -- "0..*" TaxRule : applies

User "0..1" -- "0..1" Employee : may_be
Employee "1" -- "0..*" EmployeeRole : assigned
EmployeeRole "*" -- "1" Role : uses

Guest "1" -- "0..*" Reservation : stays_in
User "0..1" -- "0..*" Reservation : books_as

RoomType "1" -- "0..*" Room : has
Room "1" -- "0..*" RoomStatusHistory : history
RoomType "1" -- "0..*" Photo : showcases
RoomType "1" -- "0..*" RoomTypeAmenity : includes
Amenity "1" -- "0..*" RoomTypeAmenity : available_in

RoomType "1" -- "0..*" RatePlan : offers
RatePlan "1" -- "0..*" DailyRate : prices

Reservation "1" -- "1" RoomType : of_type
Reservation "1" -- "1" RatePlan : uses
Reservation "0..1" -- "1" Room : assigned_to
Reservation "1" -- "0..*" Payment : has
Reservation "1" -- "0..*" ReservationService : uses
Reservation "0..1" -- "1" Promotion : applies

Restaurant "1" -- "0..*" RestaurantArea : has_areas
RestaurantArea "1" -- "0..*" RestaurantTable : contains
Restaurant "1" -- "0..*" TableBooking : receives_bookings
Guest "1" -- "0..*" TableBooking : books_table
TableBooking "0..1" -- "1" RestaurantTable : assigned_to
Reservation "1" -- "0..*" TableBooking : includes

Employee "1" -- "0..*" WorkingShift : has_working_shifts
WorkingShift "1" -- "0..*" Attendance : tracks
Employee "1" -- "0..*" Attendance : has_attendance
Employee "1" -- "0..*" Leave : has_leaves
Employee "1" -- "0..*" EmployeeEvaluation : has_evaluations
Employee "1" -- "0..*" PayRoll : is_paid
Employee "1" -- "0..*" Overtime : has_overtime
Employee "1" -- "0..*" Deduction : has_deductions