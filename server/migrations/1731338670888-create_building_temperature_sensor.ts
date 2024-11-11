import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBuildingTemperatureSensor1731338670888 implements MigrationInterface {
    name = 'CreateBuildingTemperatureSensor1731338670888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temperature_sensor" ("id" SERIAL NOT NULL, "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "location" character varying NOT NULL, "temperature" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "buildingId" integer, CONSTRAINT "PK_51005ecb0763f218ad836afc013" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "building" ("id" SERIAL NOT NULL, "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_bbfaf6c11f141a22d2ab105ee5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "temperature_sensor" ADD CONSTRAINT "FK_19ff13d0903021f22a3d8abf0ec" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "temperature_sensor" DROP CONSTRAINT "FK_19ff13d0903021f22a3d8abf0ec"`);
        await queryRunner.query(`DROP TABLE "building"`);
        await queryRunner.query(`DROP TABLE "temperature_sensor"`);
    }

}
