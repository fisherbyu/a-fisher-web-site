/*
  Warnings:

  - Made the column `linkId` on table `MusicItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkId` on table `Playlist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MusicItem" DROP CONSTRAINT "MusicItem_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_linkId_fkey";

-- AlterTable
ALTER TABLE "MusicItem" ALTER COLUMN "linkId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "linkId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MusicItem" ADD CONSTRAINT "MusicItem_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
