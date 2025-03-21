import { LoginForm } from '@/components';

export default async function Login(props: { searchParams: Promise<string> }) {
    const searchParams = await props.searchParams;
    return <LoginForm />;
    return <>h</>;
}
