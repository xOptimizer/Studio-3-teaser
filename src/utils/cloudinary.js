/**
 * Cloudinary Utility
 * Generates optimized URLs for images and videos from Cloudinary CDN
 * 
 * Folder structure in Cloudinary: studio-3/
 * 
 * Usage:
 * import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from './utils/cloudinary';
 * const imageUrl = getCloudinaryImageUrl('hero.jpeg', { width: 1920, quality: 'auto' });
 * const videoUrl = getCloudinaryVideoUrl('hero.mp4', { quality: 'auto' });
 */

// Your Cloudinary cloud name - replace with your actual cloud name
// You can find this in your Cloudinary dashboard
// Set this via environment variable: VITE_CLOUDINARY_CLOUD_NAME
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'sahiltestaccount';
const FOLDER = 'studio-3';

// Warn if cloud name is not set (only in development)
if (import.meta.env.DEV && !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  console.log(
    'ℹ️ Using default Cloudinary cloud name: sahiltestaccount\n' +
    'To use a different cloud name, set VITE_CLOUDINARY_CLOUD_NAME in your .env file.'
  );
}

/**
 * Get optimized Cloudinary image URL
 * @param {string} filename - Image filename (e.g., 'hero.jpeg', 'AI Powered .webp')
 * @param {object} options - Optimization options
 * @param {number} options.width - Desired width in pixels
 * @param {number} options.height - Desired height in pixels (optional)
 * @param {string|number} options.quality - Quality: 'auto', or number 1-100
 * @param {string} options.format - Format: 'auto', 'webp', 'jpg', 'png', etc.
 * @param {string} options.crop - Crop mode: 'fill', 'fit', 'scale', etc.
 * @param {boolean} options.fetchFormat - Auto format based on browser support
 * @returns {string} Optimized Cloudinary URL
 */
export const getCloudinaryImageUrl = (filename, options = {}) => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    fetchFormat = 'auto',
    cacheBust, // Optional cache busting parameter (timestamp or version number)
  } = options;

  // Build transformation parameters
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (fetchFormat) transformations.push(`f_${fetchFormat}`);

  // Add responsive and optimization flags
  transformations.push('fl_progressive'); // Progressive JPEG
  transformations.push('fl_immutable_cache'); // Cache optimization

  const transformationString = transformations.join(',');
  // URL encode the folder and filename to handle spaces and special characters
  const encodedPath = `${FOLDER}/${filename}`.split('/').map(encodeURIComponent).join('/');

  // Build base URL
  let url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/${encodedPath}`;
  
  // Add cache busting query parameter if provided
  if (cacheBust) {
    url += `?_t=${cacheBust}`;
  }

  return url;
};

/**
 * Get optimized Cloudinary video URL
 * @param {string} filename - Video filename (e.g., 'hero.mp4', 'hightlight-sec.mp4')
 * @param {object} options - Optimization options
 * @param {number} options.width - Desired width in pixels
 * @param {number} options.height - Desired height in pixels (optional)
 * @param {string|number} options.quality - Quality: 'auto', or number 1-100
 * @param {string} options.format - Format: 'auto', 'mp4', 'webm', etc.
 * @param {string} options.crop - Crop mode: 'fill', 'fit', 'scale', etc.
 * @param {boolean} options.streaming - Enable streaming optimization
 * @returns {string} Optimized Cloudinary URL
 */
export const getCloudinaryVideoUrl = (filename, options = {}) => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    streaming = true,
  } = options;

  // Build transformation parameters
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (streaming) transformations.push('fl_streaming_attachment'); // Streaming optimization

  // Add video optimization flags
  transformations.push('fl_immutable_cache'); // Cache optimization

  const transformationString = transformations.join(',');
  // URL encode the folder and filename to handle spaces and special characters
  const encodedPath = `${FOLDER}/${filename}`.split('/').map(encodeURIComponent).join('/');

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformationString}/${encodedPath}`;
};

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} filename - Image filename
 * @param {object} baseOptions - Base optimization options
 * @returns {string} srcset string for responsive images
 */
export const getCloudinaryImageSrcSet = (filename, baseOptions = {}) => {
  const sizes = [
    { width: 400, suffix: '400w' },
    { width: 800, suffix: '800w' },
    { width: 1200, suffix: '1200w' },
    { width: 1600, suffix: '1600w' },
    { width: 1920, suffix: '1920w' },
  ];

  return sizes
    .map(({ width, suffix }) => {
      const url = getCloudinaryImageUrl(filename, { ...baseOptions, width });
      return `${url} ${suffix}`;
    })
    .join(', ');
};

/**
 * Get responsive video sources for different qualities
 * @param {string} filename - Video filename
 * @param {object} baseOptions - Base optimization options
 * @returns {Array} Array of source objects with src and type
 */
export const getCloudinaryVideoSources = (filename, baseOptions = {}) => {
  return [
    {
      src: getCloudinaryVideoUrl(filename, { ...baseOptions, format: 'webm', quality: 'auto' }),
      type: 'video/webm',
    },
    {
      src: getCloudinaryVideoUrl(filename, { ...baseOptions, format: 'mp4', quality: 'auto' }),
      type: 'video/mp4',
    },
  ];
};

/**
 * Preload critical assets for faster initial load
 * @param {Array<string>} urls - Array of asset URLs to preload
 */
export const preloadAssets = (urls) => {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = url.includes('/video/') ? 'video' : 'image';
    link.href = url;
    if (url.includes('/video/')) {
      link.setAttribute('as', 'video');
      link.setAttribute('type', 'video/mp4');
    }
    document.head.appendChild(link);
  });
};

