import type { Asset as PrismaAsset } from '@prisma/client';
import { Asset } from '@/types';

export const transformAsset = (data: PrismaAsset): Asset => {
    const { folder, key, name, blurDataUrl } = data;

    // TODO(contract): these become required columns, and this guard goes away
    if (!folder || !key || !name || !blurDataUrl) {
        throw new Error(`Asset ${data.id} hasn't been processed into MEDIA_ROOT`);
    }

    return {
        id: data.id,
        folder,
        key,
        name,
        width: data.width,
        height: data.height,
        blurDataUrl,
        alt: data.alt,
    };
};
