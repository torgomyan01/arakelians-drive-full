import { join } from 'path';

/**
 * Upload configuration
 * Images are stored outside the build directory to persist after builds
 */
export const UPLOAD_CONFIG = {
  // Upload directory at root level (outside public and build)
  UPLOAD_DIR: join(process.cwd(), 'uploads'),

  // Public URL path for accessing images
  PUBLIC_PATH: '/api/uploads',

  // Base URL - will be used to generate full URLs
  // Always use server URL so images load from server even in local development
  getBaseUrl: () => {
    // Always use the server URL for uploads
    return 'https://arakelians-drive.am';
  },

  // Generate full URL for an image
  getImageUrl: (filename: string) => {
    return `${UPLOAD_CONFIG.getBaseUrl()}${UPLOAD_CONFIG.PUBLIC_PATH}/${filename}`;
  },

  // Allowed image types
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],

  // Max file size (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
};
