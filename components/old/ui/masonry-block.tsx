import Image, { StaticImageData } from 'next/image';

interface ComponentItem {
    src: StaticImageData;
    alt: string;
}

interface Components {
    title?: string;
    caption?: string;
    items: ComponentItem[];
}

interface MasonryBlockProps {
    components: Components;
}

export default function MasonryBlock({ components }: MasonryBlockProps) {
    return (
        <section className="container">
            {components.title && <h3 className="text-2xl font-normal tracking-tight text-black sm:text-4xl">{components.title}</h3>}
            {components.caption && <p className="mt-4 text-lg tracking-tight text-gray-600">{components.caption}</p>}
            <div>
                <ol className=" mt-2 columns-2 md:columns-3 lg:columns-4 gap-x-2">
                    {components.items.map((photo) => (
                        <li key={photo.alt} className=" w-full inline-block ">
                            <Image src={photo.src} alt={photo.alt} className="rounded" />
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
