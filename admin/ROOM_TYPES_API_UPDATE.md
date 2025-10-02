# Room Types API Integration - Summary

## Tổng quan
Đã cập nhật thành công tất cả các trang trong `admin/src/app/inventory-management/room-types/` để sử dụng API thực tế theo cấu trúc trong `setupapiforadmin.md`, tương tự như cách `hr-management/create` fetch API.

## Các file đã cập nhật

### 1. Create Page (`create/page.tsx`)
**Thay đổi chính:**
- Thêm state `loading` để quản lý trạng thái loading
- Chuyển `handleFinish` từ sync sang async function
- Thêm API call để tạo room type mới:
  - POST `/room-types` với dữ liệu: `property_id`, `name`, `description`, `max_adults`, `max_children`, `base_price`, `bed_type`
- Thêm API call để gán amenities (nếu có):
  - POST `/room-types/:id/amenities/bulk` với `amenity_ids`
- Xử lý error và success messages
- Cập nhật mock data sau khi tạo thành công

**API Endpoints sử dụng:**
- `POST ${API_ENDPOINT}/room-types`
- `POST ${API_ENDPOINT}/room-types/:id/amenities/bulk`

### 2. Edit Page (`edit/[id]/page.tsx`)
**Thay đổi chính:**
- Thêm state `roomTypeData` để lưu dữ liệu từ API
- Thêm `useEffect` để fetch room type data khi component mount:
  - GET `/room-types/:id`
- Cập nhật `handleFinish` để:
  - PUT `/room-types/:id` với dữ liệu cập nhật
  - Fetch danh sách amenities hiện tại: GET `/room-types/:id/amenities`
  - Thêm amenities mới: POST `/room-types/:id/amenities/bulk`
  - Xóa amenities cũ: DELETE `/room-types/:id/amenities/:amenity_id`
- Cập nhật form fields: thay thế `capacity`, `bedConfiguration`, `size`, `status` bằng `maxAdults`, `maxChildren`, `bedType`
- Xử lý loading state và error messages

**API Endpoints sử dụng:**
- `GET ${API_ENDPOINT}/room-types/:id`
- `PUT ${API_ENDPOINT}/room-types/:id`
- `GET ${API_ENDPOINT}/room-types/:id/amenities`
- `POST ${API_ENDPOINT}/room-types/:id/amenities/bulk`
- `DELETE ${API_ENDPOINT}/room-types/:id/amenities/:amenity_id`

### 3. List Page (`page.tsx`)
**Thay đổi chính:**
- Thêm import `useEffect` từ React
- Khởi tạo state với empty array thay vì mock data
- Thêm state `loading`
- Thêm `useEffect` để fetch room types khi component mount
- Thêm function `fetchRoomTypes`:
  - Loop qua tất cả properties
  - GET `/room-types?property_id=${property.id}` cho mỗi property
  - Transform API response để match với UI format
  - Fallback về mock data nếu có lỗi
- Cập nhật `handleDelete` để:
  - DELETE `/room-types/:id`
  - Cập nhật local state sau khi xóa thành công
- Thêm `loading` prop vào `tableProps`

**API Endpoints sử dụng:**
- `GET ${API_ENDPOINT}/room-types?property_id=${property.id}`
- `DELETE ${API_ENDPOINT}/room-types/:id`

### 4. Show Page (`show/[id]/page.tsx`)
**Thay đổi chính:**
- Thêm import `useState` và `useEffect`
- Thay thế việc lấy dữ liệu từ mock bằng state `roomType` và `loading`
- Thêm `useEffect` để fetch room type khi component mount:
  - GET `/room-types/:id`
  - Transform API response để match UI format
- Cập nhật hiển thị thông tin:
  - Thay `capacity`, `bedConfiguration`, `size`, `status` bằng `maxAdults`, `maxChildren`, `bedType`, `totalRooms`
  - Hiển thị amenities trực tiếp từ API response (đã bao gồm đầy đủ thông tin)
- Hiển thị loading state khi đang fetch data

**API Endpoints sử dụng:**
- `GET ${API_ENDPOINT}/room-types/:id`

## Cấu trúc API Response

### Room Type Object từ API:
```typescript
{
  id: string,
  property_id: string,
  name: string,
  description: string,
  max_adults: number,
  max_children: number,
  base_price: number,
  bed_type: string,
  amenities: Array<{
    id: string,
    name: string,
    category: 'room' | 'facility',
    description: string
  }>,
  photos: Array<any>,
  rooms: Array<any>,
  total_rooms: number,
  available_rooms: number
}
```

## Authorization
Tất cả API calls đều sử dụng Bearer token từ localStorage:
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

## Error Handling
- Tất cả API calls đều có try-catch
- Hiển thị error messages qua `message.error()`
- Fallback về mock data cho List page nếu API fails
- Log errors ra console để debug

## Mapping giữa UI và API
| UI Field | API Field |
|----------|-----------|
| propertyId | property_id |
| maxAdults | max_adults |
| maxChildren | max_children |
| basePrice | base_price |
| bedType | bed_type |
| totalRooms | total_rooms |
| availableRooms | available_rooms |

## Testing Checklist
- [ ] Tạo room type mới với amenities
- [ ] Tạo room type không có amenities
- [ ] Xem danh sách room types
- [ ] Filter room types theo property
- [ ] Search room types
- [ ] Xem chi tiết room type
- [ ] Chỉnh sửa room type (thêm/xóa amenities)
- [ ] Xóa room type
- [ ] Kiểm tra error handling khi API fails
- [ ] Kiểm tra loading states

## Notes
- Mock data vẫn được giữ lại để fallback và để các component khác vẫn hoạt động
- Environment variable `NEXT_PUBLIC_API_ENDPOINT` phải được set trong `.env.local`
- Tất cả các API calls đều async và sử dụng loading states
- UI vẫn tương thích với cả mock data và real API data
