import { Separator } from './separator';
interface Components {
    title: string;
    subtitle?: string;
    center?: boolean;
}

interface PageTitleProps {
    components: Components;
}

export default function PageTitle({ components }: PageTitleProps) {
    const center = components.center ? 'text-center' : '';
    return (
        <div className="container my-5">
            <h1 className="mx-auto text-center  dark:text-white text-3xl md:text-4xl xl:text-5xl font-medium text-gray-900 w-10/12">
                {components.title}
            </h1>
            {components.subtitle && (
                <div className={`md:w-8/12 mx-auto ${center}`}>
                    <br />
                    <p className=" text-sm font-normal text-gray-500">
                        {!components.center && <span className="inline-block mr-8"></span>}
                        {components.subtitle}
                    </p>
                </div>
            )}
            <div className="mx-auto py-4 w-6/12">
                <Separator />
            </div>
        </div>
    );
}
