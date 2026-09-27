-- Add Photo.sortOrder for manual page ordering; the page now sorts by it instead of takenAt

-- DropIndex
DROP INDEX "Photo_published_takenAt_idx";

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Give existing photos distinct positions in creation order; the backfill sets the curated order
UPDATE "Photo" p SET "sortOrder" = o."rn"
FROM (SELECT "id", ROW_NUMBER() OVER (ORDER BY "id") - 1 AS "rn" FROM "Photo") o
WHERE o."id" = p."id";

-- CreateIndex
CREATE INDEX "Photo_published_sortOrder_idx" ON "Photo"("published", "sortOrder");
