import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { LIMIT } from '../config/constants.js';

// Multer in memory (does not save temporary file)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: LIMIT.PROFILE_IMAGE }, // 5MB
});

//Generic middleware that compresses the image
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Compress image with Sharp
    const compressedImage = await sharp(req.file.buffer)
      .resize(800) // Maximum width 800px
      .jpeg({ quality: 80 }) // Compress to 80% quality
      .toBuffer();

    // Replace original buffer with compressed one
    req.file.buffer = compressedImage;
    req.file.size = compressedImage.length;

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware final que combina Multer + Compresión
export const uploadImage = [upload.single('image'), compressImage];
