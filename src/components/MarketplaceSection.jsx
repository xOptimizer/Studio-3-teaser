import { studioVideo } from '../utils';
import { useRef, useEffect } from 'react';

const MarketplaceSection = () => {
  const videoRef = useRef(null);

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

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      
      if (video.readyState >= 2) {
        video.play().catch(err => {
          console.log('Video play error:', err);
        });
      }

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <section
      id="marketplace"
      className="w-full bg-gradient-to-b from-[#f7f3eb] to-[#f2ede0] min-h-screen flex items-center py-12 md:py-16"
      style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapAlign: 'start' }}
    >
      <div className="w-full flex justify-center">
        <div 
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center"
          style={{ width: '95%' }}
        >
          {/* Left Column - Text Content and Image */}
          <div className="w-full flex flex-col lg:pr-8">
            {/* Text Content - Centered like Social Discover */}
            <div className="w-full text-center">
              {/* Title */}
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl text-black mb-6 md:mb-8 transition-all duration-300 hover:opacity-80 hover:-translate-y-1" 
                style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: '1.2' }}
              >
                The Marketplace
              </h2>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl text-black/70 leading-relaxed mb-6 md:mb-8 transition-all duration-300 hover:text-black/90" style={{ lineHeight: '1.6' }}>
                A curated creative supply marketplace offering the best prices with no hidden markups. Every product is organized by skill level so you can shop confidently and choose the right materials for your craft.
              </blockquote>

              {/* Attribution */}
              <div className="text-base md:text-lg text-black/60 transition-all duration-300 hover:text-black/80">
                <cite className="not-italic font-light tracking-wide">Coming Spring, 2026</cite>
              </div>
            </div>

            {/* Marketplace Desktop Image in Minimal Screen Frame */}
            <div className="w-full mt-6 group cursor-pointer">
              <div className="w-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-black/20">
                <img
                  src="/assets/images/marketplace-desktop.jpg"
                  alt="Marketplace Desktop"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Portrait Video */}
          <div className="w-full">
            <div className="w-full overflow-hidden group cursor-pointer bg-black/5 rounded-sm shadow-lg transition-all duration-500 hover:shadow-2xl" style={{ aspectRatio: '3/4', minHeight: '400px' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onLoadStart={() => {
                  console.log('Video load started');
                }}
                onLoadedMetadata={(e) => {
                  console.log('Video metadata loaded');
                  if (e.target.readyState >= 2) {
                    e.target.play().catch(err => {
                      console.log('Video play error on loadedmetadata (inline):', err);
                    });
                  }
                }}
                onCanPlay={() => {
                  console.log('Video can play');
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
                }}
              >
                <source src={studioVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;

