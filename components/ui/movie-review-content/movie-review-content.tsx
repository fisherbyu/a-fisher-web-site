import { H3, Text } from 'thread-ui';

type MovieReviewContentProps = {
    title: string;
    stars: number;
    review: string;
};

export const MovieReviewContent = ({ title, stars, review }: MovieReviewContentProps) => {
    const starList = '★★★★★';

    return (
        <>
            <H3 inline>{title}</H3>
            <Text>{starList}</Text>
            <Text inline>{review}</Text>
        </>
    );
};
