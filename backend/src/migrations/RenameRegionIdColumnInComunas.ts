import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRegionIdColumnInComunas1720236801816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Comunas" RENAME COLUMN "regionIDregion" TO "ID_Region"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Comunas" RENAME COLUMN "ID_Region" TO "regionIDregion"`);
  }
}
