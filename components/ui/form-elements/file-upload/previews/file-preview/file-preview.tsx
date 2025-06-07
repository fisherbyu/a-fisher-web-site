import { Icon } from 'thread-ui';
import { FilePreviewProps } from './file-preview.types';
import { isFileImageType } from '@/lib';

export const FilePreview = ({ file, actions }: FilePreviewProps) => {
    return (
        <div className="w-full flex items-center justify-between rounded bg-gray-100 py-2 px-5">
            <div className="flex gap-2">
                <Icon name={isFileImageType(file) ? 'Image' : 'FileText'} size={48} color="gray" />
                <div className="truncate overflow-hidden">
                    <p className="mt-2 text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
            </div>
            {actions && actions}
        </div>
    );
};
