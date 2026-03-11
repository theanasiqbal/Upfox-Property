'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, X, Film, CheckCircle } from 'lucide-react';

interface VideoUploadProps {
    onVideoChange: (url: string) => void;
    existingVideo?: string;
}

export function VideoUpload({ onVideoChange, existingVideo = '' }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string>(existingVideo);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    // Abort controller for cancelling uploads
    const abortControllerRef = useRef<AbortController | null>(null);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('video/')) {
            setError('Please select a valid video file (MP4, WebM, etc).');
            return;
        }

        // 100MB limit
        if (file.size > 100 * 1024 * 1024) {
            setError('Video exceeds 100MB limit.');
            return;
        }

        setUploading(true);
        setError('');
        setProgress(0);

        abortControllerRef.current = new AbortController();

        try {
            // 1. Fetch Signature from our Backend
            const sigRes = await fetch('/api/upload/signature');
            const sigData = await sigRes.json();

            if (!sigRes.ok) {
                throw new Error(sigData.error || 'Failed to get upload signature');
            }

            // 2. Prepare FormData for Cloudinary Direct Upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', sigData.apiKey);
            formData.append('timestamp', sigData.timestamp.toString());
            formData.append('signature', sigData.signature);
            formData.append('folder', 'upfoxx-properties');

            // 3. Upload directly to Cloudinary using XMLHttpRequest to track progress
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`, true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            };

            const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(JSON.parse(xhr.responseText).error?.message || 'Upload failed'));
                    }
                };
                xhr.onerror = () => reject(new Error('Network error during upload'));
                xhr.onabort = () => reject(new Error('Upload cancelled'));
            });

            // Attach abort signal to XHR
            abortControllerRef.current.signal.addEventListener('abort', () => xhr.abort());

            xhr.send(formData);

            const result = await uploadPromise;

            setPreview(result.secure_url);
            onVideoChange(result.secure_url);

        } catch (e: any) {
            if (e.message !== 'Upload cancelled') {
                setError(e.message || 'Upload failed');
            }
        } finally {
            setUploading(false);
            setProgress(0);
            abortControllerRef.current = null;
        }
    };

    const cancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                uploadFile(files[0]);
            }
        },
        []
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    };

    const removeVideo = () => {
        setPreview('');
        onVideoChange('');
        if (uploading) cancelUpload();
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone (Only show if no video uploaded/uploading) */}
            {!preview && !uploading && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging
                        ? 'border-accent-purple bg-accent-purple/5 dark:bg-accent-purple/10'
                        : 'border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-accent-purple hover:bg-accent-purple/5 dark:hover:bg-accent-purple/10'
                        }`}
                >
                    <label className="cursor-pointer">
                        <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileInput} className="hidden" />
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 dark:bg-accent-purple/20 flex items-center justify-center mb-4">
                                <Film className="w-7 h-7 text-accent-purple" />
                            </div>
                            <p className="text-gray-900 dark:text-white font-medium mb-1">
                                {isDragging ? 'Drop video here' : 'Select a Cover Video (Optional)'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                or <span className="text-accent-purple font-medium">browse files</span>
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                MP4, WebM up to 100MB
                            </p>
                        </div>
                    </label>
                </div>
            )}

            {/* Upload Progress State */}
            {uploading && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-accent-purple animate-bounce" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Uploading Video...</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{progress}% Complete</p>
                            </div>
                        </div>
                        <button
                            onClick={cancelUpload}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-accent-purple h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Preview Player */}
            {preview && !uploading && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-200 dark:border-gray-800">
                    <video
                        src={preview}
                        controls
                        className="w-full h-full object-contain"
                    />

                    {/* Top Bar overlays */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start pointer-events-none">
                        <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-green-500/90 text-white rounded-md backdrop-blur-sm pointer-events-auto">
                            <CheckCircle className="w-3.5 h-3.5" /> Uploaded
                        </span>

                        <button
                            type="button"
                            onClick={removeVideo}
                            className="w-8 h-8 rounded-full bg-red-500/80 text-white hover:bg-red-500 flex items-center justify-center transition-colors pointer-events-auto shadow-sm"
                            title="Remove Video"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
