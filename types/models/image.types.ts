/**
 * Image metadata the admin forms submit after uploading to Supabase.
 * TODO(writes): replaced by the server upload action that writes to MEDIA_ROOT
 */
export type ImageUpload = {
    src: string;
    alt: string;
    height: number;
    width: number;
};
