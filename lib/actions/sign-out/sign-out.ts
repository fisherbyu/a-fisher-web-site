'use server';

import { createServer } from '@/lib';
import { redirect } from 'next/navigation';

export async function signOut() {
    const supabase = await createServer();
    await supabase.auth.signOut();
    return redirect('/');
}
