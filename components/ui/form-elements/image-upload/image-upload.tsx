'use client';
import { ImageUploadProps } from './image-upload.types';
import { useState, useCallback, FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { Button, Divider } from 'thread-ui';

const ImageUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customFilename, setCustomFilename] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = (file: File) => {
        if (!file || !file.type.startsWith('image/')) {
            setUploadStatus('Please select an image file');
            setSelectedFile(null);
            setCustomFilename('');
            return;
        }

        // Extract original filename without extension for the input field
        const extension = file.name.split('.').pop() || '';
        const originalName = file.name.replace(`.${extension}`, '');
        setCustomFilename(originalName);
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                setPreview(result);
            }
        };
        reader.readAsDataURL(file);
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
        setUploadStatus('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadStatus('Please select a file first');
            return;
        }

        // Create new file with custom filename
        const extension = selectedFile.name.split('.').pop() || '';
        const newFilename = `${customFilename}.${extension}`;

        const formData = new FormData();
        const modifiedFile = new File([selectedFile], newFilename, {
            type: selectedFile.type,
        });
        formData.append('image', modifiedFile);

        try {
            setUploadStatus('Uploading...');
            const response = await fetch('/api/addPhoto', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            setPreview(data.url);
            setUploadStatus('Upload successful!');
        } catch (error) {
            if (error instanceof Error) {
                setUploadStatus('Upload failed: ' + error.message);
            } else {
                setUploadStatus('Upload failed: Unknown error');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="w-64 md:w-full mx-auto max-w-md">
                <h1>Add a Photo</h1>
                <div>
                    <Divider width="100%" />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                {!selectedFile ? (
                    <div
                        className={`border-2 max-w-md mx-auto border-dashed rounded-lg p-8 text-center ${
                            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Drag and drop your image here</p>
                        <p className="text-xs text-gray-500 mb-4">Supports: JPG, PNG, GIF</p>
                        <div className="flex items-center justify-center">
                            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                                Select File
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 lg:flex-row w-full md:w-8/12 mx-auto flex-col md:flex-row md:justify-between items-center">
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded"
                                style={{ height: 'auto', width: 'auto', maxWidth: '256px', maxHeight: '400px' }}
                            />
                        )}
                        <div className="space-y-4 md:self-end flex gap-3 flex-col">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filename:</label>
                                <input
                                    type="text"
                                    value={customFilename}
                                    onChange={(e) => setCustomFilename(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter filename (without extension)"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Extension: .{selectedFile.name.split('.').pop()}</p>
                                {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}
                            </div>
                            <div className="flex gap-2">
                                {uploadStatus === 'Upload successful!' ? (
                                    <Button type="button" onClick={handleRemoveFile} fullWidth>
                                        Submit Another
                                    </Button>
                                ) : (
                                    <>
                                        <Button type="button" color="error" onClick={handleRemoveFile}>
                                            Remove
                                        </Button>
                                        <Button type="submit" fullWidth>
                                            Upload Image
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ImageUpload;
