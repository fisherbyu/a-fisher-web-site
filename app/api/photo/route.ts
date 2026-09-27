import { createRoute, getPhotos } from '@/server';
import { requireApiAdmin } from '@/server/auth';

/** Published photos in page order. `?drafts=true` includes unpublished ones and requires admin */
export const GET = createRoute(async (request) => {
    const drafts = request.nextUrl.searchParams.get('drafts') === 'true';
    if (drafts) await requireApiAdmin();

    return getPhotos({ drafts });
});
