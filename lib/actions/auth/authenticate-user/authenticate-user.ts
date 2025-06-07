'use server';
import { createServer } from '@/lib';

export const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Initilize Connection
    const supabase = await createServer();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Failed:'), error;
        return { success: false, error: error.message };
    }

    return { success: true };
};
