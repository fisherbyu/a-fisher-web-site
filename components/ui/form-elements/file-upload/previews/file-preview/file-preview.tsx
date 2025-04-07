import { Icon } from 'thread-ui';
import { FilePreviewProps } from './file-preview.types';

export const FilePreview = ({ file, type }: FilePreviewProps) => {
    return (
        <div className="w-full flex items-center justify-between rounded bg-gray-100 py-4 px-5">
            <Icon name={type === 'IMG' ? 'Image' : 'FileText'} size={48} color="grey" />
            <p className="mt-2 text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
    );
};
