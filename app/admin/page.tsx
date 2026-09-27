import { redirect } from 'next/navigation';

// Admin has no landing page of its own; open the first editor section
export default function Admin() {
    redirect('/admin/artist');
}
