import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class PostToLikeRelation1735285355559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'like',
            new TableForeignKey({
                columnNames:['postId'],
                referencedColumnNames:['id'],
                referencedTableName:'post',
                onDelete:'CASCADE'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('like')

        const postForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('postId') !== -1)

        if (postForeignKey) {
            await queryRunner.dropForeignKey('like',postForeignKey)
        }
    }

}
