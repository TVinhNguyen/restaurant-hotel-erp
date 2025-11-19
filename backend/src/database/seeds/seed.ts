import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import * as generators from './generators';
import * as bcrypt from 'bcryptjs';

async function seed() {
    console.log('Initializing DataSource...');
    await AppDataSource.initialize();
    console.log('DataSource initialized.');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        console.log('Cleaning tables...');
        const tables = [
            'restaurant.table_bookings',
            'restaurant.restaurant_tables',
            'restaurant.restaurant_areas',
            'restaurant.restaurants',
            'reservation.reservation_services',
            'reservation.payments',
            'reservation.reservations',
            'reservation.promotions',
            'reservation.property_services',
            'reservation.services',
            'reservation.daily_rates',
            'reservation.rate_plans',
            'inventory.room_status_history',
            'inventory.rooms',
            'inventory.photos',
            'inventory.room_type_amenities',
            'inventory.amenities',
            'inventory.room_types',
            'core.properties',
            'core.guests',
            'core.employee_roles',
            'core.employees',
            'auth.roles',
            'auth.users',
        ];

        for (const table of tables) {
            await queryRunner.query(`TRUNCATE TABLE ${table} CASCADE`);
        }

        console.log('Seeding Auth & Core...');

        // Roles
        const roles = generators.generateRoles();
        for (const role of roles) {
            await insert(queryRunner, 'auth.roles', role);
        }
        const roleRows = await queryRunner.query('SELECT * FROM auth.roles');
        const roleMap = new Map(roleRows.map((r: any) => [r.name, r.id]));

        // Users (Admin)
        const passwordHash = await bcrypt.hash('password123', 10);
        const adminUser = generators.generateUser(passwordHash);
        adminUser.email = 'admin@example.com'; // Fixed email for login
        const adminId = await insert(queryRunner, 'auth.users', adminUser);

        // Users (Employees)
        const employeeUsers = [];
        for (let i = 0; i < 10; i++) {
            const user = generators.generateUser(passwordHash);
            const id = await insert(queryRunner, 'auth.users', user);
            employeeUsers.push({ ...user, id });
        }

        // Properties
        const properties = [];
        for (let i = 0; i < 3; i++) {
            const prop = generators.generateProperty();
            const id = await insert(queryRunner, 'core.properties', prop);
            properties.push({ ...prop, id });
        }

        // Employees
        const employees = [];
        for (const user of employeeUsers) {
            const emp = generators.generateEmployee(user.id);
            const id = await insert(queryRunner, 'core.employees', emp);
            employees.push({ ...emp, id });

            // Assign Role
            const roleName = emp.department === 'Sales' ? 'Receptionist' :
                emp.department === 'Human Resources' ? 'Property Manager' : 'Property Manager';
            const roleId = roleMap.get(roleName) || roleMap.get('Receptionist');

            await insert(queryRunner, 'core.employee_roles', {
                employee_id: id,
                property_id: properties[0].id,
                role_id: roleId,
                effective_from: new Date(),
            });
        }

        // Guests
        const guests = [];
        for (let i = 0; i < 20; i++) {
            const guest = generators.generateGuest();
            const id = await insert(queryRunner, 'core.guests', guest);
            guests.push({ ...guest, id });
        }

        console.log('Seeding Inventory...');

        // Amenities
        const amenities = [];
        for (let i = 0; i < 10; i++) {
            const amenity = generators.generateAmenity();
            const id = await insert(queryRunner, 'inventory.amenities', amenity);
            amenities.push({ ...amenity, id });
        }

        // Room Types & Rooms
        const roomTypes = [];
        const rooms = [];
        for (const prop of properties) {
            for (let i = 0; i < 3; i++) { // 3 room types per property
                const rt = generators.generateRoomType(prop.id);
                const rtId = await insert(queryRunner, 'inventory.room_types', rt);
                roomTypes.push({ ...rt, id: rtId });

                // Link Amenities
                for (const am of amenities) {
                    if (Math.random() > 0.5) {
                        // Pass null as returningColumn because this table has composite PK and no single ID column
                        await insert(queryRunner, 'inventory.room_type_amenities', {
                            room_type_id: rtId,
                            amenity_id: am.id,
                        }, null);
                    }
                }

                // Rooms - Assign one floor per room type to avoid number collision
                const floor = i + 1;
                for (let num = 1; num <= 5; num++) {
                    const room = generators.generateRoom(prop.id, rtId, floor, num);
                    const rId = await insert(queryRunner, 'inventory.rooms', room);
                    rooms.push({ ...room, id: rId });
                }
            }
        }

        console.log('Seeding Reservations...');

        // Rate Plans
        const ratePlans = [];
        for (const rt of roomTypes) {
            const rp = generators.generateRatePlan(rt.property_id, rt.id);
            const rpId = await insert(queryRunner, 'reservation.rate_plans', rp);
            ratePlans.push({ ...rp, id: rpId });

            // Daily Rates (Next 30 days)
            const today = new Date();
            for (let d = 0; d < 30; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() + d);
                await insert(queryRunner, 'reservation.daily_rates', {
                    rate_plan_id: rpId,
                    date: date,
                    price: rt.base_price,
                    available_rooms: 5,
                });
            }
        }

        // Reservations
        for (let i = 0; i < 20; i++) {
            const guest = guests[Math.floor(Math.random() * guests.length)];
            const rt = roomTypes[Math.floor(Math.random() * roomTypes.length)];
            const rp = ratePlans.find(r => r.room_type_id === rt.id);
            if (!rp) continue;

            const res = generators.generateReservation(rt.property_id, guest.id, rt.id, rp.id, null);
            const resId = await insert(queryRunner, 'reservation.reservations', res);

            // Payment
            await insert(queryRunner, 'reservation.payments', {
                reservation_id: resId,
                amount: res.total_amount,
                currency: 'USD',
                method: 'card',
                status: 'captured',
                paid_at: new Date(),
            });
        }

        console.log('Seeding Restaurants...');
        for (const prop of properties) {
            const rest = generators.generateRestaurant(prop.id);
            const restId = await insert(queryRunner, 'restaurant.restaurants', rest);

            for (let i = 1; i <= 10; i++) {
                const table = generators.generateTable(restId, i);
                await insert(queryRunner, 'restaurant.restaurant_tables', table);
            }
        }

        await queryRunner.commitTransaction();
        console.log('Seeding completed successfully.');
    } catch (err) {
        console.error('Seeding failed:', err);
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
        await AppDataSource.destroy();
    }
}

async function insert(queryRunner: any, table: string, data: any, returningColumn: string | null = 'id') {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const returningClause = returningColumn ? `RETURNING ${returningColumn}` : '';
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ${returningClause}`;
    try {
        const result = await queryRunner.query(sql, values);
        return returningColumn ? result[0]?.[returningColumn] : null;
    } catch (err) {
        console.error(`Error inserting into ${table}:`, err);
        console.error('Data keys:', Object.keys(data));
        throw err;
    }
}

seed();
