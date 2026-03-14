import { Icon, Text } from 'thread-ui';

export const LoadingError = () => {
    return (
        <div className="flex flex-col items-center justify-center p-20">
            <Icon color="secondary" name="WarningCircle" size={64} />
            <Text color="secondary">Oops, there was an error</Text>
        </div>
    );
};
