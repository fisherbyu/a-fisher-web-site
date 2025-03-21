'use server';
import { redirect } from 'next/navigation';
import { createClient, encodedRedirect } from '@/lib';

export const authenticate = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect('error', '/sign-in', error.message);
    }

    return redirect('/protected');
};
