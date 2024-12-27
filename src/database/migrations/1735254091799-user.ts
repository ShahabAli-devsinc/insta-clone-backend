import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class User1735254091799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name:"bio",
                type:"varchar",
                isNullable:true
            })
,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "user","bio"
        )
    }

}
