import { useEffect, useRef, useState } from 'react';
import { heroVideo } from '../utils';
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from '../utils/cloudinary';

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
      }

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
      
      // Get the width of one image set (first child)
      const firstSet = marquee.children[0];
      const gridWidth = firstSet?.offsetWidth || 0;
      
      // When we've moved one full set width, reset to 0 seamlessly
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
      
      // Get the width of one image set (first child - the flex-shrink-0 container)
      const firstSet = mobileMarquee.children[0];
      if (!firstSet) return;
      
      // Get the actual width of the set (accounts for scale transform on inner div)
      const gridWidth = firstSet.offsetWidth || 0;
      
      // Reset when we've moved exactly one set width
      // This creates seamless loop since duplicate sets are identical
      if (Math.abs(mobilePositionRef.current) >= gridWidth) {
        mobilePositionRef.current = 0;
      }
      
      mobileMarquee.style.transform = `translateX(${mobilePositionRef.current}px)`;
      mobileAnimationRef.current = requestAnimationFrame(animate);
    };

    // Start animation after delay to ensure DOM is ready and measurements are accurate
    const timeoutId = setTimeout(() => {
      // Ensure we start at 0
      mobilePositionRef.current = 0;
      animate();
    }, 200);

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
        paddingBottom: isMobile ? '0' : 'clamp(0px, 0vw, 48px)'
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

      {/* Image Collage Container */}
      <div 
        className="overflow-hidden relative mt-auto mb-0"
        style={{
          display: 'flex',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: '0',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 400px)'
        }}
      >
        {/* Desktop Layout - New Grid */}
        {!isMobile && (
          <div 
            className="w-full flex flex-col items-center justify-center"
            style={{
                gap: '12px',
              paddingTop: '0',
              paddingBottom: '0',
                    width: '100vw',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                width: '100%',
                overflow: 'hidden',
                paddingTop: '0',
                paddingBottom: '0'
              }}
            >
            <div 
              ref={marqueeRef}
              className="flex"
              style={{
                gap: '12px',
                width: 'max-content',
                willChange: 'transform'
              }}
            >
            {/* First Image Set */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            {/* Row 1: Image 1 (left, tall) + Images 2, 3, 5 (middle) + Image 6 (left) + Images 7, 8, 9, 10, 11 (right) */}
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Image 1 - Left, tall */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - VIDEO */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                </div>
                
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9 (right column) */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                
                  {/* Bottom row: Images 8, 9 & 11 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - VIDEO */}
                <video
                  src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '364px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                    
                    {/* Image 9 - Middle */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                </div>
              </div>
            </div>
            </div>

            {/* Duplicate Image Set for Infinite Loop */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            {/* Row 1: Image 1 (left, tall) + Images 2, 3, 5 (middle) + Image 6 (left) + Images 7, 8, 9, 10, 11 (right) - Duplicate */}
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Image 1 - Left, tall - Duplicate */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 - Duplicate */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side - Duplicate */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Duplicate - VIDEO */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right - Duplicate */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 - Duplicate */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9, 10, 11 (right column) - Duplicate */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Duplicate */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) - Duplicate */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side - Duplicate */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Duplicate */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right - Duplicate */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                
                  {/* Bottom row: Images 8, 9 & 11 side by side - Duplicate */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Duplicate - VIDEO */}
                <video
                  src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '364px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                    
                    {/* Image 9 - Middle - Duplicate */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right - Duplicate */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                </div>
              </div>
            </div>
            </div>

            {/* Third Image Set for Infinite Loop */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Image 1 - Left, tall - Third Set */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Third Set - VIDEO */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Third Set */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Third Set */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Third Set */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Third Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Third Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Third Set - VIDEO */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Third Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Third Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Fourth Image Set for Infinite Loop */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Image 1 - Left, tall - Fourth Set */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Fourth Set - VIDEO */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Fourth Set */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Fourth Set */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Fourth Set */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Fourth Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Fourth Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Fourth Set - VIDEO */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Fourth Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Fourth Set */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
          </div>
        )}
        
        {/* Mobile Layout */}
        {isMobile && (
          <div 
            className="w-full flex flex-col items-center"
            style={{
                gap: '12px',
              paddingTop: '0',
              paddingBottom: '0',
                    width: '100vw',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              overflow: 'hidden',
              marginTop: 'auto',
              marginBottom: 0
            }}
          >
            <div 
              style={{
                width: '100%',
                overflow: 'hidden',
                paddingTop: '0',
                paddingBottom: '0'
              }}
            >
            <div 
              ref={mobileMarqueeRef}
              className="flex"
              style={{
                gap: '12px',
                width: 'max-content',
                willChange: 'transform'
              }}
            >
            {/* First Image Set - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - VIDEO */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                </div>
                
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9 (right column) */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                
                  {/* Bottom row: Images 8, 9 & 11 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - VIDEO */}
                <video
                  src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '364px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                    
                    {/* Image 9 - Middle */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                </div>
              </div>
            </div>
            </div>

            {/* Duplicate Image Set for Infinite Loop - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall - Duplicate - Mobile */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 - Duplicate - Mobile */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side - Duplicate - Mobile */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Duplicate - VIDEO - Mobile */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right - Duplicate - Mobile */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 - Duplicate - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9, 10, 11 (right column) - Duplicate - Mobile */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Duplicate - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) - Duplicate - Mobile */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side - Duplicate - Mobile */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Duplicate - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right - Duplicate - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  
                  {/* Bottom row: Images 8, 9 & 11 side by side - Duplicate - Mobile */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Duplicate - VIDEO - Mobile */}
                <video
                  src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '364px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                    
                    {/* Image 9 - Middle - Duplicate - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right - Duplicate - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                </div>
                </div>
              </div>
            </div>
            </div>

            {/* Third Image Set for Infinite Loop - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall - Third Set - Mobile */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Third Set - VIDEO - Mobile */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Third Set - Mobile */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Third Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Third Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Third Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Third Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Third Set - VIDEO - Mobile */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Third Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Third Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Fourth Image Set for Infinite Loop - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall - Fourth Set - Mobile */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Fourth Set - VIDEO - Mobile */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Fourth Set - Mobile */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Fourth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Fourth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Fourth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Fourth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Fourth Set - VIDEO - Mobile */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Fourth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Fourth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Fifth Image Set for Infinite Loop - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall - Fifth Set - Mobile */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Fifth Set - VIDEO - Mobile */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Fifth Set - Mobile */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Fifth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Fifth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Fifth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Fifth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Fifth Set - VIDEO - Mobile */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Fifth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Fifth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Sixth Image Set for Infinite Loop - Mobile */}
            <div 
              className="flex-shrink-0"
              style={{
                gap: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
            <div 
              className="flex"
                style={{
                gap: '12px',
                    width: 'max-content',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: 'scale(1.0)',
                transformOrigin: 'left top'
              }}
            >
              {/* Image 1 - Left, tall - Sixth Set - Mobile */}
              <img
                src={getCloudinaryImageUrl('marquee-image-1.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                alt="Marquee Image 1"
                style={{
                  width: '364px',
                  height: '563px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Sixth Set - VIDEO - Mobile */}
                  <video
                    src={getCloudinaryVideoUrl('marquee-video-2.mp4', { width: 459, height: 263, crop: 'fill', quality: 'auto' })}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                  {/* Image 3 - Right - Sixth Set - Mobile */}
                  <img
                    src={getCloudinaryImageUrl('marquee-image-3.webp', { width: 679, height: 263, crop: 'fill', quality: 'auto' })}
                    alt="Marquee Image 3"
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                </div>
                {/* Image 5 - Sixth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-5.webp', { width: 1150, height: 288, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 5"
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Sixth Set - Mobile */}
                <img
                  src={getCloudinaryImageUrl('marquee-image-6.webp', { width: 364, height: 563, crop: 'fill', quality: 'auto' })}
                  alt="Marquee Image 6"
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Sixth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-7.webp', { width: 1067, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 7"
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 10 - Right - Sixth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-10.webp', { width: 364, height: 263, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 10"
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Sixth Set - VIDEO - Mobile */}
                    <video
                      src={getCloudinaryVideoUrl('marquee-video-8.mp4', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 9 - Middle - Sixth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-9.webp', { width: 691, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 9"
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {/* Image 11 - Right - Sixth Set - Mobile */}
                    <img
                      src={getCloudinaryImageUrl('marquee-image-11.webp', { width: 364, height: 288, crop: 'fill', quality: 'auto' })}
                      alt="Marquee Image 11"
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>
              </div>
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
 