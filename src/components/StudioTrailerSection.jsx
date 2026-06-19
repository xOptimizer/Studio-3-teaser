import { useEffect, useRef, useState } from 'react';
import { highlightThirdVideo } from '../utils';

const StudioTrailerSection = () => {
  const videoRef = useRef(null);
  const retryCountRef = useRef(0);
  const [videoSrc, setVideoSrc] = useState(highlightThirdVideo);
  const [videoKey, setVideoKey] = useState(0);

  // Force video reload when source changes
  useEffect(() => {
    setVideoKey(prev => prev + 1);
  }, [videoSrc]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        // Video metadata loaded - try to play (important for production)
        if (video.readyState >= 2) {
          video.play().catch(err => {
            console.log('Video play error on loadedmetadata:', err);
          });
        }
      };

      const handleCanPlay = () => {
        // Video is ready to play - ensure it plays (critical for production)
        if (video.paused) {
          setTimeout(() => {
            video.play().catch(err => {
              console.log('Video play error on canplay:', err);
            });
          }, 100);
        }
      };

      const handleError = (e) => {
        const error = e.target.error;
        console.error('Video error:', error);
        console.error('Video error details:', {
          code: error?.code,
          message: error?.message,
          readyState: e.target.readyState,
          networkState: e.target.networkState,
          src: e.target.currentSrc || e.target.src
        });

        // If blocked by client (ad blocker) or network error, try direct path
        if ((error?.code === 4 || error?.code === 2) && retryCountRef.current === 0) {
          console.log('Attempting to load video with direct path...');
          // Try using direct path as fallback
          const directPath = '/assets/videos/hightlight-sec.mp4';
          retryCountRef.current = 1;
          setVideoSrc(directPath);
          setVideoKey(prev => prev + 1); // Force video element to reload
          // Force reload
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.load();
            }
          }, 100);
        }
      };


      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      // Try to play immediately if video is already loaded
      if (video.readyState >= 2) {
      video.play().catch(err => {
        console.log('Video play error:', err);
      });
      }

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  return (
    <section
      className="w-full bg-gradient-to-b from-[#f5f0e8] to-[#f0ebe0] min-h-screen flex items-center justify-center"
      style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapAlign: 'start' }}
    >
      {/* Video Container */}
      <div 
        className="relative rounded-sm shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl"
        style={{ 
          width: '95%',
          height: '95%',
          maxWidth: '95vw',
          maxHeight: '95vh',
          aspectRatio: '894.22 / 503'
        }}
      >
        <video
          key={videoKey}
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline={true}
          preload="auto"
          loop
          onLoadedMetadata={(e) => {
            // Additional handler for production compatibility
            if (e.target.readyState >= 2) {
              e.target.play().catch(err => {
                console.log('Video play error on loadedmetadata (inline):', err);
              });
            }
          }}
          onCanPlay={() => {
            // Additional handler for production compatibility
            if (videoRef.current && videoRef.current.paused) {
              setTimeout(() => {
                videoRef.current?.play().catch(err => {
                  console.log('Video play error on canplay (inline):', err);
                });
              }, 100);
            }
          }}
          onError={(e) => {
            const error = e.target.error;
            console.error('Video error (inline):', error, {
              src: e.target.currentSrc || e.target.src,
              readyState: e.target.readyState,
              networkState: e.target.networkState
            });
            
            // If blocked by client (ad blocker) or network error, try direct path
            if ((error?.code === 4 || error?.code === 2) && retryCountRef.current === 0) {
              console.log('Attempting to load video with direct path (from inline handler)...');
              const directPath = '/assets/videos/hightlight-sec.mp4';
              retryCountRef.current = 1;
              setVideoSrc(directPath);
              setVideoKey(prev => prev + 1); // Force video element to reload
            }
          }}
        >
          <source src={`${videoSrc}?v=${videoKey}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default StudioTrailerSection;

