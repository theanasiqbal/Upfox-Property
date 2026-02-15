'use client';

import { useCallback, useState } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export function ImageUpload({ onImagesChange, maxImages = 10, existingImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      addImages(files);
    },
    [images, maxImages]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (newFiles: File[]) => {
    const remaining = maxImages - images.length;
    const filesToAdd = newFiles.slice(0, remaining);
    const updated = [...images, ...filesToAdd];
    setImages(updated);
    onImagesChange(updated);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging
            ? 'border-accent-purple bg-accent-purple/5 dark:bg-accent-purple/10'
            : 'border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-accent-purple hover:bg-accent-purple/5 dark:hover:bg-accent-purple/10'
          }`}
      >
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 dark:bg-accent-purple/20 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-accent-purple" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or <span className="text-accent-purple font-medium">browse files</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {images.length}/{maxImages} images • PNG, JPG, WebP up to 5MB
            </p>
          </div>
        </label>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 aspect-video">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
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
