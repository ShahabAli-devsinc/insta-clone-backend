import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Comment1735255833994 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comment',
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
            name:"content",
            type:"varchar"
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

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
