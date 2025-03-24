// app/api/photo/route.ts
import fs from 'fs';
import { writeFile, mkdir, access } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function GET() {
    try {
        const now = Date.now();

        if (global.photoCache && now - global.photoCache.lastCheck < CACHE_DURATION) {
            return NextResponse.json(global.photoCache);
        }

        const freshData = await loadImages();
        global.photoCache = freshData;
        return NextResponse.json(freshData);
    } catch (error) {
        console.error('Error loading images:', error);
        return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'photography');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }

        // Get file extension and clean the filename
        const fileExtension = path.extname(file.name).toLowerCase();
        const baseFilename = path
            .basename(file.name, fileExtension)
            .toLowerCase() // Convert to lowercase first
            .replace(/[\s_]+/g, '-') // Replace spaces and underscores with single hyphen
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/[^a-z0-9-]/g, '') // Remove any remaining special characters
            .replace(/^-+|-+$/g, '') // Remove hyphens from start and end
            .slice(0, 32); // Limit length to 32 characters

        // If the filename is empty after cleaning, generate a default name
        const safeFilename = baseFilename || 'file';
        let filename = `${safeFilename}${fileExtension}`;
        let filepath = path.join(uploadsDir, filename);

        // Check if file exists and append number if it does
        let counter = 1;
        while (true) {
            try {
                await access(filepath);
                // File exists, try next number
                filename = `${baseFilename}-${counter}${fileExtension}`;
                filepath = path.join(uploadsDir, filename);
                counter++;
            } catch {
                // File doesn't exist, we can use this name
                break;
            }
        }

        // Save the file using Uint8Array
        await writeFile(filepath, new Uint8Array(buffer));

        // Return the public URL
        const publicPath = `/photography/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicPath,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}

interface ImageMetadata {
    src: string;
    alt: string;
    lastModified: number;
    width: number;
    height: number;
}

interface PhotoCache {
    images: ImageMetadata[];
    lastUpdate: number;
    lastCheck: number;
}

declare global {
    var photoCache: PhotoCache | undefined;
}

const CACHE_DURATION = 1 * 60 * 1000;

const getAltText = (filename: string): string => {
    return filename
        .replace(/\.[^/.]+$/, '')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function getImageDimensions(filepath: string): Promise<{ width: number; height: number }> {
    try {
        const metadata = await sharp(filepath).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
        };
    } catch (error) {
        console.error(`Error getting dimensions for ${filepath}:`, error);
        return { width: 0, height: 0 };
    }
}

async function loadImages() {
    const imagesDirectory = path.join(process.cwd(), 'public', 'photography');
    const filenames = fs.readdirSync(imagesDirectory);

    // Process images in parallel for better performance
    const imageMetadataPromises = filenames
        .filter((filename) => /\.(jpg|jpeg|png|webp)$/i.test(filename))
        .map(async (filename) => {
            const filepath = path.join(imagesDirectory, filename);
            const dimensions = await getImageDimensions(filepath);

            return {
                src: `/photography/${filename}`,
                alt: getAltText(filename),
                lastModified: fs.statSync(filepath).mtime.getTime(),
                width: dimensions.width,
                height: dimensions.height,
            };
        });

    const imageMetadata = await Promise.all(imageMetadataPromises);

    return {
        images: shuffleArray(imageMetadata),
        lastUpdate: Math.max(...imageMetadata.map((img) => img.lastModified)),
        lastCheck: Date.now(),
    };
}
