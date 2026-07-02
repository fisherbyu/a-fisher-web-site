import { H3, Icon, Text, ThreadTheme } from 'thread-ui';

type MovieReviewContentProps = {
    title: string;
    stars: number;
    review?: string;
};

const STAR_COUNT = 5;

export const MovieReviewContent = ({ title, stars, review }: MovieReviewContentProps) => {
    const stars_ = Array.from({ length: STAR_COUNT }, (_, i) => {
        const filled = i < Math.floor(stars);
        const half = !filled && i < stars;
        return <Icon filled={filled || half} key={i} name={half ? 'StarHalf' : 'Star'} size={8} />;
    });

    return (
        <>
            <H3 color="white" inline>
                {title}
            </H3>
            <div style={{ color: ThreadTheme.white }} className="flex flex-row">
                {stars_}
            </div>
            {review && (
                <Text color="white" inline>
                    {review}
                </Text>
            )}
        </>
    );
};
