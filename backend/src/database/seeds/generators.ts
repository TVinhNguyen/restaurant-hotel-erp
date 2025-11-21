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

export const generateProperty = () => ({
    name: faker.company.name() + ' Hotel',
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    phone: faker.phone.number().slice(0, 20),
    email: faker.internet.email(),
    website: faker.internet.url(),
    property_type: faker.helpers.arrayElement(['Hotel', 'Resort', 'Restaurant Chain']),

});

export const generateRoomType = (propertyId: string) => ({
    property_id: propertyId,
    name: faker.helpers.arrayElement(['Standard', 'Deluxe', 'Suite', 'Family Room']),
    description: faker.lorem.sentence(),
    max_adults: faker.number.int({ min: 1, max: 4 }),
    max_children: faker.number.int({ min: 0, max: 2 }),
    base_price: faker.commerce.price({ min: 50, max: 500 }),
    bed_type: faker.helpers.arrayElement(['King', 'Queen', 'Twin', 'Double']),
});

export const generateAmenity = () => ({
    name: faker.word.adjective() + ' ' + faker.word.noun(),
    category: faker.helpers.arrayElement(['room', 'facility']),
});

export const generateRoom = (propertyId: string, roomTypeId: string, floor: number, number: number) => ({
    property_id: propertyId,
    room_type_id: roomTypeId,
    number: `${floor}${number.toString().padStart(2, '0')}`,
    floor: floor.toString(),
    view_type: faker.helpers.arrayElement(['Sea View', 'City View', 'Garden View']),
    operational_status: 'available',
    housekeeping_status: 'clean',
});

export const generateGuest = () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number().slice(0, 20),
    loyalty_tier: faker.helpers.arrayElement(['Bronze', 'Silver', 'Gold', 'Platinum']),
    passport_id: faker.string.alphanumeric(9).toUpperCase(),
    consent_marketing: faker.datatype.boolean(),
});

export const generateRatePlan = (propertyId: string, roomTypeId: string) => ({
    property_id: propertyId,
    room_type_id: roomTypeId,
    name: 'Standard Rate',
    cancellation_policy: 'Free cancellation up to 24h before check-in',
    currency: 'USD',
    min_stay: 1,
    max_stay: 14,
    is_refundable: true,
});

export const generateReservation = (
    propertyId: string,
    guestId: string,
    roomTypeId: string,
    ratePlanId: string,
    roomId: string | null
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
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'checked_in', 'checked_out']),
        room_type_id: roomTypeId,
        rate_plan_id: ratePlanId,
        assigned_room_id: roomId,
        adults: faker.number.int({ min: 1, max: 2 }),
        children: 0,
        currency: 'USD',
        total_amount: faker.commerce.price({ min: 100, max: 1000 }),
        confirmation_code: faker.string.alphanumeric(8).toUpperCase(),
    };
};

export const generateRestaurant = (propertyId: string) => ({
    property_id: propertyId,
    name: faker.company.name() + ' Restaurant',
    description: faker.lorem.sentence(),
    location: 'Ground Floor',
    opening_hours: '07:00 - 22:00',
    cuisine_type: faker.helpers.arrayElement(['Italian', 'Asian', 'French', 'Local']),
});

export const generateTable = (restaurantId: string, number: number) => ({
    restaurant_id: restaurantId,
    table_number: number.toString(),
    capacity: faker.helpers.arrayElement([2, 4, 6, 8]),
    status: 'available',
});

export const generateEmployee = (userId: string) => ({
    user_id: userId,
    employee_code: 'EMP-' + faker.string.numeric(5),
    full_name: faker.person.fullName(),
    department: faker.helpers.arrayElement(['IT Department', 'Human Resources', 'Marketing', 'Finances', 'Sales']),
    status: 'active',
    hire_date: faker.date.past(),
});
