import { useState, useRef, useEffect } from 'react';

const QuoteSection = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For mobile carousel - tracks which image in the active tab
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const tabs = [
    { title: 'Artists', id: 'artists' },
    { title: 'Buyers & Collectors', id: 'buyers' },
    { title: 'Enthusiasts', id: 'enthusiasts' }
  ];

  // Images with descriptions for Artists section
  const images = {
    artists: [
      { id: 1, src: '/assets/images/artists-image-2.webp', description: 'Share Your Art' },
      { id: 2, src: '/assets/images/artists-image-1.webp', description: 'Find Your Audience' },
      { id: 3, src: '/assets/images/artists-image-4.webp', description: 'Focus on Creating' },
      { id: 4, src: '/assets/images/artists-image-3.webp', description: 'Grow Your Practice' }
    ],
    buyers: [
      { id: 4, src: '/assets/images/buyers-image-1.webp', description: 'Connect Directly with Artists' },
      { id: 5, src: '/assets/images/buyers-image-2.webp', description: 'Purchase with Confidence' }
    ],
    enthusiasts: [
      { id: 7, placeholder: 'Enthusiasts Image 1' },
      { id: 8, placeholder: 'Enthusiasts Image 2' },
      { id: 9, placeholder: 'Enthusiasts Image 3' },
      { id: 10, placeholder: 'Enthusiasts Image 4' },
      { id: 11, placeholder: 'Enthusiasts Image 5' },
      { id: 12, placeholder: 'Enthusiasts Image 6' },
      { id: 13, placeholder: 'Enthusiasts Image 7' },
      { id: 14, placeholder: 'Enthusiasts Image 8' }
    ]
  };

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    const currentImages = images[activeTab];

    if (distance > minSwipeDistance && currentImageIndex < currentImages.length - 1) {
      // Swipe left - next image
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (distance < -minSwipeDistance && currentImageIndex > 0) {
      // Swipe right - previous image
      setCurrentImageIndex(currentImageIndex - 1);
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      id="social-discover"
      className="w-full min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        background: '#F7F7F7',
        scrollSnapAlign: 'start',
        paddingTop: 'clamp(24px, 4vw, 48px)',
        paddingBottom: 'clamp(24px, 5vw, 44px)'
      }}
    >
      <div className="w-full flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col">
          {/* Title */}
          <h2 
            className="text-black" 
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(19pt, 4vw, 25pt)',
              lineHeight: '1.2',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}
          >
            The Social Discover
          </h2>

          {/* Description */}
          <p 
            className="text-gray" 
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(24pt, 6vw, 40pt)',
              lineHeight: '1.3',
              marginBottom: 'clamp(32px, 6vw, 48px)'
            }}
          >
            A creator focused social platform where your work isn't buried by algorithms.
          </p>
        </div>

        {/* Desktop: Left-aligned tabs with content below */}
        <div className="hidden lg:flex flex-col">
          {/* Tab Buttons - Left aligned */}
          <div className="flex justify-start gap-6 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="transition-all duration-200 cursor-pointer relative"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '24pt',
                  color: activeTab === tab.id ? '#000' : '#848597',
                  paddingBottom: '8px',
                  background: 'none',
                  outline: 'none',
                  border: 'none'
                }}
              >
                {tab.id === 'buyers' ? 'Collectors' : tab.title}
                {activeTab === tab.id && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      height: '2px',
                      backgroundColor: '#000'
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area - 2x2 Grid for Artists, 2-column for Buyers, single column for Enthusiasts */}
          {activeTab === 'artists' ? (
            <div className="grid grid-cols-2 gap-6">
              {images.artists.map((image) => (
                <div key={image.id} className="flex flex-col">
                  <div 
                    className="rounded-lg overflow-hidden w-full cursor-pointer"
                    style={{
                      aspectRatio: '1/1',
                      marginBottom: '12px',
                      borderRadius: '20px'
                    }}
                  >
                    <img 
                      src={image.src} 
                      alt={image.description}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  </div>
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '16pt',
                      color: '#000',
                      lineHeight: '1.4'
                    }}
                  >
                    {image.description}
                  </p>
                </div>
              ))}
            </div>
          ) : activeTab === 'buyers' ? (
            <div className="grid grid-cols-2 gap-6">
              {images.buyers.map((image) => (
                <div key={image.id} className="flex flex-col">
                  <div 
                    className="rounded-lg overflow-hidden w-full cursor-pointer"
                    style={{
                      aspectRatio: '1/1',
                      marginBottom: '12px',
                      borderRadius: '20px'
                    }}
                  >
                    <img 
                      src={image.src} 
                      alt={image.description}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  </div>
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '16pt',
                      color: '#000',
                      lineHeight: '1.4'
                    }}
                  >
                    {image.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Dynamic Grid Layout for Enthusiasts - Reorganized with no gaps between pairs */}
              <div 
                className="grid mb-6"
                style={{
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'auto auto',
                  gap: '12px'
                }}
              >
                {/* Column 1: Image 1 and Image 2 stacked with gap */}
                <div className="flex flex-col" style={{ gridColumn: '1', gridRow: '1 / 3', gap: '12px' }}>
                  {/* Image 1: 294x168 - Top */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '294/168',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[0]?.placeholder}</span>
                    </div>
                  </div>
                  
                  {/* Image 2: 294x428 - Directly below Image 1, no gap */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '294/428',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[1]?.placeholder}</span>
                    </div>
                  </div>
                </div>
                
                {/* Column 2: Image 3 - Top */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '2',
                    gridRow: '1',
                    width: '100%',
                    aspectRatio: '294/428',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <span>{images.enthusiasts[2]?.placeholder}</span>
                  </div>
                </div>
                
                {/* Image 4: 602x168 - Below Image 3, spans columns 2-3, with gap */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '2 / 4',
                    gridRow: '2',
                    width: '100%',
                    aspectRatio: '602/168',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <span>{images.enthusiasts[3]?.placeholder}</span>
                  </div>
                </div>
                
                {/* Column 3: Image 5 and Image 6 stacked with gap */}
                <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                  {/* Image 5: 294x98 - Top */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '294/98',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[4]?.placeholder}</span>
                    </div>
                  </div>
                  
                  {/* Image 6: 294x312 - Directly below Image 5, no gap */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '294/312',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[5]?.placeholder}</span>
                    </div>
                  </div>
                </div>
                
                {/* Column 4: Image 7 and Image 8 stacked with gap */}
                <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                  {/* Image 7: 335x344 */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '335/344',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[6]?.placeholder}</span>
                    </div>
                  </div>
                  
                  {/* Image 8: 335x350 - Increased height to match bottom row */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: '100%',
                      aspectRatio: '335/330',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[7]?.placeholder}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Text */}
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '16pt',
                  color: '#000',
                  lineHeight: '1.4'
                }}
              >
                Experience Art Uninterrupted
              </p>
            </div>
          )}
        </div>

        {/* Mobile Layout - Tabs above, placeholder below, dots at bottom */}
        <div className="lg:hidden flex flex-col">
          {/* Tab Buttons for Mobile - Above placeholder */}
          <div className="flex justify-start gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-black transition-all duration-200 relative"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(14pt, 3vw, 18pt)',
                  color: activeTab === tab.id ? '#000' : '#848597',
                  paddingBottom: '8px',
                  cursor: 'pointer',
                  background: 'none',
                  outline: 'none',
                  border: 'none'
                }}
              >
                {tab.id === 'buyers' ? 'Collectors' : tab.title}
                {activeTab === tab.id && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      height: '2px',
                      backgroundColor: '#000'
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Placeholder - Below tabs */}
          {activeTab === 'enthusiasts' ? (
            <div className="mb-6">
              {/* Mobile Enthusiasts Collage - Portrait Layout with 4 images */}
              <div 
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(3, auto)',
                  gap: '8px'
                }}
              >
                {/* Image 1: Top left - square */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '1',
                    gridRow: '1',
                    width: '100%',
                    aspectRatio: '1/1',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[0]?.src ? (
                    <img 
                      src={images.enthusiasts[0].src} 
                      alt={images.enthusiasts[0].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[0]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Image 2: Top right - tall */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '2',
                    gridRow: '1 / 3',
                    width: '100%',
                    aspectRatio: '1/2',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[1]?.src ? (
                    <img 
                      src={images.enthusiasts[1].src} 
                      alt={images.enthusiasts[1].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[1]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Image 3: Second row left - tall */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '1',
                    gridRow: '2 / 4',
                    width: '100%',
                    aspectRatio: '1/2',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[2]?.src ? (
                    <img 
                      src={images.enthusiasts[2].src} 
                      alt={images.enthusiasts[2].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[2]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Image 4: Third row right - square */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    gridColumn: '2',
                    gridRow: '3',
                    width: '100%',
                    aspectRatio: '1/1',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[3]?.src ? (
                    <img 
                      src={images.enthusiasts[3].src} 
                      alt={images.enthusiasts[3].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[3]?.placeholder}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Text */}
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '16pt',
                  color: '#000',
                  lineHeight: '1.4',
                  marginTop: '12px',
                  textAlign: 'center'
                }}
              >
                Experience Art Uninterrupted
              </p>
            </div>
          ) : (
            <div 
              ref={carouselRef}
              className="relative overflow-hidden mb-6"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`
                }}
              >
                {images[activeTab].map((image) => (
                  <div key={image.id} className="flex-shrink-0 w-full flex flex-col">
                    {image.src ? (
                      <>
                        <div 
                          className="rounded-lg overflow-hidden w-full mx-auto cursor-pointer"
                          style={{
                            aspectRatio: activeTab === 'artists' || activeTab === 'buyers' ? '1/1' : '400/580',
                            maxWidth: activeTab === 'artists' || activeTab === 'buyers' ? '100%' : '400px',
                            borderRadius: '20px',
                            marginBottom: image.description ? '12px' : '0'
                          }}
                        >
                          <img 
                            src={image.src} 
                            alt={image.description || image.placeholder}
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                            style={{ borderRadius: '20px' }}
                          />
                        </div>
                        {image.description && (
                          <p 
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                              fontSize: '16pt',
                              color: '#000',
                              lineHeight: '1.4',
                              textAlign: 'center',
                              paddingLeft: '16px',
                              paddingRight: '16px'
                            }}
                          >
                            {image.description}
                          </p>
                        )}
                      </>
                    ) : (
                      <div 
                        className="rounded-lg overflow-hidden w-full mx-auto"
                        style={{
                          aspectRatio: '400/580',
                          maxWidth: '400px',
                          backgroundColor: '#D1D5DB',
                          background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                          borderRadius: '20px'
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>{image.placeholder}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination Dots - At the bottom (hidden for enthusiasts) */}
          {activeTab !== 'enthusiasts' && (
            <div className="flex justify-center gap-2">
              {images[activeTab].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-gray-400' 
                      : 'bg-gray-300'
                  }`}
                  style={{
                    width: '8px',
                    height: '8px'
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

