import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

async function inspect() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const table = await queryRunner.getTable('core.properties');
  if (table) {
    console.log(
      'Columns in core.properties:',
      table.columns.map((c) => c.name),
    );
  } else {
    console.log('Table core.properties does not exist');
  }

  await queryRunner.release();
  await AppDataSource.destroy();
}

inspect();
