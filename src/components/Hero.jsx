import { heroVideo, smallHeroVideo } from '../utils';
import { useEffect, useState, useRef } from 'react';

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)
  const videoRef = useRef(null);

  const handleVideoSrcSet = () => {
    if(window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('resize', handleVideoSrcSet)
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        if (video.currentTime >= 15) {
          video.pause();
          video.currentTime = 15; // Keep it at 15 seconds
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      
      // Start playing
      video.play().catch(err => {
        console.log('Video play error:', err);
      });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoSrc]);

  return (
    <section className="w-full bg-black relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full h-screen flex items-center justify-center">
        <video 
          ref={videoRef}
          className="pointer-events-none w-full h-full object-contain sm:object-cover" 
          autoPlay 
          muted 
          playsInline={true} 
          key={videoSrc}
        >
            <source src={videoSrc} type="video/mp4" />
          </video>
      </div>
    </section>
  )
}

export default Hero