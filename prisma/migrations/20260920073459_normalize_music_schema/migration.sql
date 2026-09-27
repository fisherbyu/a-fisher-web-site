-- Normalize Music Schema
-- Hand-written: moves existing data into the new structure before dropping old tables/columns.
-- Wrapped in a transaction: any failure rolls back everything.

BEGIN;

-- ============================================================
-- 1. Create new types and tables
-- ============================================================

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('S', 'A', 'B', 'C');

-- CreateTable
CREATE TABLE "MusicItem" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER,
    "linkId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicItemGenre" (
    "musicItemId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "MusicItemGenre_pkey" PRIMARY KEY ("musicItemId", "genreId")
);

-- CreateTable
CREATE TABLE "RankingList" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "artistId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingEntry" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "musicItemId" INTEGER NOT NULL,
    "tier" "Tier",
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankingEntry_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- 2. Shift Album IDs past Artist IDs (shared MusicItem ID space)
-- Artist IDs are preserved so /artist/:id URLs don't change.
-- Two steps avoid PK collisions mid-update.
-- Existing ON UPDATE CASCADE FKs carry Link/Image/Content/Attribute along.
-- ============================================================

UPDATE "Album" SET "id" = -"id";
UPDATE "Album" SET "id" = -"id" + (SELECT MAX("id") FROM "Artist");

-- ============================================================
-- 3. Create MusicItems (image/link ownership flips to MusicItem)
-- ============================================================

INSERT INTO "MusicItem" ("id", "imageId", "linkId", "createdAt", "updatedAt")
SELECT a."id", i."id", l."id", a."createdAt", a."updatedAt"
FROM "Artist" a
LEFT JOIN "Image" i ON i."artistId" = a."id"
LEFT JOIN "Link" l ON l."artistId" = a."id";

INSERT INTO "MusicItem" ("id", "imageId", "linkId", "createdAt", "updatedAt")
SELECT al."id", i."id", l."id", al."createdAt", al."updatedAt"
FROM "Album" al
LEFT JOIN "Image" i ON i."albumId" = al."id"
LEFT JOIN "Link" l ON l."albumId" = al."id";

-- Move the MusicItem sequence past the manually inserted IDs
SELECT setval(pg_get_serial_sequence('"MusicItem"', 'id'), (SELECT MAX("id") FROM "MusicItem"));

-- ============================================================
-- 4. Artist: new array columns, populated from Content/Attribute
-- ============================================================

ALTER TABLE "Artist"
    ADD COLUMN "contents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "favoriteTracks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "favoriteAlbums" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "Artist" a
SET "contents" = c."arr"
FROM (
    SELECT "artistId", array_agg("text" ORDER BY "order") AS "arr"
    FROM "Content"
    WHERE "artistId" IS NOT NULL
    GROUP BY "artistId"
) c
WHERE c."artistId" = a."id";

-- 'Favorite Tracks:' and 'Favorite Songs:' both map to favoriteTracks
UPDATE "Artist" a
SET "favoriteTracks" = regexp_split_to_array(trim(t."text"), '\s*,\s*')
FROM "Attribute" t
WHERE t."artistId" = a."id"
  AND t."title" IN ('Favorite Tracks:', 'Favorite Songs:');

-- 'Favorite Albums:' and 'Favorite Album:' both map to favoriteAlbums
UPDATE "Artist" a
SET "favoriteAlbums" = regexp_split_to_array(trim(t."text"), '\s*,\s*')
FROM "Attribute" t
WHERE t."artistId" = a."id"
  AND t."title" IN ('Favorite Albums:', 'Favorite Album:');

-- ============================================================
-- 5. Album: rename, new columns, assign Artist
-- ============================================================

ALTER TABLE "Album" RENAME COLUMN "name" TO "title";
ALTER INDEX "Album_name_idx" RENAME TO "Album_title_idx";

ALTER TABLE "Album"
    ADD COLUMN "releaseDate" DATE,
    ADD COLUMN "artistId" INTEGER,
    ADD COLUMN "contents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "favoriteTracks" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "Album" al
SET "contents" = c."arr"
FROM (
    SELECT "albumId", array_agg("text" ORDER BY "order") AS "arr"
    FROM "Content"
    WHERE "albumId" IS NOT NULL
    GROUP BY "albumId"
) c
WHERE c."albumId" = al."id";

UPDATE "Album" al
SET "favoriteTracks" = regexp_split_to_array(trim(t."text"), '\s*,\s*')
FROM "Attribute" t
WHERE t."albumId" = al."id"
  AND t."title" IN ('Favorite Tracks:', 'Favorite Songs:');

-- All existing albums are Coldplay's. If the lookup fails, SET NOT NULL fails and everything rolls back.
UPDATE "Album" SET "artistId" = (SELECT "id" FROM "Artist" WHERE "name" = 'Coldplay');
ALTER TABLE "Album" ALTER COLUMN "artistId" SET NOT NULL;

