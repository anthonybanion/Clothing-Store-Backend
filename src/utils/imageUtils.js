// ==========================================
//
// Description: Image utility functions
//
// File: imageUtils.js
// Author: Anthony Bañon
// Created: 2025-11-02
// Last Updated: 2025-11-03
// Changes: Added image processing, saving, and deletion functions
// ==========================================

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Save compressed image and return URL
 *
 * param {Buffer} imageBuffer - Image buffer
 * param {string} folder - Destination folder (products, categories, persons)
 * param {string} prefix - Prefix for name (product, category, person)
 * returns {Promise<string>} Image URL
 */
export async function saveImageAndGetUrl(imageBuffer, folder, prefix) {
  const folderPath = `uploads/${folder}`;
  await fs.mkdir(folderPath, { recursive: true });

  const timestamp = Date.now();

  // Tamaños específicos para ecommerce
  const sizes = [
    { width: 280, height: 280, suffix: 'desktop', quality: 85 }, // desktop
    { width: 173, height: 173, suffix: 'mobile', quality: 80 }, // mobile
    { width: 40, height: 40, suffix: 'thumbnail', quality: 75 }, // thumbnail
  ];

  const imageUrls = {};

  for (const size of sizes) {
    const filename = `${prefix}-${timestamp}-${size.suffix}.webp`;
    const filepath = path.join(folderPath, filename);

    await sharp(imageBuffer)
      .resize(size.width, size.height, {
        fit: 'cover', // ← 'cover' to crop and maintain proportions
        position: 'center',
      })
      .webp({ quality: size.quality })
      .toFile(filepath);

    imageUrls[size.suffix] = `/uploads/${folder}/${filename}`;
  }

  return imageUrls;
}

/**
 * Process image update - handles image updates, deletions, and preserving existing images
 *
 * param {Buffer|null|undefined} imageData - Image data (buffer, null, or undefined)
 * param {string} folder - Destination folder (products, categories, persons)
 * param {string} prefix - Prefix for name (product, category, person)
 * returns {Promise<Object|null|undefined>} Processed image data
 */
export async function processImageUpdate(imageData, folder, prefix) {
  // Si se proporciona una nueva imagen (buffer)
  if (
    imageData !== undefined &&
    imageData !== null &&
    Buffer.isBuffer(imageData)
  ) {
    const imageUrls = await saveImageAndGetUrl(imageData, folder, prefix);
    return imageUrls;
  }

  // Si explicitamente se envía null, eliminar la imagen
  if (imageData === null) {
    return null;
  }

  // Si no se envía el campo image (undefined), mantener la imagen existente
  return undefined;
}

/**
 * Delete image files from filesystem
 *
 * param {Object} imageUrls - Image URLs object {desktop: url, mobile: url, thumbnail: url}
 * param {string} folder - Folder where images are stored (products, categories, persons)
 */
export async function deleteImageFiles(imageObject, folder) {
  // Extract only the URLs from the image object
  const imageUrls = imageObject.toObject ? imageObject.toObject() : imageObject;
  // Make sure it is a valid object
  if (!imageUrls || typeof imageUrls !== 'object') return;

  try {
    for (const [size, url] of Object.entries(imageUrls)) {
      // Skip non-URL fields
      if (size === '_id') continue;
      // Build file path
      if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
        const filename = path.basename(url);
        const filepath = path.join(process.cwd(), 'uploads', folder, filename);
        // Delete file
        await fs.unlink(filepath);
        console.log('✅ Deleted:', filepath);
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}
