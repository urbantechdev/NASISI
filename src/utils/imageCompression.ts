/**
 * Image Compression Utility for Web & Firestore Persistence.
 * 
 * Automatically downsizes and compresses image files (JPG, PNG, WebP)
 * to ensure crisp high-resolution display while keeping payload sizes
 * well below Firestore's 1MB document limit and localStorage quotas.
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export const compressImageFile = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  const {
    maxDimension = 1600,
    quality = 0.82,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image smoothed onto canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized data URL
        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
