import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Post1735255250572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "post",
            new TableColumn({
                name:"userId",
                type:"int"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("post","userId")
    }

}
