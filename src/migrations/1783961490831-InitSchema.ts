import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1783961490831 implements MigrationInterface {
    name = 'InitSchema1783961490831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "duration" integer NOT NULL, "price" decimal(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" varchar PRIMARY KEY NOT NULL, "customerName" varchar NOT NULL, "customerEmail" varchar NOT NULL, "customerPhone" varchar, "serviceId" varchar NOT NULL, "bookingDate" date NOT NULL, "bookingTime" time NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_bookings" ("id" varchar PRIMARY KEY NOT NULL, "customerName" varchar NOT NULL, "customerEmail" varchar NOT NULL, "customerPhone" varchar, "serviceId" varchar NOT NULL, "bookingDate" date NOT NULL, "bookingTime" time NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_15a2431ec10d29dcd96c9563b65" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_bookings"("id", "customerName", "customerEmail", "customerPhone", "serviceId", "bookingDate", "bookingTime", "status", "notes", "createdAt", "updatedAt") SELECT "id", "customerName", "customerEmail", "customerPhone", "serviceId", "bookingDate", "bookingTime", "status", "notes", "createdAt", "updatedAt" FROM "bookings"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`ALTER TABLE "temporary_bookings" RENAME TO "bookings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" RENAME TO "temporary_bookings"`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" varchar PRIMARY KEY NOT NULL, "customerName" varchar NOT NULL, "customerEmail" varchar NOT NULL, "customerPhone" varchar, "serviceId" varchar NOT NULL, "bookingDate" date NOT NULL, "bookingTime" time NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "bookings"("id", "customerName", "customerEmail", "customerPhone", "serviceId", "bookingDate", "bookingTime", "status", "notes", "createdAt", "updatedAt") SELECT "id", "customerName", "customerEmail", "customerPhone", "serviceId", "bookingDate", "bookingTime", "status", "notes", "createdAt", "updatedAt" FROM "temporary_bookings"`);
        await queryRunner.query(`DROP TABLE "temporary_bookings"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
