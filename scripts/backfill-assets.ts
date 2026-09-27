/**
 * Backfill Assets (between the expand and contract migrations)
 *
 * 1. Music images: downloads each legacy `Asset.src` from the Supabase bucket, processes it,
 *    and fills in folder/key/name/blurDataUrl (and real width/height) on the same row.
 * 2. Photos: creates an Asset + published Photo for every repo photo the page showed, in its
 *    hand-picked order, with the title derived from the file name and camera/date from EXIF.
 *
 * Safe to re-run: assets that already have a key, and photos whose file was already imported, are skipped
 * (existing photos only get their `sortOrder` reset to the list below).
 * Refuses to touch a non-local database unless `--prod` is passed.
 *
 * Run: make backfill-assets
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import type { Folder } from '@/lib/media';
import { generateKey, processImage, slugify, writeAssetFiles } from '@/server/media';

// The photo page's static imports, in its display order, from before it moved to the database
const PHOTO_FILES = [
    'andrew-fisher-point.jpg',
    'hope-3.jpg',
    'hope-1.jpg',
    'rexburg.jpg',
    'virgin-river.jpg',
    'ocean-boat.jpg',
    'provo-canyon-4.jpg',
    'sacramento-street.jpg',
    'zion-2.jpg',
    'alpine-loop-1.jpg',
    'beach-waves.jpg',
    'blake.jpg',
    'alpine-loop-2.jpg',
    'snow-canyon.jpg',
    'zion-1.jpg',
    'alaska-river.jpg',
    'byu-autumn.jpg',
    'provo-canyon-2.jpg',
    'milky-way.jpg',
    'ptarmigan-lake.jpg',
    'arches-np.jpg',
    'provo-canyon-3.jpg',
    'wrights-lake.jpg',
    'sydney.jpg',
    'hope-2.jpg',
    'alaska-trail.jpg',
    'emily.jpg',
    'provo-canyon-1.jpg',
    'wrights-lake-2.jpg',
    'alaska-river-2.jpg',
];

const prisma = new PrismaClient();

const assertSafeTarget = () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    if (!process.env.MEDIA_ROOT) throw new Error('MEDIA_ROOT is not set');

    const { hostname } = new URL(url);
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocal && !process.argv.includes('--prod')) {
        throw new Error('DATABASE_URL is not local. Pass --prod to backfill a remote database.');
    }
    console.log(`Target: ${isLocal ? 'local' : 'REMOTE'} database, media in ${process.env.MEDIA_ROOT}\n`);
};

/** "provo-canyon-4.jpg" -> "Provo Canyon 4" */
const titleFromFileName = (fileName: string) =>
    path
        .parse(fileName)
        .name.split(/[-_\s]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');

/** Processes an image, writes its variants, and returns the Asset columns to store */
const storeImage = async (input: Buffer, folder: Folder, name: string) => {
    const processed = await processImage(input, folder);
    const location = { folder, key: generateKey(), name };
    await writeAssetFiles(location, processed.variants);

    return {
        columns: {
            ...location,
            width: processed.width,
            height: processed.height,
            blurDataUrl: processed.blurDataUrl,
        },
        exif: processed.exif,
    };
};

const backfillMusicAssets = async () => {
    const baseSrc = process.env.NEXT_PUBLIC_BASE_SRC;
    if (!baseSrc) throw new Error('NEXT_PUBLIC_BASE_SRC is not set');

    const assets = await prisma.asset.findMany({
        where: { key: null, musicItems: { some: {} } },
        include: { musicItems: { include: { artist: true, album: true } } },
        orderBy: { id: 'asc' },
    });
    console.log(`Music images to backfill: ${assets.length}`);

    for (const asset of assets) {
        // Folder and name come from the owner, not the legacy path (which mixes artists/album)
        const owner = asset.musicItems[0];
        const folder: Folder = owner.artist ? 'music/artist' : 'music/album';
        const ownerName = owner.artist?.name ?? owner.album?.title;
        if (!asset.src || !ownerName) throw new Error(`Asset ${asset.id} has no src or owner name`);

        const response = await fetch(baseSrc + asset.src);
        if (!response.ok) throw new Error(`Asset ${asset.id}: download failed (${response.status}) for ${asset.src}`);

        const { columns } = await storeImage(Buffer.from(await response.arrayBuffer()), folder, slugify(ownerName));
        await prisma.asset.update({ where: { id: asset.id }, data: columns });
        console.log(`  #${asset.id} ${asset.src} -> ${columns.folder}/${columns.key}/${columns.name}`);
    }
};

const backfillPhotos = async () => {
    console.log(`\nRepo photos: ${PHOTO_FILES.length}`);

    for (const [sortOrder, fileName] of PHOTO_FILES.entries()) {
        const title = titleFromFileName(fileName);
        const name = slugify(title);

        const existing = await prisma.asset.findFirst({ where: { folder: 'photo', name } });
        if (existing) {
            await prisma.photo.updateMany({ where: { assetId: existing.id }, data: { sortOrder } });
            console.log(`  skip ${fileName} (asset #${existing.id}), sortOrder ${sortOrder}`);
            continue;
        }

        const input = await readFile(path.join('public/photography', fileName));
        const { columns, exif } = await storeImage(input, 'photo', name);

        const photo = await prisma.photo.create({
            data: {
                title,
                camera: exif.camera,
                takenAt: exif.takenAt,
                // Already live on the site
                published: true,
                sortOrder,
                asset: { create: { ...columns, alt: title } },
            },
        });
        console.log(`  ${fileName} -> photo #${photo.id} "${title}" ${columns.key} (${exif.camera ?? 'no camera'})`);
    }
};

const main = async () => {
    assertSafeTarget();
    await backfillMusicAssets();
    await backfillPhotos();

    const remaining = await prisma.asset.count({ where: { key: null } });
    console.log(`\nDone. Assets still missing a key: ${remaining}`);
};

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
