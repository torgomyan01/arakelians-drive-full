import { UPLOAD_CONFIG } from './upload-config';
import { ImageLoaderProps } from 'next/image';

/**
 * Get the full URL for an image
 * Supports both old format (stored in public/lessons/images) and new format (stored in uploads)
 *
 * @param filename - The image filename (may be just filename or full path)
 * @returns Full URL to the image
 */
export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) {
    return '';
  }

  // If it's already a full URL, return it as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  // If it starts with /, it's already a path - check if it's old or new format
  if (filename.startsWith('/')) {
    // Old format: /lessons/images/filename
    if (filename.startsWith('/lessons/images/')) {
      // For old images, also load from server
      return `https://arakelians-drive.am${filename}`;
    }
    // New format: /api/uploads/filename
    if (filename.startsWith('/api/uploads/')) {
      // Convert to full server URL
      return `https://arakelians-drive.am${filename}`;
    }
    // If it's just a path starting with /, assume it's the new format
    return `https://arakelians-drive.am${filename}`;
  }

  // Check if it contains the old path structure
  if (filename.includes('/lessons/images/')) {
    // Extract the path and convert to server URL
    const path = filename.startsWith('/') ? filename : `/${filename}`;
    return `https://arakelians-drive.am${path}`;
  }

  // Check if it's stored as just a filename (new format)
  // Extract just the filename if it contains path separators but not starting with /
  const justFilename =
    filename.split('/').pop() || filename.split('\\').pop() || filename;

  // New format: just filename, use the uploads API
  return UPLOAD_CONFIG.getImageUrl(justFilename);
}

/**
 * Custom loader for Next.js Image component
 * Returns the image URL as-is without optimization since images are served from API route
 * This ensures images load correctly from the uploads folder
 */
export function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // If src is already a full URL, return it as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If src is a relative path, convert to full URL
  if (src.startsWith('/')) {
    return `https://arakelians-drive.am${src}`;
  }

  // Otherwise, treat as filename and use uploads API
  return UPLOAD_CONFIG.getImageUrl(src);
}

/**
 * Check if an image exists in the old location (for migration purposes)
 */
export function isOldImagePath(filename: string): boolean {
  return (
    filename.includes('/lessons/images/') ||
    filename.startsWith('/lessons/images/')
  );
}
