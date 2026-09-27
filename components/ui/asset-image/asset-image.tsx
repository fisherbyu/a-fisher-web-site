'use client';
import Image, { type ImageLoader } from 'next/image';
import { getAssetSrc } from '@/lib/media';
import { AssetImageProps } from './asset-image.types';

/**
 * `next/image` for stored assets. A custom loader maps each width Next requests to a
 * pre-generated variant, so the `/_next/image` optimizer is never used.
 * A client component because the loader is a function, which server components can't pass.
 *
 * @example
 * <AssetImage asset={photo.asset} sizes="(max-width: 768px) 100vw, 50vw" />
 *
 * @example
 * <AssetImage asset={artist.image} fill sizes="320px" className="object-cover" />
 */
export const AssetImage = ({ asset, alt, fill, ...props }: AssetImageProps) => {
    const loader: ImageLoader = ({ width }) => getAssetSrc(asset, width);

    return (
        <Image
            {...props}
            fill={fill}
            // Ignored by the loader; only needs to be stable and unique per asset
            src={getAssetSrc(asset, asset.width)}
            loader={loader}
            alt={alt ?? asset.alt}
            width={fill ? undefined : asset.width}
            height={fill ? undefined : asset.height}
            placeholder="blur"
            blurDataURL={asset.blurDataUrl}
        />
    );
};
