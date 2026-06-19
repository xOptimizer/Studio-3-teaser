# Cloudinary CDN Setup Guide

This project uses Cloudinary as a CDN to optimize image and video loading speeds. All assets are served from Cloudinary with automatic optimization.

## Setup Instructions

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or use an existing account)
3. Navigate to your Dashboard

### 2. Get Your Cloud Name
1. In your Cloudinary Dashboard, you'll see your **Cloud Name** (e.g., `dxyz123abc`)
2. Copy this cloud name

### 3. Configure Environment Variable
1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your Cloudinary cloud name:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   ```
   Replace `your-cloud-name-here` with your actual Cloudinary cloud name.

3. **Important**: Restart your development server after adding the environment variable.

### 4. Upload Assets to Cloudinary

#### Folder Structure
All assets should be uploaded to a folder named `studio-3` in your Cloudinary account.

#### Upload Methods

**Option A: Using Cloudinary Dashboard**
1. Go to Media Library in your Cloudinary Dashboard
2. Create a folder named `studio-3`
3. Upload all images and videos to this folder
4. Keep the same filenames as in your local `public/assets/` directory

**Option B: Using Cloudinary CLI**
```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Upload all images
cloudinary upload_dir public/assets/images studio-3

# Upload all videos
cloudinary upload_dir public/assets/videos studio-3
```

**Option C: Using Cloudinary Upload API**
You can use the Cloudinary upload API to programmatically upload files.

#### Required Assets

**Images (upload to `studio-3` folder):**
- `marketplace-image-1.webp` - Marketplace feature image (AI-Powered Ecommerce)
- `marketplace-image-2.webp` - Marketplace feature image (Create with confidence)
- `marketplace-image-3.webp` - Marketplace feature image (Quality supplies, no markups)
- `artists-image-1.webp` - Quote section (Artists tab)
- `artists-image-2.webp` - Quote section (Artists tab)
- `artists-image-3.webp` - Quote section (Artists tab)
- `artists-image-4.webp` - Quote section (Artists tab)
- `buyers-image-1.webp` - Quote section (Buyers tab)
- `buyers-image-2.webp` - Quote section (Buyers tab)
- `AdobeStock_118182508.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_135490522.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_213841942.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_231517092.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_421538237.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_460628886.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_469893497.webp` - Quote section (Enthusiasts tab)
- `AdobeStock_785220762.webp` - Quote section (Enthusiasts tab)

**Videos (upload to `studio-3` folder):**
- `hero.mp4` - Hero section video (main landing video)
- `hightlight-sec.mp4` - Studio section video (desktop)
- `hightlight-third-mobile.mp4` - Studio section video (mobile)

**Note:** SVG files (like `apple.svg`, `search.svg`, `favicon.svg`, etc.) are kept as local assets since they're small and don't need optimization.

## How It Works

### Automatic Optimizations
- **Format Optimization**: Automatically serves WebP/AVIF when supported by the browser
- **Quality Optimization**: Uses `auto` quality for optimal file size vs quality balance
- **Responsive Images**: Images are resized based on the requested width
- **Progressive Loading**: Images use progressive JPEG for better perceived performance
- **Video Streaming**: Videos are optimized for streaming with adaptive bitrate

### URL Generation
The `src/utils/cloudinary.js` file contains utility functions that generate optimized Cloudinary URLs:

```javascript
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from './utils/cloudinary';

// Get optimized image URL
const imageUrl = getCloudinaryImageUrl('hero.jpeg', { 
  width: 1920, 
  quality: 'auto', 
  format: 'auto' 
});

// Get optimized video URL
const videoUrl = getCloudinaryVideoUrl('hero.mp4', { 
  width: 1920, 
  quality: 'auto',
  format: 'auto'
});
```

## Performance Benefits

1. **Faster Load Times**: CDN delivery from edge locations worldwide
2. **Automatic Optimization**: Images and videos are automatically optimized
3. **Format Conversion**: Modern formats (WebP, AVIF) served when supported
4. **Responsive Images**: Right-sized images for different screen sizes
5. **Lazy Loading**: Non-critical images load lazily
6. **Preloading**: Critical assets (hero video) are preloaded

## Troubleshooting

### Images/Videos Not Loading
1. Check that your `.env` file has the correct `VITE_CLOUDINARY_CLOUD_NAME`
2. Verify that assets are uploaded to the `studio-3` folder in Cloudinary
3. Ensure filenames match exactly (including spaces and capitalization)
4. Restart your development server after changing `.env`

### Wrong Cloud Name Error
If you see errors about "your-cloud-name", you need to:
1. Set the `VITE_CLOUDINARY_CLOUD_NAME` environment variable
2. Restart your development server

### Testing Locally
You can test with a placeholder cloud name, but for production, you must use your actual Cloudinary cloud name.

## Production Deployment

Make sure to set the `VITE_CLOUDINARY_CLOUD_NAME` environment variable in your hosting platform:
- **Vercel**: Add it in Project Settings → Environment Variables
- **Netlify**: Add it in Site Settings → Environment Variables
- **Other platforms**: Follow their documentation for setting environment variables

