import type { ImageProps } from 'next/image';
import type { Asset } from '@/types';

export type AssetImageProps = Omit<
    ImageProps,
    'src' | 'loader' | 'width' | 'height' | 'alt' | 'placeholder' | 'blurDataURL'
> & {
    asset: Asset;
    /** Overrides the asset's stored alt text */
    alt?: string;
};
