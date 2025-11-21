import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComprehensiveIndexes1701700004000
  implements MigrationInterface
{
  name = 'AddComprehensiveIndexes1701700004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Auth Schema Indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at)`,
    );

    // Core Schema Indexes - Guests
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_guests_email ON core.guests(email)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_guests_phone ON core.guests(phone)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_guests_created_at ON core.guests(created_at)`,
    );

    // Core Schema Indexes - Properties
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_properties_property_type ON core.properties(property_type)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_properties_city ON core.properties(city)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_properties_country ON core.properties(country)`,
    );

    // Core Schema Indexes - Employees
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employees_user_id ON core.employees(user_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employees_status ON core.employees(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employees_department ON core.employees(department)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employees_position ON core.employees(position)`,
    );

    // Inventory Schema Indexes - Room Types
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON inventory.room_types(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_room_types_name ON inventory.room_types(name)`,
    );

    // Inventory Schema Indexes - Rooms
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON inventory.rooms(room_type_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON inventory.rooms(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_operational_status ON inventory.rooms(operational_status)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_number ON inventory.rooms(number)`,
    );

    // Composite index for room availability
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_rooms_property_type_status 
      ON inventory.rooms(property_id, room_type_id, operational_status)
    `);

    // Reservation Schema Indexes - Reservations
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservation.reservations(guest_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON reservation.reservations(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_room_type_id ON reservation.reservations(room_type_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_assigned_room_id ON reservation.reservations(assigned_room_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservation.reservations(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_code ON reservation.reservations(confirmation_code)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservation.reservations(check_in)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservation.reservations(check_out)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservation.reservations(created_at)`,
    );

    // Composite indexes for common reservation queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_reservations_property_status 
      ON reservation.reservations(property_id, status)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_reservations_property_status_dates 
      ON reservation.reservations(property_id, status, check_in, check_out)
    `);

    // Reservation Schema Indexes - Payments
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON reservation.payments(reservation_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_payments_method ON reservation.payments(method)`,
    );

    // Reservation Schema Indexes - Rate Plans
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rate_plans_property_id ON reservation.rate_plans(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_rate_plans_room_type_id ON reservation.rate_plans(room_type_id)`,
    );

    // Reservation Schema Indexes - Daily Rates
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_daily_rates_rate_plan_id ON reservation.daily_rates(rate_plan_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_daily_rates_date ON reservation.daily_rates(date)`,
    );

    // Reservation Schema Indexes - Promotions
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_promotions_property_id ON reservation.promotions(property_id)`,
    );

    // Reservation Schema Indexes - Tax Rules
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_tax_rules_property_id ON reservation.tax_rules(property_id)`,
    );

    // Reservation Schema Indexes - Property Services
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_property_services_property_id ON reservation.property_services(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_property_services_service_id ON reservation.property_services(service_id)`,
    );

    // Reservation Schema Indexes - Reservation Services
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservation_services_reservation_id ON reservation.reservation_services(reservation_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reservation_services_service_id ON reservation.reservation_services(property_service_id)`,
    );

    // Restaurant Schema Indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_restaurants_property_id ON restaurant.restaurants(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_type ON restaurant.restaurants(cuisine_type)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_restaurant_areas_restaurant_id ON restaurant.restaurant_areas(restaurant_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_restaurant_tables_restaurant_id ON restaurant.restaurant_tables(restaurant_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_restaurant_tables_status ON restaurant.restaurant_tables(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_table_bookings_guest_id ON restaurant.table_bookings(guest_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_table_bookings_status ON restaurant.table_bookings(status)`,
    );

    // HR Schema Indexes - Working Shifts
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_working_shifts_employee_id ON hr.working_shifts(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_working_shifts_property_id ON hr.working_shifts(property_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_working_shifts_working_date ON hr.working_shifts(working_date)`,
    );

    // Composite index for shift scheduling
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_working_shifts_employee_date 
      ON hr.working_shifts(employee_id, working_date)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_working_shifts_property_date 
      ON hr.working_shifts(property_id, working_date)
    `);

    // HR Schema Indexes - Attendance
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON hr.attendance(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_attendance_working_shift_id ON hr.attendance(working_shift_id)`,
    );

    // HR Schema Indexes - Leaves
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_employee_id ON hr.leaves(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_leave_date ON hr.leaves(leave_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_status ON hr.leaves(status)`,
    );

    // HR Schema Indexes - Overtimes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_overtimes_employee_id ON hr.overtimes(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_overtimes_working_shift_id ON hr.overtimes(working_shift_id)`,
    );

    // HR Schema Indexes - Deductions
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_deductions_employee_id ON hr.deductions(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_deductions_date ON hr.deductions(date)`,
    );

    // HR Schema Indexes - Payrolls
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON hr.payrolls(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_payroll_period ON hr.payrolls(period)`,
    );

    // Composite index for payroll processing
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payroll_employee_period 
      ON hr.payrolls(employee_id, period)
    `);

    // HR Schema Indexes - Employee Evaluations
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employee_evaluations_employee_id ON hr.employee_evaluations(employee_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_employee_evaluations_evaluated_by ON hr.employee_evaluations(evaluated_by)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes in reverse order (indices can be dropped in any order, but for consistency)
    const indexes = [
      'idx_users_email',
      'idx_users_created_at',
      'idx_guests_email',
      'idx_guests_phone',
      'idx_guests_created_at',
      'idx_properties_property_type',
      'idx_properties_city',
      'idx_properties_country',
      'idx_employees_user_id',
      'idx_employees_status',
      'idx_employees_department',
      'idx_employees_position',
      'idx_room_types_property_id',
      'idx_room_types_name',
      'idx_rooms_room_type_id',
      'idx_rooms_property_id',
      'idx_rooms_operational_status',
      'idx_rooms_number',
      'idx_rooms_property_type_status',
      'idx_reservations_guest_id',
      'idx_reservations_property_id',
      'idx_reservations_room_type_id',
      'idx_reservations_assigned_room_id',
      'idx_reservations_status',
      'idx_reservations_confirmation_code',
      'idx_reservations_check_in',
      'idx_reservations_check_out',
      'idx_reservations_created_at',
      'idx_reservations_property_status',
      'idx_reservations_property_dates',
      'idx_reservations_property_status_dates',
      'idx_payments_reservation_id',
      'idx_payments_method',
      'idx_rate_plans_property_id',
      'idx_rate_plans_room_type_id',
      'idx_daily_rates_rate_plan_id',
      'idx_daily_rates_date',
      'idx_daily_rates_plan_date',
      'idx_promotions_property_id',
      'idx_tax_rules_property_id',
      'idx_property_services_property_id',
      'idx_property_services_service_id',
      'idx_reservation_services_reservation_id',
      'idx_reservation_services_service_id',
      'idx_restaurants_property_id',
      'idx_restaurants_cuisine_type',
      'idx_restaurant_areas_restaurant_id',
      'idx_restaurant_tables_restaurant_id',
      'idx_restaurant_tables_status',
      'idx_table_bookings_guest_id',
      'idx_table_bookings_status',
      'idx_working_shifts_employee_id',
      'idx_working_shifts_property_id',
      'idx_working_shifts_working_date',
      'idx_working_shifts_employee_date',
      'idx_working_shifts_property_date',
      'idx_attendance_employee_id',
      'idx_attendance_working_shift_id',
      'idx_leaves_employee_id',
      'idx_leaves_leave_date',
      'idx_leaves_status',
      'idx_overtimes_employee_id',
      'idx_overtimes_working_shift_id',
      'idx_deductions_employee_id',
      'idx_deductions_date',
      'idx_payroll_employee_id',
      'idx_payroll_period',
      'idx_payroll_employee_period',
      'idx_employee_evaluations_employee_id',
      'idx_employee_evaluations_evaluated_by',
    ];

    for (const indexName of indexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS ${indexName}`);
    }
  }
}
