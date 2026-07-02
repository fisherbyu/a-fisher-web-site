import { H3, Icon, Text } from 'thread-ui';

type MovieReviewContentProps = {
    title: string;
    stars: number;
    review: string;
};

const STAR_COUNT = 5;

export const MovieReviewContent = ({ title, stars, review }: MovieReviewContentProps) => {
    const half = stars % 1;
    const whole = stars - half;
    const starList = [];

    for (let i = 0; i < STAR_COUNT; i++) {
        if (i < whole) {
            starList.push(<Icon filled key={i} name="Star" size={8} />);
        } else if (i < whole + 1 && half > 0) {
            starList.push(<Icon filled key={half} name="StarHalf" size={8} />);
        } else {
            starList.push(<Icon key={i} name="Star" size={8} />);
        }
    }

    return (
        <>
            <H3 color="white" inline>
                {title}
            </H3>
            <Text color="white" inline>
                <div className="flex flex-row">{starList}</div>
            </Text>
            <Text color="white" inline>
                {review}
            </Text>
        </>
    );
};
