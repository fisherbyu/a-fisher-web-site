import type { Metadata } from 'next';
import ArticleData from './articles.json';
import { InfoCard, InfoCardProps, PageHeader } from 'thread-ui';

export default function DevelopmentPage() {
    const articles = ArticleData as InfoCardProps[];
    return (
        <>
            <PageHeader
                title="My Software Projects"
                caption="Here is where I'll display projects I've worked on to display some of the things I've learned or taught myself.    I've also written a few articles on different technologies to serve as guides/quick references."
                center
            />
            <section className="container">
                <h1 className="text-left dark:text-white text-2xl md:text-3xl xl:text-4xl font-medium text-gray-900 w-10/12 p-5">
                    Projects
                </h1>
                <div className="grid grid-cols-1 gap-12 mt-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 ">
                    <InfoCard
                        title="Thread-UI"
                        icon="GithubLogoIcon"
                        url="https://github.com/fisherbyu/thread-ui"
                        img="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png"
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-left dark:text-white text-2xl md:text-3xl xl:text-4xl font-medium text-gray-900 w-10/12 p-5">
                    Articles
                </h1>
                <div className="grid grid-cols-1 gap-12 mt-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 ">
                    {articles.map((article, index) => (
                        <InfoCard key={index} title={article.title} url={article.url} icon={article.icon} img={article.img} />
                    ))}
                </div>
            </section>
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Development Projects',
};
