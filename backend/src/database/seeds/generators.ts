import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

export const generateRoles = () => [
  {
    name: 'Admin',
    description: 'Global administrator',
    scope: 'global',
  },
  {
    name: 'Property Manager',
    description: 'Manager of a specific property',
    scope: 'per_property',
  },
  {
    name: 'Receptionist',
    description: 'Front desk staff',
    scope: 'per_property',
  },
  {
    name: 'Housekeeper',
    description: 'Housekeeping staff',
    scope: 'per_property',
  },
];

export const generateUser = (passwordHash: string) => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  phone: faker.phone.number().slice(0, 20),
  password_hash: passwordHash,
});

export const generateProperty = () => {
  const properties = [
    {
      name: 'Mường Thanh Grand Hà Nội',
      address: '60 Nguyễn Chí Thanh',
      city: 'Hà Nội',
      country: 'Việt Nam',
      phone: '0243 8585555',
      email: 'hanoi@muongthanh.vn',
      type: 'Hotel',
    },
    {
      name: 'Mường Thanh Luxury Sài Gòn',
      address: '235 Nguyễn Văn Cừ',
      city: 'Hồ Chí Minh',
      country: 'Việt Nam',
      phone: '0283 8969696',
      email: 'saigon@muongthanh.vn',
      type: 'Hotel',
    },
    {
      name: 'Mường Thanh Grand Đà Nẵng',
      address: '270 Võ Nguyên Giáp',
      city: 'Đà Nẵng',
      country: 'Việt Nam',
      phone: '0236 3981888',
      email: 'danang@muongthanh.vn',
      type: 'Hotel',
    },
    {
      name: 'Mường Thanh Holiday Nha Trang',
      address: '42 Trần Phú',
      city: 'Nha Trang',
      country: 'Việt Nam',
      phone: '0258 3524999',
      email: 'nhatrang@muongthanh.vn',
      type: 'Resort',
    },
    {
      name: 'Mường Thanh Grand Vinh',
      address: '2 Lê Lợi',
      city: 'Vinh',
      country: 'Việt Nam',
      phone: '0238 3588999',
      email: 'vinh@muongthanh.vn',
      type: 'Hotel',
    },
    {
      name: 'Mường Thanh Luxury Cần Thơ',
      address: '1 Hai Bà Trưng',
      city: 'Cần Thơ',
      country: 'Việt Nam',
      phone: '0292 3761888',
      email: 'cantho@muongthanh.vn',
      type: 'Hotel',
    },
  ];
  
  const property = faker.helpers.arrayElement(properties);
  
  return {
    name: property.name,
    address: property.address,
    city: property.city,
    country: property.country,
    phone: property.phone,
    email: property.email,
    website: 'https://muongthanh.vn',
    property_type: property.type,
  };
};

export const generateRoomType = (propertyId: string) => {
  const roomTypes = [
    { 
      name: 'Superior', 
      description: 'Phòng Superior với diện tích 28-32m², trang bị đầy đủ tiện nghi cơ bản, phù hợp cho khách du lịch và công tác', 
      price: 850000,
      maxAdults: 2,
      maxChildren: 1,
    },
    { 
      name: 'Deluxe', 
      description: 'Phòng Deluxe rộng 32-38m², view đẹp hướng thành phố hoặc biển, nội thất cao cấp và hiện đại', 
      price: 1200000,
      maxAdults: 2,
      maxChildren: 2,
    },
    { 
      name: 'Executive', 
      description: 'Phòng Executive 40-45m² với không gian làm việc riêng, phù hợp cho khách doanh nhân', 
      price: 1600000,
      maxAdults: 2,
      maxChildren: 2,
    },
    { 
      name: 'Suite', 
      description: 'Phòng Suite 50-70m² với phòng khách riêng biệt, ban công rộng, view panorama tuyệt đẹp', 
      price: 2500000,
      maxAdults: 3,
      maxChildren: 2,
    },
    { 
      name: 'Presidential Suite', 
      description: 'Phòng Presidential Suite sang trọng 100-150m² với phòng ăn riêng, phòng làm việc và đầy đủ tiện nghi 5 sao', 
      price: 5000000,
      maxAdults: 4,
      maxChildren: 2,
    },
  ];
  
  const roomType = faker.helpers.arrayElement(roomTypes);
  
  return {
    property_id: propertyId,
    name: roomType.name,
    description: roomType.description,
    max_adults: roomType.maxAdults,
    max_children: roomType.maxChildren,
    base_price: roomType.price,
    bed_type: faker.helpers.arrayElement(['Giường King', 'Giường Queen', '2 Giường Đơn']),
  };
};

