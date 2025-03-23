import Image, { StaticImageData } from 'next/image';

interface ComponentItem {
    title?: string;
    content?: string;
    image: {
        src: StaticImageData;
        alt: string;
    };
}

interface Components {
    title?: string;
    caption?: string;
    mdcol: number;
    lgcol: number;
    items: ComponentItem[];
}

interface GridBlockProps {
    components: Components;
}

interface GridSkeletonProps {
    mdcol: number;
    lgcol: number;
    children: React.ReactNodeArray;
}

export function GridSkeleton({ mdcol, lgcol, children }: GridSkeletonProps) {
    const mdColMapping = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
        6: 'md:grid-cols-6',
    };
    const lgColMapping = {
        1: 'lg:grid-cols-1',
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
        5: 'lg:grid-cols-5',
        6: 'lg:grid-cols-6',
        7: 'lg:grid-cols-7',
        8: 'lg:grid-cols-8',
        9: 'lg:grid-cols-9',
        10: 'lg:grid-cols-10',
        11: 'lg:grid-cols-11',
        12: 'lg:grid-cols-12',
    };
    return <div className={`grid grid-cols-1 md:grid-cols-${mdcol} lg:grid-cols-${lgcol} gap-12 lg:gap-6`}>{children}</div>;
}

export default function GridBlock({ components }: GridBlockProps) {
    return (
        <section className="container mx-auto py-10 md:py-8 lg:py-6 flex flex-col justify-center flex-1 lg:flex-none">
            {components.title && <h3 className="text-2xl font-medium tracking-tight text-black sm:text-4xl">{components.title}</h3>}
            {components.caption && <p className="mt-4 text-lg tracking-tight text-gray-600">{components.caption}</p>}
            <GridSkeleton mdcol={components.mdcol || 2} lgcol={components.lgcol || 4}>
                {components.items.map((item, index) => (
                    <div key={item.image.src.src}>
                        <div className="mb-6">
                            <Image src={item.image.src} alt={item.image.alt} className="w-full h-auto rounded" />
                        </div>
                        {(item.title || item.content) && (
                            <div className="text-left">
                                {item.title && <h2 className="text-2xl ">{item.title}</h2>}
                                {item.content && (
                                    <div className="mt-6">
                                        <p className="whitespace-pre-wrap text-base">{item.content}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </GridSkeleton>
        </section>
    );
}
