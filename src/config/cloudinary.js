// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

/**
 * Configuración de Cloudinary para uploads
 */
export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};

export const initializeCloudinary = () => {
  cloudinary.config(cloudinaryConfig);
  console.log('✅ Cloudinary configured');
  return cloudinary;
};

// Presets para diferentes tipos de uploads
export const uploadPresets = {
  profile: {
    folder: 'profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
  documents: {
    folder: 'documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
  },
};
