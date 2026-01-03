import { UPLOAD_CONFIG } from './upload-config';

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
      // Keep old format for backward compatibility
      return filename;
    }
    // New format: /api/uploads/filename
    if (filename.startsWith('/api/uploads/')) {
      return filename;
    }
    // If it's just a path starting with /, assume it's the new format
    return filename;
  }

  // Check if it contains the old path structure
  if (filename.includes('/lessons/images/')) {
    return filename;
  }

  // Check if it's stored as just a filename (new format)
  // Extract just the filename if it contains path separators but not starting with /
  const justFilename =
    filename.split('/').pop() || filename.split('\\').pop() || filename;

  // New format: just filename, use the uploads API
  return UPLOAD_CONFIG.getImageUrl(justFilename);
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
