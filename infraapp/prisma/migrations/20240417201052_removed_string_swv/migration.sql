/*
  Warnings:

  - You are about to drop the column `latest_release` on the `SoftwareVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SoftwareVersion" DROP COLUMN "latest_release";
