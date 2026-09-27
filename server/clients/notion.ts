import 'server-only';
import { Client } from '@notionhq/client';

let client: Client | undefined;

/**
 * Shared Notion client, created on first use. Lazy so importing the server barrel
 * doesn't need `NOTION_API_KEY` during `next build`, where it isn't passed in.
 *
 * TODO: pass NOTION_API_KEY to the Docker build as a BuildKit secret (Dockerfile, makefile,
 * deploy workflow) and go back to checking it at import, so a missing key fails the build.
 *
 * @throws When `NOTION_API_KEY` is missing at the time of use
 */
export const getNotion = () => {
    if (client) return client;

    const auth = process.env.NOTION_API_KEY;
    if (!auth) throw new Error('Missing NOTION_API_KEY');

    client = new Client({ auth });
    return client;
};
