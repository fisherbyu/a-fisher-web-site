-- Add Assets and Photos (expand stage)
-- Hand-written: renames Image to Asset in place so existing rows and MusicItem.imageId keep working.
-- folder, key, name and blurDataUrl stay nullable until the backfill fills them; the contract
-- migration then makes them required and drops src.

BEGIN;

-- ============================================================
-- 1. Rename Image -> Asset
-- MusicItem_imageId_fkey follows the table automatically (FKs reference by OID).
-- ============================================================

ALTER TABLE "Image" RENAME TO "Asset";
ALTER TABLE "Asset" RENAME CONSTRAINT "Image_pkey" TO "Asset_pkey";
ALTER SEQUENCE "Image_id_seq" RENAME TO "Asset_id_seq";

-- ============================================================
-- 2. Asset: new storage columns (nullable until backfilled)
-- ============================================================

ALTER TABLE "Asset" ALTER COLUMN "src" DROP NOT NULL;

ALTER TABLE "Asset"
    ADD COLUMN "folder" VARCHAR(50),
    ADD COLUMN "key" VARCHAR(20),
    ADD COLUMN "name" VARCHAR(100),
    ADD COLUMN "blurDataUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_key_key" ON "Asset"("key");

-- ============================================================
-- 3. Photo, Tag, PhotoTag
-- ============================================================

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "caption" TEXT,
    "camera" VARCHAR(100),
    "takenAt" DATE,
    "location" VARCHAR(100),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoTag" (
    "photoId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "PhotoTag_pkey" PRIMARY KEY ("photoId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_assetId_key" ON "Photo"("assetId");

-- CreateIndex
CREATE INDEX "Photo_published_takenAt_idx" ON "Photo"("published", "takenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "PhotoTag_tagId_idx" ON "PhotoTag"("tagId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
