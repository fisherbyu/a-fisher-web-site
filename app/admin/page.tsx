import { SignOutButton, ArtistForm } from '@/components';

export default async function Admin() {
    return (
        <div className="w-full h-full py-5 px-8 flex flex-col">
            <div className="w-full md:w-11/12 mx-auto flex flex-row items-center justify-between">
                <h1>Admin</h1>
                <SignOutButton />
            </div>
            <ArtistForm />
        </div>
    );
}
