import { SignOutButton } from '@/components';
import { Metadata } from 'next';

export let metadata: Metadata = {
    title: 'Admin Home',
};
export default function Admin() {
    return (
        <div className="w-full h-full py-5 px-8 flex flex-col">
            <div className="w-full md:w-11/12 mx-auto flex flex-row items-center justify-between">
                <h1 className="text-3xl">Admin</h1>
                <SignOutButton />
            </div>
        </div>
    );
}
