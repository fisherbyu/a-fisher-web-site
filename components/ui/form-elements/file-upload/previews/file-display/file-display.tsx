import { Icon } from 'thread-ui';
import { FileDisplayProps } from './file-display.types';

export const FileDisplay = ({ file }: FileDisplayProps) => {
    return (
        <div className="w-full flex items-center justify-between rounded bg-gray-100 py-4 px-5">
            <Icon name="FileText" size={48} color="grey" />
            <p className="mt-2 text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
    );
};
