import { useEffect, useRef, useState } from 'react';
import { heroVideo } from '../utils';

const HeroNew = () => {
  const videoRef = useRef(null);
  const retryCountRef = useRef(0);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        if (video.readyState >= 2) {
          video.play().catch(err => {
            console.log('Video play error on loadedmetadata:', err);
          });
        }
      };

      const handleCanPlay = () => {
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
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoKey]);

  return (
    <section
      id="about"
      className="w-full min-h-screen flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 relative md:justify-center"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: '#F7F7F7',
        scrollSnapAlign: 'start',
        paddingTop: '0',
        paddingBottom: 'clamp(0px, 0vw, 48px)'
      }}
    >
      <div className="w-full max-w-7xl flex flex-col items-center text-center flex-1 flex items-center justify-center">
        {/* Primary Heading - studio 3 - Mobile: 60pt, Desktop: 200pt */}
        <h1
          className="text-black text-[68pt] pt-[40px] mb-[24px] md:text-[200pt] md:pt-[96px] md:mb-[40px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            lineHeight: '1.1',
            margin: 0,
            display: 'block'
          }}
        >
          studio 3
        </h1>

        {/* Secondary Heading - Mobile: 20pt, Desktop: 48pt */}
        <h2
          className="text-black text-[20pt] mb-[24px] px-4 md:text-[48pt] md:mb-[40px] md:px-0"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            lineHeight: '1.2',
            marginTop: 0,
            display: 'block'
          }}
        >
          A Connected Ecosystem<br />Built for Creatives
        </h2>
      </div>

      {/* Video Container - Mobile: 450px, Desktop: 500px */}
      <div 
        className="w-full overflow-hidden relative mt-auto mb-0 h-[450px] md:mt-[40px] md:h-[600px]"
        style={{
          display: 'block',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
        }}
      >
        <video
          key={videoKey}
          ref={videoRef}
          className="w-full h-full object-cover md:object-contain"
          autoPlay
          muted
          playsInline={true}
          preload="auto"
          loop
          src={heroVideo}
          onLoadedMetadata={(e) => {
            if (e.target.readyState >= 2) {
              e.target.play().catch(err => {
                console.log('Video play error on loadedmetadata:', err);
              });
            }
          }}
          onCanPlay={() => {
            if (videoRef.current && videoRef.current.paused) {
              setTimeout(() => {
                videoRef.current?.play().catch(err => {
                  console.log('Video play error on canplay:', err);
                });
              }, 100);
            }
          }}
          onError={(e) => {
            const error = e.target.error;
            console.error('Video error:', error);
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Left fade edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'clamp(20px, 4vw, 120px)',
            height: '100%',
            background: 'linear-gradient(to right, #F7F7F7, transparent)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        {/* Right fade edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'clamp(20px, 4vw, 120px)',
            height: '100%',
            background: 'linear-gradient(to left, #F7F7F7, transparent)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </div>
    </section>
  );
};

export default HeroNew;
