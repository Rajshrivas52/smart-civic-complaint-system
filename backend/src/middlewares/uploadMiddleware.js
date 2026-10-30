import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage keeps buffer in memory so we can store it directly in MongoDB
const storage = multer.memoryStorage();

// Image file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedTypes.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, webp) are permitted.'), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

/**
 * Middleware wrapper to handle image upload and convert buffer to Base64 data URL
 * so it can be stored directly inside the MongoDB database document.
 */
export const handleImageUpload = (fieldName = 'image') => {
  const singleUpload = upload.single(fieldName);

  return (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image size exceeds maximum limit of 5MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // If file was uploaded via multipart/form-data, convert buffer to Base64 data URL
      if (req.file && req.file.buffer) {
        const mime = req.file.mimetype || 'image/jpeg';
        req.file.base64 = req.file.buffer.toString('base64');
        req.file.dataUrl = `data:${mime};base64,${req.file.base64}`;

        // Also write a disk backup for static access compatibility
        try {
          const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
          const filename = `complaint-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
          fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
          req.file.filename = filename;
          req.file.diskPath = `/uploads/${filename}`;
        } catch (diskErr) {
          console.warn('[Upload Middleware] Failed to write disk backup:', diskErr.message);
        }
      }

      next();
    });
  };
};