-- ============================================================
-- 6. Playlist: link ownership flips to Playlist
-- ============================================================

ALTER TABLE "Playlist" ADD COLUMN "linkId" INTEGER;

UPDATE "Playlist" p
SET "linkId" = l."id"
FROM "Link" l
WHERE l."playlistId" = p."id";

-- ============================================================
-- 7. Rankings: seed from Artist tier/rank and Album rank
-- ============================================================

INSERT INTO "RankingList" ("name", "slug", "artistId", "updatedAt")
VALUES ('Favorite Artists', 'favorite-artists', NULL, CURRENT_TIMESTAMP);

INSERT INTO "RankingList" ("name", "slug", "artistId", "updatedAt")
SELECT 'Coldplay Albums', 'coldplay-albums', "id", CURRENT_TIMESTAMP
FROM "Artist"
WHERE "name" = 'Coldplay';

-- Tier 1 -> S, 2 -> A; rank becomes position within tier
INSERT INTO "RankingEntry" ("listId", "musicItemId", "tier", "position", "updatedAt")
SELECT
    (SELECT "id" FROM "RankingList" WHERE "slug" = 'favorite-artists'),
    a."id",
    (CASE a."tier" WHEN 1 THEN 'S' WHEN 2 THEN 'A' WHEN 3 THEN 'B' WHEN 4 THEN 'C' END)::"Tier",
    a."rank",
    CURRENT_TIMESTAMP
FROM "Artist" a;

-- Untiered, ranked album list
INSERT INTO "RankingEntry" ("listId", "musicItemId", "tier", "position", "updatedAt")
SELECT
    (SELECT "id" FROM "RankingList" WHERE "slug" = 'coldplay-albums'),
    al."id",
    NULL,
    al."rank",
    CURRENT_TIMESTAMP
FROM "Album" al
WHERE al."rank" IS NOT NULL;

-- ============================================================
-- 8. Drop old structures (data has been moved)
-- ============================================================

DROP TABLE "Content";
DROP TABLE "Attribute";

-- Dropping columns also drops their indexes and FKs
ALTER TABLE "Image"
    DROP COLUMN "artistId",
    DROP COLUMN "albumId";

ALTER TABLE "Link"
    DROP COLUMN "artistId",
    DROP COLUMN "albumId",
    DROP COLUMN "playlistId";

ALTER TABLE "Artist"
    DROP COLUMN "tier",
    DROP COLUMN "rank",
    DROP COLUMN "createdAt";

ALTER TABLE "Album"
    DROP COLUMN "rank",
    DROP COLUMN "createdAt";

-- Subtype IDs come from MusicItem, not their own sequences
ALTER TABLE "Artist" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Artist_id_seq";

ALTER TABLE "Album" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Album_id_seq";

-- ============================================================
-- 9. Indexes
-- ============================================================

-- CreateIndex
CREATE UNIQUE INDEX "MusicItem_linkId_key" ON "MusicItem"("linkId");

-- CreateIndex
CREATE INDEX "MusicItem_imageId_idx" ON "MusicItem"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_artistId_title_key" ON "Album"("artistId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "MusicItemGenre_genreId_idx" ON "MusicItemGenre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_linkId_key" ON "Playlist"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingList_slug_key" ON "RankingList"("slug");

-- CreateIndex
CREATE INDEX "RankingList_artistId_idx" ON "RankingList"("artistId");

-- CreateIndex
CREATE INDEX "RankingEntry_musicItemId_idx" ON "RankingEntry"("musicItemId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingEntry_listId_musicItemId_key" ON "RankingEntry"("listId", "musicItemId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingEntry_listId_tier_position_key" ON "RankingEntry"("listId", "tier", "position");

-- ============================================================
-- 10. Foreign keys
-- ============================================================

-- AddForeignKey
ALTER TABLE "MusicItem" ADD CONSTRAINT "MusicItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicItem" ADD CONSTRAINT "MusicItem_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_id_fkey" FOREIGN KEY ("id") REFERENCES "MusicItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_id_fkey" FOREIGN KEY ("id") REFERENCES "MusicItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicItemGenre" ADD CONSTRAINT "MusicItemGenre_musicItemId_fkey" FOREIGN KEY ("musicItemId") REFERENCES "MusicItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicItemGenre" ADD CONSTRAINT "MusicItemGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingList" ADD CONSTRAINT "RankingList_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingEntry" ADD CONSTRAINT "RankingEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "RankingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingEntry" ADD CONSTRAINT "RankingEntry_musicItemId_fkey" FOREIGN KEY ("musicItemId") REFERENCES "MusicItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;