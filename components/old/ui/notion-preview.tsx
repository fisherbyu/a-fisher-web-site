import Link from 'next/link';
import Image from 'next/image';

interface NotionPage {
    id: string;
    title: string;
    url: string;
    icon: {
        type: string;
        content: string;
    };
    img: string;
}

interface NotionPreviewProps {
    page: NotionPage;
}

export default function NotionPreview({ page }: NotionPreviewProps) {
    return (
        <div className="mx-auto rounded-lg border bg-card text-card-foreground shadow-sm my-3 overflow-hidden max-h-60 w-11/12 md:10/12">
            <Link href={page.url} legacyBehavior passHref>
                <span className=" cursor-pointer">
                    <div className="overflow-hidden w-full h-5/6">
                        <img className="h-auto min-h-full w-auto min-w-full" src={page.img} alt="recipe cover" />
                    </div>
                    <div className="p-2 h-1/6">
                        <span className="flex justify-start items-center">
                            {page.icon.type === 'emoji' ? (
                                <span className=" pr-1" role="img">
                                    {JSON.parse(`"${page.icon.content}"`)}
                                </span>
                            ) : (
                                <Image className=" pr-1" height={23} width={23} src={page.icon.content} alt="Recipe Logo" />
                            )}
                            <p className=" text-sm">{page.title}</p>
                        </span>
                    </div>
                </span>
            </Link>
        </div>
    );
}
