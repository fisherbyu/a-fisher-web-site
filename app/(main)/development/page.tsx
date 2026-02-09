import type { Metadata } from 'next';
import ArticleData from './articles.json';
import { ColumnLayout, InfoCard, InfoCardProps, PageHeader } from 'thread-ui';

export default function DevelopmentPage() {
    const articles = ArticleData as InfoCardProps[];

    return (
        <>
            <PageHeader
                title="My Software Projects"
                caption="Here is where I'll display projects I've worked on to display some of the things I've learned or taught myself.    I've also written a few articles on different technologies to serve as guides/quick references."
                center
            />
            <ColumnLayout
                title="Projects"
                mdcol={2}
                lgcol={3}
                items={[
                    {
                        content: (
                            <InfoCard
                                title="Thread-UI"
                                icon="GithubLogoIcon"
                                url="https://github.com/fisherbyu/thread-ui"
                                img="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png"
                            />
                        ),
                    },
                ]}
            />
            <ColumnLayout
                title="Articles"
                mdcol={2}
                lgcol={3}
                items={articles.map((article, index) => ({
                    content: <InfoCard key={index} title={article.title} url={article.url} icon={article.icon} img={article.img} />,
                }))}
            />
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Development Projects',
};
