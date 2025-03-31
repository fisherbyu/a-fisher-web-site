-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tier" INTEGER NOT NULL,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "appleURI" VARCHAR(255) NOT NULL,
    "spotifyURI" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" INTEGER,
    "albumId" INTEGER,
    "playlistId" INTEGER,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "src" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255) NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" INTEGER,
    "albumId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" INTEGER,
    "albumId" INTEGER,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" INTEGER,
    "albumId" INTEGER,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "Artist"("name");

-- CreateIndex
CREATE INDEX "Artist_tier_idx" ON "Artist"("tier");

-- CreateIndex
CREATE INDEX "Album_name_idx" ON "Album"("name");

-- CreateIndex
CREATE INDEX "Album_rank_idx" ON "Album"("rank");

-- CreateIndex
CREATE INDEX "Playlist_title_idx" ON "Playlist"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Link_artistId_key" ON "Link"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_albumId_key" ON "Link"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_playlistId_key" ON "Link"("playlistId");

-- CreateIndex
CREATE INDEX "Link_artistId_idx" ON "Link"("artistId");

-- CreateIndex
CREATE INDEX "Link_albumId_idx" ON "Link"("albumId");

-- CreateIndex
CREATE INDEX "Link_playlistId_idx" ON "Link"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_artistId_id_key" ON "Link"("artistId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_albumId_id_key" ON "Link"("albumId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_playlistId_id_key" ON "Link"("playlistId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_artistId_key" ON "Image"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_albumId_key" ON "Image"("albumId");

-- CreateIndex
CREATE INDEX "Image_artistId_idx" ON "Image"("artistId");

-- CreateIndex
CREATE INDEX "Image_albumId_idx" ON "Image"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_artistId_id_key" ON "Image"("artistId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_albumId_id_key" ON "Image"("albumId", "id");

-- CreateIndex
CREATE INDEX "Content_artistId_idx" ON "Content"("artistId");

-- CreateIndex
CREATE INDEX "Content_albumId_idx" ON "Content"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_artistId_order_key" ON "Content"("artistId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Content_albumId_order_key" ON "Content"("albumId", "order");

-- CreateIndex
CREATE INDEX "Attribute_artistId_idx" ON "Attribute"("artistId");

-- CreateIndex
CREATE INDEX "Attribute_albumId_idx" ON "Attribute"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_artistId_order_key" ON "Attribute"("artistId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_albumId_order_key" ON "Attribute"("albumId", "order");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
