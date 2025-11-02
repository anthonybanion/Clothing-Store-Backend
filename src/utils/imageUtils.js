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
  // Create folder if it doesn't exist
  const folderPath = `uploads/${folder}`;
  await fs.mkdir(folderPath, { recursive: true });

  // Generate unique name
  const filename = `${prefix}-${Date.now()}.jpg`;
  const filepath = path.join(folderPath, filename);

  // Save compressed image
  await sharp(imageBuffer).jpeg({ quality: 80 }).toFile(filepath);

  return `/uploads/${folder}/${filename}`;
}
