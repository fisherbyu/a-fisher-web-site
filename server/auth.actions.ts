'use server';
import { createSupabaseServerClient } from './clients';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const authenticateUser = async (
    email: string,
    password: string
): Promise<{ success: boolean; error?: string }> => {
    // Initilize Connection
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Failed:', error);
        return { success: false, error: 'Invalid email or password.' };
    }

    return { success: true };
};

export const signOut = async () => {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
};
