import { useState, useEffect } from 'react';
import { appleImg } from '../utils';
import { heroVideo, smallHeroVideo } from '../utils';
import { highlightFirstVideo, highlightFirstVideoMobile, highlightSecondVideo, highlightSecondVideoMobile, highlightThirdVideo, highlightThirdVideoMobile } from '../utils';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const preloadAllResources = async () => {
      const resources = [
        // Hero videos
        heroVideo,
        smallHeroVideo,
        // Video carousel videos
        highlightFirstVideo,
        highlightFirstVideoMobile,
        highlightSecondVideo,
        highlightSecondVideoMobile,
        highlightThirdVideo,
        highlightThirdVideoMobile,
        // HowItWorks images
        '/assets/images/marketplace-desktop.jpg',
        '/assets/images/marketplace-mobile.jpg',
        '/assets/images/social-left.jpg',
        '/assets/images/social-right.jpg',
        '/assets/images/studio-main.jpg',
        '/assets/images/poolside.jpg',
        '/assets/images/wellness.jpg',
        // Hero fallback image
        '/assets/images/hero.jpeg',
        // TopBar logo
        appleImg
      ];

      let loaded = 0;
      const total = resources.length;

      const loadResource = (src) => {
        return new Promise((resolve) => {
          // Check if it's a video by extension or path
          if (src.endsWith('.mp4') || src.includes('/videos/')) {
            // Preload video
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.onloadedmetadata = () => {
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            video.onerror = () => {
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            video.src = src;
          } else {
            // Preload image
            const img = new Image();
            img.onload = () => {
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            img.onerror = () => {
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            img.src = src;
          }
        });
      };

      // Load all resources in parallel
      await Promise.all(resources.map(loadResource));

      // Wait for fonts
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Complete loading
      setProgress(100);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 300);
    };

    preloadAllResources();
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src={appleImg} 
          alt="Apple" 
          className="w-16 h-auto sm:w-20 md:w-24"
        />
      </div>

      {/* Loading Bar Container */}
      <div className="w-64 sm:w-80 md:w-96 h-1 bg-gray-300/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-300 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-gray text-sm sm:text-base mt-4 font-light">
        {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;
