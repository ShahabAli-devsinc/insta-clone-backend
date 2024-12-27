import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Like1735255422035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'like',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'postId',
            type: 'int',
          },
          {
            name: 'userId',
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
    await queryRunner.dropTable('like');
  }
}
