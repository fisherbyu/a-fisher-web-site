'use client';
import { Button } from 'thread-ui';
import { signOut } from '@/lib';

export const SignOutButton = () => {
    return (
        <Button
            margin="0px"
            color="gray"
            onClick={async () => {
                await signOut();
            }}
        >
            Sign Out
        </Button>
    );
};
