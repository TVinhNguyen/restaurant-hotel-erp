import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldsToEmployee1734691200000 implements MigrationInterface {
  name = 'AddFieldsToEmployee1734691200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'core.employees',
      new TableColumn({
        name: 'address',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'core.employees',
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'core.employees',
      new TableColumn({
        name: 'date_of_birth',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'core.employees',
      new TableColumn({
        name: 'id_card_number',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('core.employees', 'id_card_number');
    await queryRunner.dropColumn('core.employees', 'date_of_birth');
    await queryRunner.dropColumn('core.employees', 'gender');
    await queryRunner.dropColumn('core.employees', 'address');
  }
}
