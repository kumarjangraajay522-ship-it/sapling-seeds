import { assets } from '../assets/assets';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

/**
 * Universal Image Resolver
 * Ensures images added in Admin Portal or code look the same everywhere.
 * Handles:
 * - Local asset keys (from assets.js)
 * - Relative server paths (/uploads/...)
 * - External URLs (Unsplash, Cloudinary, etc.)
 */
export const resolveImageUrl = (imageSource, itemName = '') => {
  if (!imageSource) return 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';

  // 1. Check local assets mapping (if key is passed)
  if (assets[imageSource]) return assets[imageSource];

  // 2. Check if it's already a resolved Vite asset path or absolute URL
  if (typeof imageSource === 'string' && (
      imageSource.startsWith('/src/') || 
      imageSource.startsWith('/@fs/') || 
      imageSource.startsWith('/assets/') ||
      imageSource.startsWith('blob:') ||
      imageSource.startsWith('data:') ||
      imageSource.startsWith('http')
  )) {
    return imageSource;
  }

  // 3. Check if it's a relative path from the backend (needs BASE_URL)
  if (typeof imageSource === 'string' && imageSource.startsWith('/')) {
    return `${BASE_URL}${imageSource}`;
  }

  // 4. Fallback: Try to match item name to local assets
  if (itemName) {
    const assetKeys = Object.keys(assets);
    const normalizedName = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = assetKeys.find(key => normalizedName.includes(key.toLowerCase()));
    if (match) return assets[match];
  }

  // 5. Special check for backend-uploaded filenames (if no asset match)
  if (typeof imageSource === 'string' && !imageSource.startsWith('/') && !imageSource.startsWith('http')) {
    return `${BASE_URL}/uploads/${imageSource}`;
  }

  // 6. Final Placeholder
  return 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';
};
