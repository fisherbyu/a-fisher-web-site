'use client';
import MusicDisplay from '@/components/old/ui/music-display';
import PageTitle from '@/components/old/ui/page-title';

import { useEffect, useState } from 'react';
import { getData, DataType } from '@/api/dataAccess';

interface MusicDisplayPageProps {
    type: DataType;
}

export default function MusicDisplayPage({ type }: MusicDisplayPageProps) {
    const [content, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getData(type);
                setData(result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        fetchData();
    }, []);
    return (
        <div>
            {content.map((artist, index) => (
                <MusicDisplay key={artist.name} index={index} components={artist} />
            ))}
        </div>
    );
}
