import 'server-only';
import { Client } from '@notionhq/client';

const auth = process.env.NOTION_API_KEY;
if (!auth) throw new Error('Missing NOTION_API_KEY');

/** Shared Notion client */
export const notion = new Client({ auth });
