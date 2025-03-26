/*
  Warnings:

  - You are about to drop the column `musicLinkId` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `musicLinkId` on the `artists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[linkId]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkId]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linkId` to the `albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkId` to the `artists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_musicLinkId_fkey";

-- DropForeignKey
ALTER TABLE "artists" DROP CONSTRAINT "artists_musicLinkId_fkey";

-- DropIndex
DROP INDEX "albums_musicLinkId_key";

-- DropIndex
DROP INDEX "artists_musicLinkId_key";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "musicLinkId",
ADD COLUMN     "linkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "musicLinkId",
ADD COLUMN     "linkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "albums_linkId_key" ON "albums"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "artists_linkId_key" ON "artists"("linkId");

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "music_links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "music_links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
