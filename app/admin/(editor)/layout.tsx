import { AdminEditor } from './admin-editor';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminEditor />
            {children}
        </>
    );
}
