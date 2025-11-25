import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

async function verify() {
  const options = AppDataSource.options;
  console.log('------------------------------------------------');
  console.log('ĐANG KẾT NỐI TỚI:');
  console.log(`HOST:     ${(options as any).host}`);
  console.log(`DATABASE: ${(options as any).database}`);
  console.log(`USERNAME: ${(options as any).username}`);
  console.log('------------------------------------------------');

  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const tables = [
    'auth.roles',
    'auth.users',
    'core.properties',
    'core.employees',
    'core.guests',
    'inventory.amenities',
    'inventory.room_types',
    'inventory.rooms',
    'inventory.room_type_amenities',
    'reservation.rate_plans',
    'reservation.daily_rates',
    'reservation.reservations',
    'reservation.payments',
    'restaurant.restaurants',
    'restaurant.restaurant_tables',
  ];

  console.log('Verifying row counts...');
  for (const table of tables) {
    const count = await queryRunner.query(
      `SELECT COUNT(*) as count FROM ${table}`,
    );
    console.log(`${table}: ${count[0].count}`);
  }

  await queryRunner.release();
  await AppDataSource.destroy();
}

verify();
