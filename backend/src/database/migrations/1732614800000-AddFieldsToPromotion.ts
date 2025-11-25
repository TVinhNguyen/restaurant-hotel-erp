import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldsToPromotion1732614800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reservation.promotions',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '500',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'reservation.promotions',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        length: '500',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'reservation.promotions',
      new TableColumn({
        name: 'active',
        type: 'boolean',
        isNullable: false,
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reservation.promotions', 'active');
    await queryRunner.dropColumn('reservation.promotions', 'notes');
    await queryRunner.dropColumn('reservation.promotions', 'description');
  }
}
