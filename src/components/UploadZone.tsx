import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadImage } from '@/lib/imageProcessor';
import type { UploadedImage } from '@/types/assets';

interface UploadZoneProps {
  label: string;
  description: string;
  requiredWidth?: number;
  requiredHeight?: number;
  accept: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
}

export function UploadZone({
  label,
  description,
  requiredWidth,
  requiredHeight,
  accept,
  value,
  onChange,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      try {
        const image = await loadImage(file);

        if (requiredWidth && requiredHeight) {
          if (image.width !== requiredWidth || image.height !== requiredHeight) {
            setError(`Image must be ${requiredWidth}x${requiredHeight} pixels`);
            return;
          }
        }

        onChange(image);
      } catch {
        setError('Failed to load image');
      }
    },
    [requiredWidth, requiredHeight, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    onChange(null);
    setError(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-card p-4"
          >
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src={value.dataUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{value.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {value.width} × {value.height} px
                </p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Ready
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`upload-zone ${isDragging ? 'upload-zone-active' : ''} cursor-pointer`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-${label}`)?.click()}
          >
            <input
              id={`file-${label}`}
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                {isDragging ? (
                  <ImageIcon className="w-6 h-6 text-primary" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
