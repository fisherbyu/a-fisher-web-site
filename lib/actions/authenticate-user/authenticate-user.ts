import { createClient } from '@/lib';
import { redirect } from 'next/navigation';

export const authenticateUser = async (email: string, password: string) => {
    // Initilize Connection
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Return error information for the client
        return { success: false, error: error.message };
    }

    redirect('/protected');

    return { success: true, user: data.user };
};
