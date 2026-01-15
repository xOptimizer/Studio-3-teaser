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
              paddingTop: '40px',
              paddingBottom: '40px',
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
                paddingTop: '20px'
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
              <div 
                  style={{
                  width: '364px',
                  height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left */}
                  <div 
                style={{
                      width: '459px',
                      height: '263px',
                  borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right */}
                  <div 
                  style={{
                      width: '679px',
                      height: '263px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 */}
                <div 
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                  />
                </div>
                
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9 (right column) */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall */}
                <div 
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide */}
                    <div 
                style={{
                        width: '1067px',
                        height: '263px',
                  borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right */}
                    <div 
                  style={{
                        width: '364px',
                        height: '263px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                  />
                </div>
                
                  {/* Bottom row: Images 8, 9 & 11 side by side */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left */}
                <div 
                  style={{
                        width: '364px',
                        height: '288px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 9 - Middle */}
                    <div 
                  style={{
                        width: '691px',
                        height: '288px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right */}
                    <div 
                style={{
                        width: '364px',
                        height: '288px',
                  borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
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
              <div 
                  style={{
                  width: '364px',
                  height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  flexShrink: 0
                }}
              />
              
              {/* Middle section: Images 2, 3, and 5 - Duplicate */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Top row: Images 2 & 3 side by side - Duplicate */}
                <div className="flex" style={{ gap: '12px' }}>
                  {/* Image 2 - Left - Duplicate */}
                  <div 
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                  
                  {/* Image 3 - Right - Duplicate */}
                  <div 
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                </div>
                
                {/* Bottom: Image 5 directly below Images 2 & 3 - Duplicate */}
                <div 
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
              </div>
              
              {/* Right section: Image 6 (left, tall) + Images 7, 8, 9, 10, 11 (right column) - Duplicate */}
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                {/* Image 6 - Left, tall - Duplicate */}
                <div 
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
                
                {/* Right column: Image 7 + Image 10 (top row) + Images 8, 9, 11 (bottom row) - Duplicate */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {/* Top row: Image 7 + Image 10 side by side - Duplicate */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 7 - Left, wide - Duplicate */}
                    <div 
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 10 - Right - Duplicate */}
                    <div 
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  
                  {/* Bottom row: Images 8, 9 & 11 side by side - Duplicate */}
                  <div className="flex" style={{ gap: '12px' }}>
                    {/* Image 8 - Left - Duplicate */}
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 9 - Middle - Duplicate */}
                    <div 
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Image 11 - Right - Duplicate */}
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
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
              <div 
                  style={{
                  width: '364px',
                  height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  <div 
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                  <div 
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                </div>
                <div 
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                <div 
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    <div 
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
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
              <div 
                  style={{
                  width: '364px',
                  height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  flexShrink: 0
                }}
              />
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex" style={{ gap: '12px' }}>
                  <div 
                    style={{
                      width: '459px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                  <div 
                    style={{
                      width: '679px',
                      height: '263px',
                      borderRadius: '20px',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      flexShrink: 0
                    }}
                  />
                </div>
                <div 
                  style={{
                    width: '1150px',
                    height: '288px',
                    borderRadius: '20px',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
              </div>
              <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                <div 
                  style={{
                    width: '364px',
                    height: '563px',
                    borderRadius: '20px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    flexShrink: 0
                  }}
                />
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex" style={{ gap: '12px' }}>
                    <div 
                      style={{
                        width: '1067px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '364px',
                        height: '263px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                  </div>
                  <div className="flex" style={{ gap: '12px' }}>
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '691px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                        flexShrink: 0
                      }}
                    />
                    <div 
                      style={{
                        width: '364px',
                        height: '288px',
                        borderRadius: '20px',
                        backgroundColor: '#D1D5DB',
                        background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
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
                  gap: '8px',
              paddingTop: '20px',
              paddingBottom: '20px'
                }}
              >
            {/* Mobile layout placeholder - same structure as desktop but responsive */}
                <div 
              className="flex flex-col"
                  style={{
                    gap: '8px',
                width: '100%'
              }}
            >
              {/* Mobile Row 1: Image 1, Image 2, Image 3 */}
              <div className="flex" style={{ gap: '8px', width: '100%' }}>
                <div style={{ width: '30%', height: '200px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                <div style={{ width: '35%', height: '200px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                <div style={{ width: '35%', height: '200px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                  </div>
                  
              {/* Mobile Row 2: Image 5 */}
              <div style={{ width: '100%', height: '150px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
              
              {/* Mobile Row 3: Image 6, Image 7 */}
              <div className="flex" style={{ gap: '8px', width: '100%' }}>
                <div style={{ width: '30%', height: '200px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                <div style={{ width: '70%', height: '200px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                </div>
                
              {/* Mobile Row 4: Image 8, Image 9 */}
              <div className="flex" style={{ gap: '8px', width: '100%' }}>
                <div style={{ width: '30%', height: '150px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                <div style={{ width: '70%', height: '150px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                  </div>
                  
              {/* Mobile Row 5: Image 10, Image 11 */}
              <div className="flex" style={{ gap: '8px', width: '100%' }}>
                <div style={{ width: '50%', height: '150px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
                <div style={{ width: '50%', height: '150px', borderRadius: '20px', backgroundColor: '#D1D5DB' }} />
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
