// ==========================================
//
// Description: Image utility functions
//
// File: imageUtils.js
// Author: Anthony Bañon
// Created: 2025-11-02
// Last Updated: 2025-11-02
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
 * Delete image files from filesystem
 *
 * param {Object} imageUrls - Image URLs object {desktop: url, mobile: url, thumbnail: url}
 * param {string} folder - Folder where images are stored (products, categories, persons)
 */
export async function deleteImageFiles(imageUrls, folder) {
  if (!imageUrls) return;

  try {
    for (const [size, url] of Object.entries(imageUrls)) {
      if (url) {
        const filename = path.basename(url);
        const filepath = path.join('uploads', folder, filename);
        await fs.unlink(filepath);
      }
    }
  } catch (error) {
    console.log(`Some images could not be deleted: ${error.message}`);
  }
}
