import type { Metadata } from 'next';
import BYULogo from '@/public/resume/byu-logo.png';
import Image from 'next/image';
import resume from './resume.json';
import { ReactNode } from 'react';
import { Divider, PageHeader, H2 } from 'thread-ui';

type CardProps = {
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    children: ReactNode;
};

const Card = ({ size = 'md', title, children }: CardProps) => {
    return (
        <div className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-9/12 mx-auto max-w-[850px] mb-5">
            {title && (
                <div>
                    <h1 className="text-xl font-semibold leading-none tracking-tight">{title}</h1>
                    <Divider />
                </div>
            )}
            {children}
        </div>
    );
};

export default function ResumePage() {
    const LAYOUT_WIDTH = 'w-full md:w-9/12 mx-auto max-w-[850px]';
    return (
        <main>
            <PageHeader title="Resume" />
            <div className="container mb-6">
                <div className={LAYOUT_WIDTH}>
                    <H2>Education</H2>
                </div>
                <div className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-9/12 mx-auto max-w-[850px]">
                    <div className="flex justify-start items-center space-x-2 pb-4">
                        <Image src={BYULogo} alt="BYU Logo" className=" w-10" />
                        <div>
                            <h1 className="text-xl font-semibold leading-none tracking-tight">{resume.education[0].institution}</h1>
                            <p className="text-sm text-muted-foreground">
                                {resume.education[0].graduation_month} {resume.education[0].graduation_year} -{' '}
                                {resume.education[0].city}, {resume.education[0].state}
                            </p>
                        </div>
                    </div>
                    <h2 className=" text-lg font-normal leading-none tracking-tight">{resume.education[0].degree}</h2>
                    <p className="text-sm text-muted-foreground">{resume.education[0].college}</p>
                    <p className="pb-1">
                        {resume.education[0].gpa && (
                            <>
                                <b>GPA:</b> {resume.education[0].gpa}
                            </>
                        )}
                    </p>
                    <p className=" text-xs">{resume.education[0].additionals}</p>
                </div>
            </div>
            <div className="container mb-6">
                <div className={LAYOUT_WIDTH}>
                    <H2>Experience</H2>
                </div>
                {resume.jobs.map((job) => (
                    <Card title={job.title} key={job.title}>
                        <p className=" font-normal text-base">{job.company}</p>
                        <span className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                {job.start_date} - {job.end_date !== null ? job.end_date : 'Present'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {job.city}, {job.state} {job.country !== 'USA' ? `- ${job.country}` : ''}
                            </p>
                        </span>
                        <ul className="list-disc pl-5">
                            {job.descriptions.map((desc, index) => (
                                <li key={index} className=" font-light">
                                    {desc}
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
            <div className="container mb-6">
                <div className={LAYOUT_WIDTH}>
                    <H2>Skills & Achievements</H2>
                </div>
                <div className="p-5 rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-9/12 mb-5 mx-auto max-w-[850px]">
                    <ul className="list-disc pl-5">
                        {resume.skills.map((skill, index) => (
                            <li key={index} className=" font-light">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}

export let metadata: Metadata = {
    title: 'My Resume',
};
