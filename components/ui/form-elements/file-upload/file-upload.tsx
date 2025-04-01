'use client';
import { useState, useCallback } from 'react';
import { Icon, Button, Divider } from 'thread-ui';
import { TextInput } from '../text-input';

export interface FileUploadProps {
    title?: string;
    allowedFileTypes?: string[];
    maxFileSize?: number; // in bytes
    onFileSelect: (file: File, customFilename: string) => Promise<void> | void;
    supportedFormatsText?: string;
    initialFileName?: string;
}

export const FileUpload = ({
    title = 'Upload a File',
    allowedFileTypes = ['*/*'],
    maxFileSize,
    onFileSelect,
    supportedFormatsText = 'Supports all file types',
    initialFileName = '',
}: FileUploadProps) => {
    // Init Display States
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    // Init File States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customFilename, setCustomFilename] = useState(initialFileName);

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

    const processFile = (file: File) => {
        // Ensure File is Passed
        if (!file) {
            setStatus('No file selected');
            return;
        }

        // Ensure File is Valid type
        if (!isValidFileType(file)) {
            setStatus(`Invalid file type. Please select a ${allowedFileTypes.join(', ')} file`);
            return;
        }

        // Ensure File is Valid size
        if (maxFileSize && file.size > maxFileSize) {
            setStatus(`File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
            return;
        }

        // Extract original filename without extension for the input field
        const extension = file.name.split('.').pop() || '';
        const originalName = file.name.replace(`.${extension}`, '');
        setCustomFilename(originalName);
        setSelectedFile(file);
        setStatus('');

        // Create preview for images
        if (file.type.startsWith('image/')) {
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
            setPreview(null);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        setCustomFilename('');
        setStatus('');
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setStatus('Please select a file first');
            return;
        }

        try {
            setStatus('Processing...');

            // Create new file with custom filename if it's different
            let fileToSubmit = selectedFile;

            if (customFilename !== selectedFile.name.replace(`.${selectedFile.name.split('.').pop() || ''}`, '')) {
                const extension = selectedFile.name.split('.').pop() || '';
                const newFilename = `${customFilename}.${extension}`;
                fileToSubmit = new File([selectedFile], newFilename, {
                    type: selectedFile.type,
                });
            }

            // Call the callback function provided by parent component
            await onFileSelect(fileToSubmit, customFilename);

            setStatus('File processed successfully!');
        } catch (error) {
            if (error instanceof Error) {
                setStatus('Processing failed: ' + error.message);
            } else {
                setStatus('Processing failed: Unknown error');
            }
        }
    };

    const previewDisplay = (
        <>
            {/* Preview an Image */}
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                    style={{ height: 'auto', width: 'auto', maxWidth: '256px', maxHeight: '400px' }}
                />
            )}
            {/* Preview a File */}
            {!preview && selectedFile && (
                <div
                    className="w-full flex items-center justify-between rounded bg-gray-100 py-4 px-5"
                    // style={{ width: '256px', height: '200px' }}
                >
                    <Icon name="FileText" size={48} color="grey" />
                    <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
            )}
        </>
    );

    return (
        <div className="max-w-md mx-auto w-full">
            <div className="w-full mx-auto ">
                <h1>{title}</h1>
                <div>
                    <Divider width="100%" />
                </div>
            </div>
            <div>
                {!selectedFile ? (
                    <div
                        className={`border-2 max-w-md mx-auto border-dashed rounded-lg p-8 text-center ${
                            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="w-full flex justify-center">
                            <Icon name="UploadSimple" size={48} color="grey" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Drag and drop your file here</p>
                        <p className="text-xs text-gray-500 mb-4">{supportedFormatsText}</p>
                        <div className="flex items-center justify-center">
                            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                                Select File
                                <input type="file" className="hidden" accept={allowedFileTypes.join(',')} onChange={handleFileInput} />
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 flex-col  w-full  mx-auto md:justify-between items-center">
                        {previewDisplay}
                        <div className="w-full flex flex-row justify-start">
                            <div className="w-full">
                                <TextInput
                                    name="filename"
                                    title="Filename:"
                                    value={customFilename}
                                    onChange={(e) => setCustomFilename(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Extension: .{selectedFile.name.split('.').pop()}</p>
                                {status && <p className="text-sm text-gray-600">{status}</p>}
                            </div>
                        </div>
                        <div className="self-end flex gap-3 flex-col">
                            <div className="flex gap-2">
                                {status === 'File processed successfully!' ? (
                                    <Button type="button" onClick={handleRemoveFile} fullWidth>
                                        Upload Another
                                    </Button>
                                ) : (
                                    <>
                                        <Button type="button" color="error" onClick={handleRemoveFile}>
                                            Remove
                                        </Button>
                                        <Button type="button" onClick={handleSubmit} fullWidth>
                                            Submit
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
