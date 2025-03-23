'use client';
import { Button, Divider } from 'thread-ui';
import { authenticateUser } from '@/lib';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
    // Initilaize Router for Redirection
    const router = useRouter();

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Extract Values
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email')!.toString();
        const password = formData.get('password')!.toString();

        // Process Authentication
        try {
            const result = await authenticateUser(email, password);

            if (result.success) {
                router.push('/admin');
            } else {
                // setErrorMessage(result.error || 'Authentication failed');
                console.error('Authentication Failed:', result.error);
            }
        } catch (err) {
            console.error('Authentication Failed:', err);
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
            <label className="flex flex-col gap-2 w-full">
                Email
                <input className="border rounded p-2" id="email" name="email" type="email" required minLength={2} />
            </label>
            <label className="flex flex-col gap-2 w-full">
                Password
                <input className={`border rounded p-2 `} id="password" name="password" type="password" required minLength={2} />
            </label>
            <Button fullWidth type="submit">
                Login
            </Button>
        </form>
    );
};
