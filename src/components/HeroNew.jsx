import { useEffect, useRef, useState } from 'react';
import { heroVideo } from '../utils';
import { getCloudinaryImageUrl } from '../utils/cloudinary';

const HeroNew = () => {
  const videoRef = useRef(null);
  const retryCountRef = useRef(0);
  const [videoKey, setVideoKey] = useState(0);
  const marqueeRef = useRef(null);
  const mobileMarqueeRef = useRef(null);
  const animationRef = useRef(null);
  const mobileAnimationRef = useRef(null);
  const positionRef = useRef(0);
  const mobilePositionRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // JavaScript-based circular marquee animation for desktop
  useEffect(() => {
    if (isMobile) return; // Only run on desktop
    
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const animate = () => {
      positionRef.current -= 1; // Speed of movement (pixels per frame)
      
      // Get the width of one grid set
      const gridWidth = marquee.children[0]?.offsetWidth || 0;
      
      // When we've moved one full grid width, reset to 0 seamlessly
      if (Math.abs(positionRef.current) >= gridWidth) {
        positionRef.current = 0;
      }
      
      marquee.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  // JavaScript-based circular marquee animation for mobile
  useEffect(() => {
    if (!isMobile) return; // Only run on mobile
    
    const mobileMarquee = mobileMarqueeRef.current;
    if (!mobileMarquee) return;

    const animate = () => {
      mobilePositionRef.current -= 1; // Speed of movement (pixels per frame)
      
      // Get the width of one mobile set
      const mobileSetWidth = mobileMarquee.children[0]?.offsetWidth || 0;
      
      // When we've moved the width of the first 6 sets, reset to 0 seamlessly
      // This creates infinite loop using the duplicate sets (7-9) as buffer
      if (Math.abs(mobilePositionRef.current) >= mobileSetWidth * 6) {
        mobilePositionRef.current = 0;
      }
      
      mobileMarquee.style.transform = `translateX(${mobilePositionRef.current}px)`;
      mobileAnimationRef.current = requestAnimationFrame(animate);
    };

    // Start animation after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mobileAnimationRef.current) {
        cancelAnimationFrame(mobileAnimationRef.current);
      }
    };
  }, [isMobile]);

  return (
    <section
      id="about"
      className="w-full min-h-screen flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 relative md:justify-center"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: '#F7F7F7',
        scrollSnapAlign: 'start',
        paddingTop: 'clamp(60px, 8vw, 80px)',
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

      {/* Image Collage Container - Mobile: 450px, Desktop: 600px */}
      <div 
        className="overflow-hidden relative mt-auto mb-0 h-[450px] md:mt-[40px] md:h-[600px]"
        style={{
          display: 'block',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
        }}
      >
        {/* Desktop Layout - Original Grid */}
        {!isMobile && (
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              padding: '0 clamp(20px, 4vw, 120px)'
            }}
          >
            <div 
              ref={marqueeRef}
              className="flex h-full"
              style={{
                gap: '12px'
              }}
            >
            {/* First Grid Set */}
            <div 
              className="flex-shrink-0 h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'auto auto',
                gap: '12px',
                width: 'calc(100vw - clamp(40px, 8vw, 240px))'
              }}
            >
              {/* Column 1: Image 1 and Image 2 stacked */}
              <div className="flex flex-col" style={{ gridColumn: '1', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 1: Top */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/168',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 2: Bottom */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/428',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 2: Image 3 - Top */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2',
                  gridRow: '1',
                  width: '100%',
                  aspectRatio: '294/428',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 3"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Image 4: Bottom - Spans columns 2-3 */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '2',
                  width: '100%',
                  aspectRatio: '602/168',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 4"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Column 3: Image 5 and Image 6 stacked */}
              <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 5: Top */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/98',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 6: Bottom */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/318',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 6"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 4: Image 7 and Image 8 stacked */}
              <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 7 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/344',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 7"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 8 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/330',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 8"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Second Duplicate Grid Set for Infinite Loop */}
            <div 
              className="flex-shrink-0 h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'auto auto',
                gap: '12px',
                width: 'calc(100vw - clamp(40px, 8vw, 240px))'
              }}
            >
              {/* Column 1: Image 1 and Image 2 stacked - Second Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '1', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 1: Top - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/168',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 2: Bottom - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/428',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 2: Image 3 - Second Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2',
                  gridRow: '1',
                  width: '100%',
                  aspectRatio: '294/428',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 3"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Image 4: Bottom - Spans columns 2-3 - Second Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '2',
                  width: '100%',
                  aspectRatio: '602/168',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 4"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Column 3: Image 5 and Image 6 stacked - Second Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 5: Top - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/98',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 6: Bottom - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/318',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 6"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 4: Image 7 and Image 8 stacked - Second Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 7 - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/344',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 7"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 8 - Second Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/330',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 8"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Third Duplicate Grid Set for Infinite Loop */}
            <div 
              className="flex-shrink-0 h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'auto auto',
                gap: '12px',
                width: 'calc(100vw - clamp(40px, 8vw, 240px))'
              }}
            >
              {/* Column 1: Image 1 and Image 2 stacked - Third Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '1', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 1: Top - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/168',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 2: Bottom - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/428',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 2: Image 3 - Third Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2',
                  gridRow: '1',
                  width: '100%',
                  aspectRatio: '294/428',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 3"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Image 4: Bottom - Spans columns 2-3 - Third Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '2',
                  width: '100%',
                  aspectRatio: '602/168',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 4"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Column 3: Image 5 and Image 6 stacked - Third Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 5: Top - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/98',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 6: Bottom - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/318',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 6"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 4: Image 7 and Image 8 stacked - Third Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 7 - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/344',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 7"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 8 - Third Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/330',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 8"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Fourth Duplicate Grid Set for Infinite Loop */}
            <div 
              className="flex-shrink-0 h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'auto auto',
                gap: '12px',
                width: 'calc(100vw - clamp(40px, 8vw, 240px))'
              }}
            >
              {/* Column 1: Image 1 and Image 2 stacked - Fourth Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '1', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 1: Top - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/168',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 2: Bottom - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/428',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 2: Image 3 - Fourth Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2',
                  gridRow: '1',
                  width: '100%',
                  aspectRatio: '294/428',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 3"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Image 4: Bottom - Spans columns 2-3 - Fourth Duplicate */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '2',
                  width: '100%',
                  aspectRatio: '602/168',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img 
                  src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                  alt="Hero Image 4"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                  style={{ borderRadius: '20px', willChange: 'transform' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Column 3: Image 5 and Image 6 stacked - Fourth Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 5: Top - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/98',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 6: Bottom - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '294/318',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 6"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Column 4: Image 7 and Image 8 stacked - Fourth Duplicate */}
              <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                {/* Image 7 - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/344',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 7"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Image 8 - Fourth Duplicate */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '335/330',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Image 8"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
        
        {/* Mobile Layout - Following Enthusiasts Structure */}
        {isMobile && (
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              padding: '0 clamp(20px, 4vw, 60px)'
            }}
          >
            <div 
              ref={mobileMarqueeRef}
              className="flex h-full"
              style={{
                gap: '8px'
              }}
            >
              {/* First Mobile Set - Images 5, 3, 6 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 5 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 3 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 3"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 6 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 6"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Second Mobile Set - Images 1, 7, 8 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 1 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 7 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 7"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 8 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 8"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Third Mobile Set - Images 2, 4, 5 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 2 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 4 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 4"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 5 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 5"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Fourth Mobile Set - Images 3, 1, 2 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 3 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 3"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 1 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 1"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 2 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 2"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Fifth Mobile Set - Images 6, 7, 8 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 6 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 6"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 7 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 7"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 8 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 8"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Sixth Mobile Set - Images 4, 3, 1 */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 4 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 4"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 3 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 3"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 1 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 1"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Seventh Mobile Set - Duplicate of First for Infinite Loop */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 5 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 5"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 3 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 3"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 6 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 6"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Eighth Mobile Set - Duplicate of Second for Infinite Loop */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 1 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 1"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 7 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 7"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 8 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 8"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Ninth Mobile Set - Duplicate of Third for Infinite Loop */}
              <div 
                className="flex-shrink-0 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: 'calc(100vw - clamp(40px, 8vw, 120px))'
                }}
              >
                {/* Top Wide Image - Image 2 */}
                <div 
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                    alt="Hero Mobile Image 2"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    style={{ borderRadius: '20px' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                {/* Bottom Row: Two Square Images */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    flex: 1
                  }}
                >
                  {/* Left Square - Image 4 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 4"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Right Square - Image 5 */}
                  <div 
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '100%',
                      aspectRatio: '172/228',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <img 
                      src={getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' })}
                      alt="Hero Mobile Image 5"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left fade edge - Marquee top mask effect */}
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
        {/* Right fade edge - Marquee top mask effect */}
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
