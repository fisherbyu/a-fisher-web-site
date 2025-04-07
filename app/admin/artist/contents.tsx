'use client';
import { ArtistForm, BookDisplay } from '@/components';
import { getArtists } from '@/lib';
import { Artist } from '@/types';

const EditArtistForm = (data: Artist) => {
    return <ArtistForm initialData={data} />;
};

export default async function ArtistContents() {
    const artists = await getArtists();

    const displayArtistListItem = (item: Artist) => (
        <div>
            <div className="font-medium">{item.name}</div>
        </div>
    );

    return (
        <BookDisplay<Artist>
            items={artists}
            renderListItem={displayArtistListItem}
            renderDetail={EditArtistForm}
            listTitle="Artists"
        />
    );
}
