import { useEffect, useRef } from 'react';
import { studioVideo } from '../utils';

const VideoSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        if (video.currentTime >= 15) {
          video.pause();
          video.currentTime = 15;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      
      video.play().catch(err => {
        console.log('Video play error:', err);
      });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  return (
    <section
      className="w-full bg-[#f5f0e8] min-h-screen flex items-center justify-center"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Video Container */}
      <div 
        className="relative"
        style={{ 
          width: '95%',
          height: '95%',
          maxWidth: '95vw',
          maxHeight: '95vh',
          aspectRatio: '894.22 / 503'
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline={true}
          preload="auto"
          loop
        >
          <source src={studioVideo} type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default VideoSection;

