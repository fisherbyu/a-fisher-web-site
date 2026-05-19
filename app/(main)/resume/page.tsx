import type { Metadata } from 'next';
import BYULogo from '@/public/resume/byu-logo.png';
import Image from 'next/image';
import resume from './resume.json';
import { PageHeader, H2, List, Card, H3, Text, H1, Container } from 'thread-ui';

export default function ResumePage() {
    const LAYOUT_WIDTH = 'w-full md:w-9/12 mx-auto max-w-[850px]';
    return (
        <>
            <PageHeader title="Resume" />
            <div className="flex flex-col gap-12 max-w-[850px] mx-auto mb-8">
                <Container>
                    <H1>Education</H1>
                    <Card fullWidth>
                        <div className="flex justify-start items-center space-x-2 pb-4">
                            <Image src={BYULogo} alt="BYU Logo" className=" w-10" />
                            <div>
                                <H2 inline>{resume.education[0].institution}</H2>
                                <Text size="xs">
                                    {resume.education[0].graduation_month}{' '}
                                    {resume.education[0].graduation_year} -{' '}
                                    {resume.education[0].city}, {resume.education[0].state}
                                </Text>
                            </div>
                        </div>
                        <H3 inline>{resume.education[0].degree}</H3>
                        <Text color="text-secondary" weight="semibold" size="md">
                            {resume.education[0].college}
                        </Text>
                        <br />
                        <Text size="sm">{resume.education[0].additionals}</Text>
                    </Card>
                </Container>
                <Container>
                    <H1>Experience</H1>
                    <div className="flex flex-col gap-4">
                        {resume.jobs.map((job) => (
                            <Card
                                title={{ text: job.title, divider: true }}
                                key={job.title}
                                fullWidth
                            >
                                <Text weight="semibold">{job.company}</Text>
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
                </Container>
                <Container>
                    <H1>Skills & Achievements</H1>
                    <Card fullWidth>
                        <List items={resume.skills} />
                    </Card>
                </Container>
            </div>
        </>
    );
}

export const metadata: Metadata = {
    title: 'My Resume',
};
