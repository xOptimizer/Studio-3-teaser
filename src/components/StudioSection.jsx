import { useEffect, useRef, useState } from 'react';
import { highlightThirdVideo } from '../utils';

const StudioSection = () => {
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
      id="studio"
      className="w-full min-h-screen flex flex-col items-center justify-center py-24 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        scrollSnapAlign: 'start',
        background: 'linear-gradient(to bottom, #F7F7F7, #EDEDED)'
      }}
    >
      <div className="w-full flex flex-col items-center">
        {/* Desktop: Fixed width layout */}
        <div className="hidden md:flex flex-col items-center w-full">
          {/* Heading Section - Aligned to Placeholder */}
          <div className="flex flex-col items-start mb-8" style={{ width: '1227px' }}>
            <h2 
              className="mb-4"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24pt',
                lineHeight: '1.2',
                color: '#000'
              }}
            >
              The Studio
            </h2>
            <p 
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '40pt',
                lineHeight: '1.3',
                color: '#848597'
              }}
            >
              A creative home, not just a workspace.
            </p>
          </div>

          {/* Video Container */}
          <div 
            className="rounded-lg mb-8 overflow-hidden"
            style={{
              width: '1227px',
              height: '621px'
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
                if (e.target.readyState >= 2) {
                  e.target.play().catch(err => {
                    console.log('Video play error on loadedmetadata (inline):', err);
                  });
                }
              }}
              onCanPlay={() => {
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
                
                if ((error?.code === 4 || error?.code === 2) && retryCountRef.current === 0) {
                  console.log('Attempting to load video with direct path (from inline handler)...');
                  const directPath = '/assets/videos/hightlight-sec.mp4';
                  retryCountRef.current = 1;
                  setVideoSrc(directPath);
                  setVideoKey(prev => prev + 1);
                }
              }}
            >
              <source src={`${videoSrc}?v=${videoKey}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Body Text - Aligned to Placeholder */}
          <div className="flex items-start" style={{ width: '1227px' }}>
            <p 
              className="flex-1"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '18pt',
                lineHeight: '1.6',
                color: '#848597'
              }}
            >
              Our flagship <strong style={{ color: '#000' }}>Dallas</strong> studio blends creation, community, and wellness - a true <strong style={{ color: '#000' }}>third space</strong> for creatives.
            </p>
          </div>
        </div>

        {/* Mobile: Responsive layout */}
        <div className="md:hidden flex flex-col items-center w-full px-4">
          {/* Heading Section */}
          <div className="flex flex-col items-start mb-6 w-full">
            <h2 
              className="mb-4"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(18pt, 5vw, 24pt)',
                lineHeight: '1.2',
                color: '#000'
              }}
            >
              The Studio
            </h2>
            <p 
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(24pt, 7vw, 40pt)',
                lineHeight: '1.3',
                color: '#848597'
              }}
            >
              A creative home, not just a workspace.
            </p>
          </div>

          {/* Video Container */}
          <div 
            className="rounded-lg mb-6 overflow-hidden"
            style={{
              width: '360px',
              height: '400px',
              maxWidth: '100%'
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
                if (e.target.readyState >= 2) {
                  e.target.play().catch(err => {
                    console.log('Video play error on loadedmetadata (inline):', err);
                  });
                }
              }}
              onCanPlay={() => {
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
                
                if ((error?.code === 4 || error?.code === 2) && retryCountRef.current === 0) {
                  console.log('Attempting to load video with direct path (from inline handler)...');
                  const directPath = '/assets/videos/hightlight-sec.mp4';
                  retryCountRef.current = 1;
                  setVideoSrc(directPath);
                  setVideoKey(prev => prev + 1);
                }
              }}
            >
              <source src={`${videoSrc}?v=${videoKey}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Body Text */}
          <div className="flex items-start w-full">
            <p 
              className="flex-1"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(14pt, 4vw, 18pt)',
                lineHeight: '1.6',
                color: '#848597'
              }}
            >
              Our flagship <strong style={{ color: '#000' }}>Dallas</strong> studio blends creation, community, and wellness - a true <strong style={{ color: '#000' }}>third space</strong> for creatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;

