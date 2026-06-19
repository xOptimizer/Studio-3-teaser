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
        if (video.readyState >= 2) {
          video.play().catch(() => {});
        }
      };

      const handleCanPlay = () => {
        if (video.paused) {
          setTimeout(() => {
            video.play().catch(() => {});
          }, 100);
        }
      };

      const handleError = (e) => {
        const error = e.target.error;

        if ((error?.code === 4 || error?.code === 2) && retryCountRef.current === 0) {
          const directPath = '/assets/videos/hightlight-sec.mp4';
          retryCountRef.current = 1;
          setVideoSrc(directPath);
          setVideoKey(prev => prev + 1);

          setTimeout(() => {
            videoRef.current?.load();
          }, 100);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      if (video.readyState >= 2) {
        video.play().catch(() => {});
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
      className="w-full flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        scrollSnapAlign: 'start',
        background: '#F7F7F7',
        paddingTop: 'clamp(40px, 8vw, 72px)',
        paddingBottom: 'clamp(40px, 10vw, 112px)'
      }}
    >
      <div className="w-full flex flex-col">
        {/* Header */}
        <h2
          className="text-black"
          style={{
            fontWeight: 700,
            fontSize: 'clamp(19pt, 4vw, 25pt)',
            marginBottom: 'clamp(16px, 3vw, 24px)'
          }}
        >
          The Studio
        </h2>

        <p
          className="text-gray"
          style={{
            fontWeight: 700,
            fontSize: 'clamp(24pt, 6vw, 40pt)',
            lineHeight: '1.3',
            marginBottom: 'clamp(32px, 6vw, 48px)'
          }}
        >
          A creative home, not just a workspace.
        </p>

        {/* Desktop Video */}
        <div className="hidden md:block mb-8">
          <div
            className="rounded-lg overflow-hidden w-full mx-auto"
            style={{ height: '720px', maxWidth: '1500px' }}
          >
            <video
              key={videoKey}
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              loop
            >
              <source src={`${videoSrc}?v=${videoKey}`} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Desktop Text */}
        <div className="hidden md:flex">
          <p style={{ fontSize: '18pt', lineHeight: '1.6', color: '#848597' }}>
            Our flagship <strong className="text-black">Dallas</strong> studio blends
            creation, community, and wellness —{' '}
            <strong className="text-black font-bold">
              a true third space for creatives.
            </strong>
          </p>
        </div>

        {/* Mobile Video */}
        <div className="md:hidden mb-6">
          <div
            className="rounded-lg overflow-hidden w-full"
            style={{ height: 'clamp(400px, 50vh, 500px)' }}
          >
            <video
              key={videoKey}
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              loop
            >
              <source src={`${videoSrc}?v=${videoKey}`} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* ✅ Mobile Text (ONLY CHANGE HERE) */}
        <div className="md:hidden flex items-start w-full mb-16">
          <p
            className="flex-1"
            style={{
              fontWeight: 400,
              fontSize: 'clamp(14pt, 4vw, 18pt)',
              lineHeight: '1.6',
              color: '#848597'
            }}
          >
            Our flagship <strong style={{ color: '#000' }}>Dallas</strong> studio blends
            creation, community, and wellness —{' '}
            <strong style={{ color: '#000', fontWeight: 700 }}>
              a true third space for creatives.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