export const generateAmenity = () => {
  const roomAmenities = [
    'WiFi tốc độ cao miễn phí',
    'Điều hòa nhiệt độ',
    'TV LED 43 inch',
    'Minibar',
    'Két an toàn điện tử',
    'Máy sấy tóc Panasonic',
    'Dép đi trong phòng',
    'Áo choàng tắm cao cấp',
    'Bàn làm việc',
    'Ban công view đẹp',
    'Nước uống miễn phí',
    'Điện thoại IDD',
    'Bộ ấm đun nước',
    'Bàn ủi & bàn là',
  ];
  
  const facilityAmenities = [
    'Hồ bơi ngoài trời',
    'Phòng Gym hiện đại',
    'Spa & Massage trị liệu',
    'Nhà hàng buffet',
    'Sky Bar tầng thượng',
    'Bãi đậu xe miễn phí',
    'Dịch vụ giặt ủi 24/7',
    'Lễ tân 24/7',
    'Dịch vụ đưa đón sân bay',
    'Phòng họp & hội nghị',
    'Karaoke VIP',
    'Coffee Shop',
    'Thang máy tốc độ cao',
    'An ninh 24/7',
  ];
  
  const category = faker.helpers.arrayElement(['room', 'facility']);
  const amenities = category === 'room' ? roomAmenities : facilityAmenities;
  
  return {
    name: faker.helpers.arrayElement(amenities),
    category: category,
  };
};

export const generateRoom = (
  propertyId: string,
  roomTypeId: string,
  floor: number,
  number: number,
) => ({
  property_id: propertyId,
  room_type_id: roomTypeId,
  number: `${floor}${number.toString().padStart(2, '0')}`,
  floor: floor.toString(),
  view_type: faker.helpers.arrayElement([
    'View Biển',
    'View Thành Phố',
    'View Vườn',
    'View Hồ Bơi',
    'View Núi',
  ]),
  operational_status: 'available',
  housekeeping_status: 'clean',
});

