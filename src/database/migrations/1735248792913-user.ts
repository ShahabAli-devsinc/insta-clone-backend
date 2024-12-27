import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1735248792913 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'username',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'email',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'password',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'profilePicture',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user")
  }
}
