// utils/fileUtils.ts
export const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  // Add more as needed
];

export const ALLOWED_FILE_EXTENSIONS = ALLOWED_FILE_TYPES
  .filter(type => type.includes('/'))
  .map(type => {
    const ext = type.split('/').pop();
    return ext === 'x-zip-compressed' ? 'zip' : ext;
  })
  .filter(Boolean) as string[];

// برای accept attribute
export const ACCEPT_FILE_STRING = ALLOWED_FILE_TYPES.join(',');