import { useState, useEffect } from 'react';
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
        '/assets/images/hero.jpeg'
      ];

      let loaded = 0;
      const total = resources.length;

      const loadResource = (src, isPriority = false) => {
        return new Promise((resolve) => {
          // Add timeout to prevent hanging
          const timeout = setTimeout(() => {
            loaded++;
            setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
            resolve();
          }, isPriority ? 10000 : 5000); // 10s for priority, 5s for others

          // Check if it's a video by extension or path
          if (src.endsWith('.mp4') || src.includes('/videos/')) {
            // Preload video - use 'auto' for hero videos to preload more data
            const video = document.createElement('video');
            video.preload = isPriority ? 'auto' : 'metadata';
            video.muted = true;
            video.playsInline = true;
            
            const cleanup = () => {
              clearTimeout(timeout);
              if (video.parentNode) {
                video.parentNode.removeChild(video);
              }
            };
            
            // For priority videos (hero), wait for more data to load
            if (isPriority) {
              // Use multiple events for better mobile compatibility
              const handleCanPlay = () => {
                cleanup();
                loaded++;
                setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
                resolve();
              };
              
              video.oncanplay = handleCanPlay;
              video.oncanplaythrough = handleCanPlay;
              video.onloadeddata = () => {
                // Fallback: if canplay doesn't fire, use loadeddata after a delay
                setTimeout(() => {
                  if (loaded < total) {
                    cleanup();
                    loaded++;
                    setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
                    resolve();
                  }
                }, 2000);
              };
            } else {
              video.onloadedmetadata = () => {
                cleanup();
                loaded++;
                setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
                resolve();
              };
            }
            
            video.onerror = () => {
              cleanup();
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            
            video.src = src;
            // Add video to DOM (some mobile browsers need this)
            video.style.display = 'none';
            document.body.appendChild(video);
          } else {
            // Preload image
            const img = new Image();
            img.onload = () => {
              clearTimeout(timeout);
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timeout);
              loaded++;
              setProgress(Math.min(Math.floor((loaded / total) * 100), 95));
              resolve();
            };
            img.src = src;
          }
        });
      };

      // Load hero videos with priority (preload more data)
      const heroVideos = [heroVideo, smallHeroVideo];
      const otherResources = resources.filter(r => !heroVideos.includes(r));
      
      // Start loading hero videos first with priority
      const heroPromises = heroVideos.map(src => loadResource(src, true));
      // Load other resources in parallel
      const otherPromises = otherResources.map(src => loadResource(src, false));
      
      // Wait for all resources to load with a maximum timeout
      try {
        await Promise.race([
          Promise.all([...heroPromises, ...otherPromises]),
          new Promise(resolve => setTimeout(resolve, 30000)) // 30s max timeout
        ]);
      } catch (error) {
        console.error('Error loading resources:', error);
      }

      // Wait for fonts with timeout
      try {
        if (document.fonts && document.fonts.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 2000)) // 2s timeout for fonts
          ]);
        } else {
          // Fallback: wait a short time if fonts API not available
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error loading fonts:', error);
      }

      // Complete loading - ensure we always reach 100%
      setProgress(100);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 300);
    };

    preloadAllResources();
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Three Dots Menu Icon + Studio 3 */}
      <div className="flex items-center gap-4 mb-8">
        {/* Circular Menu Icon */}
        <div 
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0"
          style={{ border: '1px solid #000' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
          </div>
        </div>
        
        {/* Studio 3 Text */}
        <h1 
          className="text-black whitespace-nowrap"
          style={{ 
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 700,
            fontSize: '100pt',
            lineHeight: '1.1'
          }}
        >
          studio 3
        </h1>
      </div>

      {/* Loading Bar Container */}
      <div className="w-64 sm:w-80 md:w-96 h-1 bg-gray-300/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-black text-sm sm:text-base mt-4 font-light">
        {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;
