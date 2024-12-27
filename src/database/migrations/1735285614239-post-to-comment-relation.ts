import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class PostToCommentRelation1735285614239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'comment',
            new TableForeignKey({
                columnNames:['postId'],
                referencedColumnNames:['id'],
                referencedTableName:'post',
                onDelete:"CASCADE"
            })
        )

        await queryRunner.createForeignKey(
            'comment',
            new TableForeignKey({
                columnNames:['userId'],
                referencedColumnNames:['id'],
                referencedTableName:'user',
                onDelete:'CASCADE'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('comment')

        const postForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('postId') !== -1)

        if (postForeignKey) {
            await queryRunner.dropForeignKey('comment',postForeignKey)
        }

        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)

        if (postForeignKey) {
            await queryRunner.dropForeignKey('comment',userForeignKey)
        }
    }

}