export const generateGuest = () => {
  const isMale = faker.datatype.boolean();
  const firstName = isMale 
    ? faker.helpers.arrayElement(['Văn', 'Đức', 'Minh', 'Hoàng', 'Quang', 'Tuấn', 'Hải', 'Anh', 'Thành', 'Dũng', 'Khoa', 'Long', 'Nam', 'Phong', 'Sơn'])
    : faker.helpers.arrayElement(['Thị', 'Thu', 'Hồng', 'Lan', 'Hương', 'Mai', 'Linh', 'Nga', 'Trang', 'Phương', 'Nhung', 'Ly', 'My', 'Vy', 'Chi']);
  
  const lastName = faker.helpers.arrayElement(['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Võ', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương']);
  const middleName = faker.helpers.arrayElement(['Văn', 'Thị', 'Hữu', 'Công', 'Quốc', 'Minh', 'Đức', 'Thanh', 'Bảo', 'Kim']);
  
  const fullName = `${lastName} ${middleName} ${firstName}`;
  
  return {
    name: fullName,
    email: faker.internet.email(),
    phone: '0' + faker.string.numeric(9),
    loyalty_tier: faker.helpers.arrayElement([
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
    ]),
    passport_id: faker.string.alphanumeric(9).toUpperCase(),
    consent_marketing: faker.datatype.boolean(),
  };
};

export const generateRatePlan = (propertyId: string, roomTypeId: string) => {
  const ratePlans = [
    {
      name: 'Best Available Rate (BAR)',
      policy: 'Miễn phí hủy phòng trước 24 giờ nhận phòng. Hủy muộn hoặc không đến sẽ bị tính phí 1 đêm',
      minStay: 1,
      maxStay: 30,
      refundable: true,
    },
    {
      name: 'Non-Refundable Rate',
      policy: 'Không hoàn tiền khi hủy phòng. Giá ưu đãi hơn BAR 15-20%',
      minStay: 1,
      maxStay: 30,
      refundable: false,
    },
    {
      name: 'Early Bird - Đặt sớm giảm 30%',
      policy: 'Đặt trước 30 ngày. Miễn phí hủy trước 14 ngày nhận phòng',
      minStay: 2,
      maxStay: 30,
      refundable: true,
    },
    {
      name: 'Weekend Package',
      policy: 'Áp dụng thứ 6-7-CN. Miễn phí hủy trước 48 giờ',
      minStay: 2,
      maxStay: 3,
      refundable: true,
    },
    {
      name: 'Long Stay - Ở dài giảm giá',
      policy: 'Ở từ 5 đêm trở lên. Miễn phí hủy trước 72 giờ',
      minStay: 5,
      maxStay: 30,
      refundable: true,
    },
  ];

  const plan = faker.helpers.arrayElement(ratePlans);

  return {
    property_id: propertyId,
    room_type_id: roomTypeId,
    name: plan.name,
    cancellation_policy: plan.policy,
    currency: 'VND',
    min_stay: plan.minStay,
    max_stay: plan.maxStay,
    is_refundable: plan.refundable,
  };
};

export const generateReservation = (
  propertyId: string,
  guestId: string,
  roomTypeId: string,
  ratePlanId: string,
  roomId: string | null,
) => {
  const checkIn = faker.date.future();
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + faker.number.int({ min: 1, max: 5 }));

  return {
    property_id: propertyId,
    guest_id: guestId,
    channel: faker.helpers.arrayElement(['ota', 'website', 'walkin', 'phone']),
    check_in: checkIn,
    check_out: checkOut,
    status: faker.helpers.arrayElement([
      'pending',
      'confirmed',
      'checked_in',
      'checked_out',
    ]),
    room_type_id: roomTypeId,
    rate_plan_id: ratePlanId,
    assigned_room_id: roomId,
    adults: faker.number.int({ min: 1, max: 2 }),
    children: 0,
    currency: 'VND',
    total_amount: faker.number.int({ min: 500000, max: 5000000 }),
    confirmation_code: faker.string.alphanumeric(8).toUpperCase(),
  };
};

export const generateRestaurant = (propertyId: string) => {
  const restaurants = [
    {
      name: 'Nhà Hàng Mường Thanh',
      description: 'Nhà hàng buffet quốc tế với hơn 100 món ăn Á - Âu, sức chứa 300 khách',
      location: 'Tầng 1',
      hours: '06:00 - 10:00, 11:30 - 14:00, 18:00 - 22:00',
      cuisine: 'Buffet Quốc Tế',
    },
    {
      name: 'Nhà Hàng Việt',
      description: 'Chuyên các món ăn truyền thống Việt Nam với nguyên liệu tươi ngon',
      location: 'Tầng 2',
      hours: '11:00 - 14:00, 17:30 - 22:00',
      cuisine: 'Món Việt',
    },
    {
      name: 'Sky Lounge & Bar',
      description: 'Quầy bar tầng thượng với view toàn cảnh thành phố, phục vụ cocktail và đồ uống cao cấp',
      location: 'Tầng Thượng',
      hours: '17:00 - 02:00',
      cuisine: 'Bar & Đồ Uống',
    },
    {
      name: 'Coffee Shop Mường Thanh',
      description: 'Quán cà phê phục vụ cà phê Việt, trà và bánh ngọt tại sảnh khách sạn',
      location: 'Sảnh Chính',
      hours: '06:00 - 23:00',
      cuisine: 'Café & Bánh Ngọt',
    },
  ];
  
  const restaurant = faker.helpers.arrayElement(restaurants);
  
  return {
    property_id: propertyId,
    name: restaurant.name,
    description: restaurant.description,
    location: restaurant.location,
    opening_hours: restaurant.hours,
    cuisine_type: restaurant.cuisine,
  };
};

export const generateTable = (restaurantId: string, number: number) => ({
  restaurant_id: restaurantId,
  table_number: number.toString(),
  capacity: faker.helpers.arrayElement([2, 4, 6, 8]),
  status: 'available',
});

export const generateEmployee = (userId: string, department?: string) => {
  const isMale = faker.datatype.boolean();
  const firstName = isMale 
    ? faker.helpers.arrayElement(['Văn', 'Đức', 'Minh', 'Hoàng', 'Quang', 'Tuấn', 'Hải', 'Anh', 'Thành', 'Dũng'])
    : faker.helpers.arrayElement(['Thị', 'Thu', 'Hồng', 'Lan', 'Hương', 'Mai', 'Linh', 'Nga', 'Trang', 'Phương']);
  
  const lastName = faker.helpers.arrayElement(['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Võ', 'Phan', 'Vũ', 'Đặng']);
  const middleName = faker.helpers.arrayElement(['Văn', 'Thị', 'Hữu', 'Công', 'Quốc', 'Minh', 'Đức', 'Thanh']);
  
  const fullName = `${lastName} ${middleName} ${firstName}`;
  
  const addresses = [
    'Số 45 Trần Hưng Đạo, Quận 1, Hồ Chí Minh',
    'Số 123 Lê Lợi, Quận Hai Bà Trưng, Hà Nội',
    'Số 89 Nguyễn Huệ, Quận Hải Châu, Đà Nẵng',
    'Số 234 Trần Phú, Quận Ninh Kiều, Cần Thơ',
    'Số 67 Hai Bà Trưng, Quận 3, Hồ Chí Minh',
    'Số 156 Lý Thường Kiệt, Quận 10, Hồ Chí Minh',
    'Số 78 Võ Văn Tần, Quận Tân Bình, Hồ Chí Minh',
    'Số 345 Điện Biên Phủ, Quận Bình Thạnh, Hồ Chí Minh',
    'Số 23 Phan Đình Phùng, Quận Ba Đình, Hà Nội',
    'Số 91 Hoàng Văn Thụ, Thành phố Vinh, Nghệ An',
  ];
  
  const address = faker.helpers.arrayElement(addresses);
  
  return {
    user_id: userId,
    employee_code: 'NV-' + faker.string.numeric(5),
    full_name: fullName,
    department: department || faker.helpers.arrayElement([
      'Front Desk',
      'Housekeeping',
      'HR',
      'F&B',
    ]),
    position: department === 'Front Desk' 
      ? faker.helpers.arrayElement(['Lễ tân', 'Trưởng ca lễ tân', 'Nhân viên tiếp tân', 'Quản lý Reception'])
      : department === 'Housekeeping'
      ? faker.helpers.arrayElement(['Nhân viên buồng phòng', 'Trưởng bộ phận Housekeeping', 'Giám sát buồng phòng', 'Room Attendant'])
      : department === 'HR'
      ? faker.helpers.arrayElement(['Nhân viên nhân sự', 'Trưởng phòng Nhân sự', 'Chuyên viên tuyển dụng', 'HR Manager'])
      : faker.helpers.arrayElement(['Nhân viên phục vụ', 'Bếp trưởng', 'Sous Chef', 'Trưởng ca nhà hàng', 'Bartender', 'Phụ bếp']),
    status: 'active',
    hire_date: faker.date.past({ years: 3 }),
    address: address,
    gender: isMale ? 'male' : 'female',
    date_of_birth: faker.date.birthdate({ min: 20, max: 50, mode: 'age' }),
    id_card_number: faker.string.numeric(12),
  };
};

