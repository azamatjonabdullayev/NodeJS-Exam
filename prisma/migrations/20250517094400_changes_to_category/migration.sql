/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "PlanTier" ADD VALUE 'TRIAL';

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
