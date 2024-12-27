import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Follow1735282557208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follow',
        columns: [
          {
            name: 'id',
            isGenerated: true,
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('follow');
  }
}
