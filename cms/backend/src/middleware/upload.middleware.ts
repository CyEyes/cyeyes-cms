import multer from 'multer';

// Store in memory for validation (OWASP best practice)
// This allows us to validate file content before saving
const storage = multer.memoryStorage();

// File filter for basic MIME type checking
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/x-icon',
    'image/vnd.microsoft.icon',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPEG, and ICO files are allowed.'), false);
  }
};

// Export configured multer middleware
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max (will validate more strictly in service)
    files: 1, // Only one file at a time
  },
  fileFilter,
});
