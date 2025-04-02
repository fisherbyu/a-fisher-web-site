import { ReactNode } from 'react';

export const InputWrapper = ({ children }: { children: ReactNode }) => {
    return <div className="flex flex-col justify-start items-center w-full p-1">{children}</div>;
};
