import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class UserToPostRelation1735283329493 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'post',
            new TableForeignKey({
                columnNames:['userId'],
                referencedColumnNames:['id'],
                referencedTableName:'user',
                onDelete:"CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("post")
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
        if (foreignKey) {
            await queryRunner.dropForeignKey('post',foreignKey)
        }
    }
}
