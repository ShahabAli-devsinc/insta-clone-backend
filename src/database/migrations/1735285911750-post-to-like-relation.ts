import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class PostToLikeRelation1735285911750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'like',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('like');

    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );

    if (userForeignKey) {
      await queryRunner.dropForeignKey('like', userForeignKey);
    }
  }
}
