'use client';
import { Button } from 'thread-ui';
import { signOut } from '@/server/auth/auth.actions';

export const SignOutButton = () => {
    return (
        <Button
            margin="0px"
            color="secondary"
            onClick={async () => {
                await signOut();
            }}
            text
        >
            Sign Out
        </Button>
    );
};
