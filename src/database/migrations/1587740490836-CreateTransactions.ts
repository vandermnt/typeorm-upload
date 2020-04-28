import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1587740490836
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'update_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    // await queryRunner.createForeignKey(
    //   'transactions',
    //   new TableForeignKey({
    //     name: 'transactionCategory',
    //     columnNames: ['category_id'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'categories',
    //     // onDelete: 'SET NULL',
    //     // onUpdate: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey('transactions', 'transactionCategory');

    // await queryRunner.dropColumn('transaction', 'category_id');

    await queryRunner.dropTable('transactions');
  }
}
