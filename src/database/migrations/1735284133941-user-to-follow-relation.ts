import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UserToFollowRelation1735284133941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.renameColumn("follow","createdAt","followedAt")

    await queryRunner.addColumn(
      'follow',
      new TableColumn({
        name: 'followerId',
        type: 'int',
      }),
    );

    await queryRunner.addColumn(
      'follow',
      new TableColumn({
        name: 'followingId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'follow',
      new TableForeignKey({
        columnNames: ['followerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'follow',
      new TableForeignKey({
        columnNames: ['followingId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('follow')
    const followerForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('followerId') !== -1)
    if (followerForeignKey) {
        await queryRunner.dropForeignKey('follow',followerForeignKey)
    }

    const followingForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("followingId") !== -1)
    if (followingForeignKey) {
        await queryRunner.dropForeignKey('follow',followingForeignKey)
    }

    await queryRunner.dropColumn('follow','followingId')

    await queryRunner.dropColumn('follow',"followerId")

    await queryRunner.renameColumn("follow","followedAt","createdAt")

  }
}
