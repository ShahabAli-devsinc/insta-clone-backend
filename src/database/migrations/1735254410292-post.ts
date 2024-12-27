import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Post1735254410292 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name:"imageUrl",
            type:"varchar",
          },
          {
            name:"caption",
            type:"varchar"
          },
          {
            name:"createdAt",
            type:"timestamp",
            default:"now()"
          },
          {
            name:"updatedAt",
            type:"timestamp",
            default:"now()"
          }
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
