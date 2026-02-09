import type { Metadata } from 'next';
import BYULogo from '@/public/resume/byu-logo.png';
import Image from 'next/image';
import resume from './resume.json';
import { ReactNode } from 'react';
import { Divider, PageHeader, H2, List, OrderedList, Card, H3, Text, H1 } from 'thread-ui';

type CardProps = {
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    children: ReactNode;
};

// const Card = ({ size = 'md', title, children }: CardProps) => {
//     const feature = true;

//     if (feature) {
//         return (
//             <ThreadCard
//                 surfaceColor="surface"
//                 title={{ text: title || '', divider: true, align: 'left' }}
//                 size="md"
//             >
//                 {children}
//             </ThreadCard>
//         );
//     }
//     return (
//         <div className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-9/12 mx-auto max-w-[850px] mb-5">
//             {title && (
//                 <div>
//                     <h1 className="text-xl font-semibold leading-none tracking-tight">{title}</h1>
//                     <Divider />
//                 </div>
//             )}
//             {children}
//         </div>
//     );
// };

export default function ResumePage() {
    const LAYOUT_WIDTH = 'w-full md:w-9/12 mx-auto max-w-[850px]';
    return (
        <>
            <PageHeader title="Resume" />
            <div className="container mb-6">
                <div className={LAYOUT_WIDTH}>
                    <H1>Education</H1>
                </div>
                <Card>
                    <div className="flex justify-start items-center space-x-2 pb-4">
                        <Image src={BYULogo} alt="BYU Logo" className=" w-10" />
                        <div>
                            <H2 inline>{resume.education[0].institution}</H2>
                            <Text size="xs">
                                {resume.education[0].graduation_month}{' '}
                                {resume.education[0].graduation_year} - {resume.education[0].city},{' '}
                                {resume.education[0].state}
                            </Text>
                        </div>
                    </div>
                    <H3 inline>{resume.education[0].degree}</H3>
                    <Text color="text-secondary" bold size="md">
                        {resume.education[0].college}
                    </Text>
                    <br />
                    <Text size="sm">{resume.education[0].additionals}</Text>
                </Card>
            </div>
            <div className="container mb-6 flex flex-col gap-4">
                <div className={LAYOUT_WIDTH}>
                    <H1>Experience</H1>
                </div>
                {resume.jobs.map((job) => (
                    <Card title={{ text: job.title, divider: true }} key={job.title}>
                        <Text bold>{job.company}</Text>
                        <span className="flex justify-between items-center">
                            <Text size="sm">
                                {job.start_date} -{' '}
                                {job.end_date !== null ? job.end_date : 'Present'}
                            </Text>
                            <Text size="sm">
                                {job.city}, {job.state}{' '}
                                {job.country !== 'USA' ? `- ${job.country}` : ''}
                            </Text>
                        </span>
                        <div className="mt-2">
                            <List size="sm" items={job.descriptions} />
                        </div>
                    </Card>
                ))}
            </div>
            <div className="container mb-6">
                <div className={LAYOUT_WIDTH}>
                    <H1>Skills & Achievements</H1>
                </div>
                <Card>
                    <List items={resume.skills} />
                </Card>
            </div>
        </>
    );
}

export let metadata: Metadata = {
    title: 'My Resume',
};
