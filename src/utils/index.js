import { getCloudinaryVideoUrl } from './cloudinary';

// Keep SVG files as local imports since they're small and don't need optimization
import apple from "/assets/images/apple.svg";

// Videos from Cloudinary - optimized for streaming
// Only videos that actually exist in public/assets/videos/
export const heroVideo = getCloudinaryVideoUrl('hero.mp4', { 
  width: 1920, 
  quality: 'auto',
  format: 'auto'
});

export const highlightThirdVideo = getCloudinaryVideoUrl('hightlight-sec.mp4', { 
  width: 1920, 
  quality: 'auto',
  format: 'auto'
});

export const highlightThirdVideoMobile = getCloudinaryVideoUrl('hightlight-third-mobile.mp4', { 
  width: 800, 
  quality: 'auto',
  format: 'auto'
});

// SVG images (kept as local)
export const appleImg = apple;