import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRegionIdColumnInComunas1610000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renombrar la columna en la tabla 'Comunas'
        await queryRunner.renameColumn('Comunas', 'regionIDregion', 'ID_Region');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir el cambio si es necesario
        await queryRunner.renameColumn('Comunas', 'ID_Region', 'regionIDregion');
    }
}
