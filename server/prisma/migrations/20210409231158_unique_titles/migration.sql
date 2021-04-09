/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[title]` on the table `Item`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item.title_unique" ON "Item"("title");
