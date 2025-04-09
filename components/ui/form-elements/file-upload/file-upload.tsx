'use client';
import { useState, useCallback } from 'react';
import { Icon, Button, Divider } from 'thread-ui';
import clsx from 'clsx';
import { TextInput } from '../text-input';
import { FileUploadProps, FileWithAlt } from './file-upload.types';
import { FilePreview, ImageDisplay } from './previews';
import { isFileImageType } from '@/lib';
import { FormLabel } from '../form-label';

export const FileUpload = ({
    title = 'Upload a File',
    name,
    files,
    setFiles,
    allowedFileTypes = ['*/*'],
    maxFileSize,
    maxNumberFiles,
    supportedFormatsText,
    required,
    size = 'md',
}: FileUploadProps) => {
    // Init Display States
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState('');

    // Init File States
    const [selectedFile, setSelectedFile] = useState<FileWithAlt | null>(null);
    const [customFilename, setCustomFilename] = useState('');
    const [alt, setAlt] = useState('');

    // Check if maximum files reached
    const isMaxFilesReached = maxNumberFiles !== undefined && files.length >= maxNumberFiles;

    // Drag UI Reactions
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    // Validate File Type
    const isValidFileType = (file: File) => {
        if (allowedFileTypes.includes('*/*')) return true;
        return allowedFileTypes.some((type) => {
            // Handle wildcards like 'image/*'
            if (type.endsWith('/*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(`${category}/`);
            }
            return file.type === type;
        });
    };

    // File Submissions
    const processFile = (file: File) => {
        // Ensure Maximum is not Exceeded
        if (maxNumberFiles && files.length >= maxNumberFiles) {
            setStatus(`Maximum files already added`);
            return;
        }

        // Ensure File is passed
        if (!file) {
            setStatus('No File Selected');
        }

        // Ensure Valid Type
        if (!isValidFileType(file)) {
            setStatus(`Invalid file type. Please select a ${allowedFileTypes.join(', ')} file`);
            return;
        }

        // Ensure Valid Size
        if (maxFileSize && file.size > maxFileSize) {
            setStatus(`File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
            return;
        }

        // Extract Original Filename for user Editing
        const extension = file.name.split('.').pop() || '';
        const originalName = file.name.replace(`.${extension}`, '');
        setCustomFilename(originalName);
        setSelectedFile(file);
        setStatus('');

        // Generate Image Preview
        if (isFileImageType(file)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    setPreview(result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            // Clear preview for non-image files
            setPreview(undefined);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    }, []);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    // Remove File from files
    const handleClearFile = () => {
        setSelectedFile(null);
        setPreview(undefined);
        setCustomFilename('');
        setStatus('');
    };

    // Save Selected file
    const saveFile = () => {
        // Save File
        if (selectedFile) {
            selectedFile.alt = alt;
            setFiles([...files, selectedFile]);
            handleClearFile();
        }
    };

    const removeFile = (index: number) => {
        // Remove File @ index
        const updatedFiles = files.filter((_, i) => i !== index);

        // Save Changes
        setFiles(updatedFiles);
    };

    const FileInput = () => {
        if (isMaxFilesReached) {
            return null;
        } else {
            return (
                <div
                    className={clsx(
                        'border-2 mx-auto border-dashed rounded-lg text-center flex items-center',
                        {
                            'flex-row justify-center items-center gap-7 p-3': size === 'sm' || size === 'md',
                            'p-8': size === 'md' || size === 'lg',
                            'flex-col': size === 'lg',
                        },
                        {
                            'border-blue-500 bg-blue-50': isDragging,
                            'border-gray-300': !isDragging,
                        }
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Icon name="UploadSimple" size={size === 'sm' ? 24 : 48} color="grey" />
                    <div
                        className={clsx('flex gap-2', {
                            'flex-row': size === 'sm',
                            'flex-col': !(size === 'sm'),
                        })}
                    >
                        <span>
                            {!(size === 'sm') && <p className="text-sm text-gray-600">Drag and drop your file here</p>}
                            {supportedFormatsText && <span className="text-xs text-gray-500">{supportedFormatsText}</span>}
                        </span>

                        <div>
                            <input
                                type="file"
                                id="file-upload-input"
                                className="hidden"
                                accept={allowedFileTypes.join(',')}
                                onChange={handleFileUpload}
                                required={required}
                            />
                            <button
                                className={clsx('text-blue-600 hover:underline', {
                                    'text-xs': size === 'sm',
                                })}
                                type="button"
                                onClick={() => {
                                    const fileInput = document.getElementById('file-upload-input');
                                    if (fileInput) {
                                        fileInput.click();
                                    }
                                }}
                            >
                                Select a File
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="w-full p-1">
            <FormLabel name={name} title={title} />
            <Divider width="100%" marginY="2px" />
            <div>
                {/* Current Files */}
                {files && (
                    <div className="mb-2">
                        {files.map((file, index) => (
                            <FilePreview
                                file={file}
                                actions={
                                    <>
                                        <button onClick={() => removeFile(index)}>
                                            <Icon name="XSquare" size={16} color="error" />
                                        </button>
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}
                {!selectedFile ? (
                    <FileInput />
                ) : (
                    // Preview Selected File
                    <div className="flex gap-4 flex-col  w-full  mx-auto md:justify-between items-center">
                        {preview ? <ImageDisplay src={preview} /> : <FilePreview file={selectedFile} />}
                        <div className="w-full flex flex-row justify-start">
                            <div className="w-full">
                                <TextInput
                                    name="filename"
                                    title="Filename:"
                                    value={customFilename}
                                    onChange={(e) => setCustomFilename(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 pl-1 mt-1">Extension: .{selectedFile.name.split('.').pop()}</p>
                                {status && <p className="text-sm text-gray-600 pl-1">{status}</p>}
                            </div>
                            {isFileImageType(selectedFile) && (
                                <div className="w-full">
                                    <TextInput name="alt" title="Alt Text:" value={alt} onChange={(e) => setAlt(e.target.value)} />
                                </div>
                            )}
                        </div>
                        <div className="self-end flex gap-3 flex-col">
                            <div className="flex gap-2">
                                <>
                                    <Button type="button" color="error" onClick={handleClearFile}>
                                        Remove
                                    </Button>
                                    <Button type="button" onClick={saveFile} fullWidth>
                                        Add File
                                    </Button>
                                </>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
