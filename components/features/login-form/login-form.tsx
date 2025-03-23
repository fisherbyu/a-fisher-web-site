'use client';
import { useState } from 'react';
import { Button, Divider } from 'thread-ui';
import { authenticateUser } from '@/lib';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
    // Initialize Router for Redirection
    const router = useRouter();

    // Add state for error message and loading
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Extract Values
        e.preventDefault();

        // Reset error state and set loading
        setErrorMessage(null);
        setIsLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email')!.toString();
        const password = formData.get('password')!.toString();

        // Process Authentication
        try {
            const result = await authenticateUser(email, password);
            if (result.success) {
                router.push('/admin');
            } else {
                setErrorMessage(result.error || 'Authentication failed');
                console.error('Authentication Failed:', result.error);
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error('Authentication Failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="sm:w-10/12 md:max-w-80 mx-auto flex flex-col gap-6 justify-center items-center border rounded max-w-screen-sm p-4"
        >
            <span>
                Admin Login
                <Divider />
            </span>

            {/* Error message display */}
            {errorMessage && (
                <div className="w-full p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm">{errorMessage}</div>
            )}

            <label className="flex flex-col gap-2 w-full">
                Email
                <input
                    className="border rounded p-2"
                    id="email"
                    name="email"
                    type="email"
                    required
                    minLength={2}
                    disabled={isLoading}
                />
            </label>

            <label className="flex flex-col gap-2 w-full">
                Password
                <input
                    className="border rounded p-2"
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={2}
                    disabled={isLoading}
                />
            </label>

            <Button fullWidth type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
};
