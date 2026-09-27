'use client';
import { useState } from 'react';
import { Button, Card, H3, Text, TextInput } from 'thread-ui';
import { authenticateUser } from '@/server/auth/auth.actions';
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
        <div className="max-w-96 mx-auto">
            <Card size="md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <H3 marginBottom={false}>Admin Login</H3>
                    {errorMessage && <Text color="error">{errorMessage}</Text>}
                    <TextInput name="email" title="Email" type="email" required />
                    <TextInput name="password" title="Password" type="password" required />
                    <Button fullWidth type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
