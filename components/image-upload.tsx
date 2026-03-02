'use client';

import { useCallback, useState } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export function ImageUpload({ onImagesChange, maxImages = 10, existingImages = [] }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const uploadFiles = async (files: File[]) => {
    if (previews.length >= maxImages) return;
    const remaining = maxImages - previews.length;
    const filesToUpload = files.slice(0, remaining);

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('images', f));

      const res = await fetch('/api/upload/images', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const newUrls: string[] = data.images.map((img: { url: string }) => img.url);
      const updated = [...previews, ...newUrls];
      setPreviews(updated);
      onImagesChange(updated);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      uploadFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')));
    },
    [previews, maxImages]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files || []));
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
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
          <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 dark:bg-accent-purple/20 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-accent-purple" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">
              {uploading ? 'Uploading to Cloudinary…' : isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or <span className="text-accent-purple font-medium">browse files</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {previews.length}/{maxImages} images • PNG, JPG, WebP up to 5MB
            </p>
          </div>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 aspect-video">
              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-8 h-8 rounded-full bg-red-500/80 text-white hover:bg-red-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-accent-purple text-white rounded-md">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
