import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { UPLOAD_CONFIG } from './upload-config';

/**
 * Delete an image file
 * Supports both old format (public/lessons/images) and new format (uploads)
 *
 * @param imagePath - The image path or filename
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteImageFile(
  imagePath: string | null | undefined
): Promise<void> {
  if (!imagePath) {
    return;
  }

  try {
    let filepath: string;

    // Check if it's a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Extract filename from URL
      const urlParts = imagePath.split('/');
      const filename = urlParts[urlParts.length - 1];
      filepath = join(UPLOAD_CONFIG.UPLOAD_DIR, filename);
    }
    // Check if it's the old format path
    else if (imagePath.includes('/lessons/images/')) {
      // Old format: extract filename
      const filename = imagePath.split('/').pop() || imagePath;
      filepath = join(process.cwd(), 'public', 'lessons', 'images', filename);
    }
    // Check if it's the new format path
    else if (imagePath.startsWith('/api/uploads/')) {
      // New format: extract filename
      const filename = imagePath.split('/').pop() || imagePath;
      filepath = join(UPLOAD_CONFIG.UPLOAD_DIR, filename);
    }
    // Assume it's just a filename (new format)
    else {
      // Try new location first
      filepath = join(UPLOAD_CONFIG.UPLOAD_DIR, imagePath);
      if (!existsSync(filepath)) {
        // Try old location as fallback
        filepath = join(
          process.cwd(),
          'public',
          'lessons',
          'images',
          imagePath
        );
      }
    }

    // Delete file if it exists
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  } catch (error: any) {
    // Log error but don't throw - image deletion failure shouldn't break the main operation
    console.error('Error deleting image file:', error);
  }
}
