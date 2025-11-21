import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProperties1701700002000 implements MigrationInterface {
  name = 'AlterProperties1701700002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop check_in_time and check_out_time from properties
    await queryRunner.query(`
      ALTER TABLE core.properties
      DROP COLUMN IF EXISTS check_in_time,
      DROP COLUMN IF EXISTS check_out_time
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore check_in_time and check_out_time columns
    await queryRunner.query(`
      ALTER TABLE core.properties
      ADD COLUMN check_in_time TIME,
      ADD COLUMN check_out_time TIME
    `);
  }
}
