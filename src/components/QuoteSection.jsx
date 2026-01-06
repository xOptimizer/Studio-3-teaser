import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const QuoteSection = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For mobile carousel - tracks which image in the active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
      { id: 7, src: '/assets/images/AdobeStock_118182508.webp', placeholder: 'Enthusiasts Image 1' },
      { id: 8, src: '/assets/images/AdobeStock_135490522.webp', placeholder: 'Enthusiasts Image 2' },
      { id: 9, src: '/assets/images/AdobeStock_213841942.webp', placeholder: 'Enthusiasts Image 3' },
      { id: 10, src: '/assets/images/AdobeStock_231517092.webp', placeholder: 'Enthusiasts Image 4' },
      { id: 11, src: '/assets/images/AdobeStock_421538237.webp', placeholder: 'Enthusiasts Image 5' },
      { id: 12, src: '/assets/images/AdobeStock_460628886.webp', placeholder: 'Enthusiasts Image 6' },
      { id: 13, src: '/assets/images/AdobeStock_469893497.webp', placeholder: 'Enthusiasts Image 7' },
      { id: 14, src: '/assets/images/AdobeStock_785220762.webp', placeholder: 'Enthusiasts Image 8' }
    ]
  };

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleImageClick = (imageId) => {
    // Open modal for artist or buyers/collectors images
    if (activeTab === 'artists') {
      const clickedImage = images.artists.find(img => img.id === imageId);
      if (clickedImage) {
        setSelectedImage(clickedImage);
        setIsModalOpen(true);
      }
    } else if (activeTab === 'buyers') {
      const clickedImage = images.buyers.find(img => img.id === imageId);
      if (clickedImage) {
        setSelectedImage(clickedImage);
        setIsModalOpen(true);
      }
    } else if (activeTab === 'enthusiasts') {
      // For enthusiasts, use the first image for the modal (all show same content)
      const clickedImage = images.enthusiasts[0];
      if (clickedImage) {
        setSelectedImage(clickedImage);
        setIsModalOpen(true);
      }
    }
  };

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
                    onClick={() => handleImageClick(image.id)}
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
                    onClick={() => handleImageClick(image.id)}
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
                    onClick={() => handleImageClick(images.enthusiasts[0]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '294/168',
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[0]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 2: 294x428 - Directly below Image 1, no gap */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[1]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '294/428',
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[1]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Column 2: Image 3 - Top */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(images.enthusiasts[2]?.id)}
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
                  {images.enthusiasts[2]?.src ? (
                    <img 
                      src={images.enthusiasts[2].src} 
                      alt={images.enthusiasts[2].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[2]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Image 4: 602x168 - Below Image 3, spans columns 2-3, with gap */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(images.enthusiasts[3]?.id)}
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
                  {images.enthusiasts[3]?.src ? (
                    <img 
                      src={images.enthusiasts[3].src} 
                      alt={images.enthusiasts[3].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      <span>{images.enthusiasts[3]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Column 3: Image 5 and Image 6 stacked with gap */}
                <div className="flex flex-col" style={{ gridColumn: '3', gridRow: '1 / 3', gap: '12px' }}>
                  {/* Image 5: 294x98 - Top */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[4]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '294/98',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    {images.enthusiasts[4]?.src ? (
                      <img 
                        src={images.enthusiasts[4].src} 
                        alt={images.enthusiasts[4].placeholder}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                        style={{ borderRadius: '20px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[4]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 6: 294x312 - Directly below Image 5, no gap */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[5]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '294/312',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    {images.enthusiasts[5]?.src ? (
                      <img 
                        src={images.enthusiasts[5].src} 
                        alt={images.enthusiasts[5].placeholder}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                        style={{ borderRadius: '20px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[5]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Column 4: Image 7 and Image 8 stacked with gap */}
                <div className="flex flex-col" style={{ gridColumn: '4', gridRow: '1 / 3', gap: '12px' }}>
                  {/* Image 7: 335x344 */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[6]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '335/344',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    {images.enthusiasts[6]?.src ? (
                      <img 
                        src={images.enthusiasts[6].src} 
                        alt={images.enthusiasts[6].placeholder}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                        style={{ borderRadius: '20px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        <span>{images.enthusiasts[6]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 8: 335x350 - Increased height to match bottom row */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[7]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '335/330',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                    }}
                  >
                    {images.enthusiasts[7]?.src ? (
                      <img 
                        src={images.enthusiasts[7].src} 
                        alt={images.enthusiasts[7].placeholder}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                        style={{ borderRadius: '20px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[7]?.placeholder}</span>
                      </div>
                    )}
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
                  onClick={() => handleImageClick(images.enthusiasts[0]?.id)}
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
                  onClick={() => handleImageClick(images.enthusiasts[1]?.id)}
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
                  onClick={() => handleImageClick(images.enthusiasts[2]?.id)}
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
                  onClick={() => handleImageClick(images.enthusiasts[3]?.id)}
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
                          onClick={() => handleImageClick(image.id)}
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

      {/* Artist Modal - Dark Glassmorphism Landscape */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content - Landscape, Minimal */}
          <div 
            className="relative z-10 bg-zinc-900 rounded-2xl p-6 w-full border border-gray-700 shadow-2xl"
            style={{ 
              maxWidth: '900px',
              width: '100%',
              paddingTop: '48px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 md:left-4 md:right-auto w-5 h-5 rounded-full flex items-center justify-center z-30 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: '#ff5f57',
                boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.1)',
                marginTop: '4px',
                marginRight: '4px'
              }}
              aria-label="Close modal"
            >
              <span 
                style={{
                  color: '#000',
                  fontSize: '14px',
                  lineHeight: '1',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.8
                }}
              >
                ×
              </span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Panel - Content */}
              <div className="flex flex-col justify-center">
                {activeTab === 'artists' && selectedImage?.id === 1 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Built for artists, not influencers
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Share Your Art
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Your work is displayed instantly in a gallery style environment, and surfaced by discovery tools that prioritize creativity over trends.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Gallery style presentation
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Your art showcased beautifully and intentionally, the way it was meant to be seen.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Context rich profile
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Share your story, your process, your materials, your terms, all in one place.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'artists' && selectedImage?.id === 2 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Creativity driven discovery
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Find Your Audience
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Reach people who recognize the value of your work and want to follow your creative evolution.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Aligned Visibility
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Your art is shown to viewers whose aesthetic preferences, mediums of interest, and thematic affinities align with your practice.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Curated discovery, not popularity metrics
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Your art is surfaced through craft based curation and style awareness, giving you recognition rooted in intention and practice rather than likes or trends.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'artists' && selectedImage?.id === 3 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Effortless Fulfillment
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Focus on Your Art.<br />We'll Handle the Rest.
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Studio 3 is your Merchant of Record, managing taxes, compliance, payments, and fulfillment so you never have to.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Total Creative Autonomy
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          You set the terms: pricing, presentation, availability, without gallery constraints.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • End-to-End Fulfillment
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          From global sales tax (VAT/GST) and PCI compliance to fraud protection, chargebacks, packaging, and delivery, Studio 3 handles the heavy lifting so you can stay focused on what you love: making art.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'artists' && selectedImage?.id === 4 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Sell on your terms
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Grow Your Practice
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Grow long-term relationships with collectors, without intermediaries or hidden commissions.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Set Your Own Value
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          No gallery markups, no forced price ladders, and no restrictions on how you price or grow your work.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Understand your Audience with Real Insights
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Access data on who's viewing, saving, and collecting your work, so you can make informed decisions about pricing, demand, and future projects.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'buyers' && selectedImage?.id === 4 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Personal Connection
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Connect Directly With Artists
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Your work is displayed instantly in a gallery style environment, and surfaced by discovery tools that prioritize creativity over trends.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Message artists instantly
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Ask about availability, process, or commissions in real time.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Build relationships that deepen your collection
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Stay connected as artists evolve their practice and discover new work before anyone else.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'buyers' && selectedImage?.id === 5 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Authenticity & Protection
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Purchase with Peace of Mind
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Studio 3 verifies key artwork details and ensures every purchase is protected from authentication to secure delivery.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Verified authenticity
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Studio 3 authenticates every artwork with the artist, verifying provenance, materials, and edition details so you collect with confidence and accuracy.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Build relationships that deepen your collection
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Every transaction is encrypted, insured, and backed by Studio 3's buyer protection. Your artwork ships with professional packaging and end-to-end tracking.
                        </p>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'enthusiasts' ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Personal Connection
                    </p>

                    {/* Main Title */}
                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      Experience Art Uninterrupted
                    </h2>

                    {/* Description */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      A space built for people who want to explore art without distractions, trends, or noise.
                    </p>

                    {/* Features List - Minimal */}
                    <div className="space-y-4">
                      {/* Feature 1 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Art first browsing
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Discover work through curated flows that highlight creativity, context, and craftsmanship — not popularity metrics or viral content.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14pt',
                            color: '#fff',
                            marginBottom: '4px'
                          }}
                        >
                          • Explore deeply & intentionally
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '13pt',
                            color: '#848597',
                            lineHeight: '1.4'
                          }}
                        >
                          Follow artists, save pieces, and dive into stories, materials, and process notes that bring the work to life, all without ads, interruptions, or algorithmic pressure.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Default content for other images */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#848597',
                        marginBottom: '8px'
                      }}
                    >
                      Built for artists, not influencers
                    </p>

                    <h2 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '24pt',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '12px'
                      }}
                    >
                      {selectedImage?.description || 'Share Your Art'}
                    </h2>

                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '14pt',
                        color: '#848597',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Your work is displayed instantly in a gallery style environment, and surfaced by discovery tools that prioritize creativity over trends.
                    </p>
                  </>
                )}
              </div>

              {/* Right Panel - Image or Collage */}
              {selectedImage && activeTab === 'enthusiasts' ? (
                // Enthusiasts Collage - 4 images on desktop, 2 images on mobile
                <div className="flex items-center justify-center w-full">
                  {/* Desktop: 4-image collage */}
                  <div 
                    className="hidden md:grid w-full"
                    style={{
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(3, auto)',
                      gap: '8px',
                      maxWidth: '400px'
                    }}
                  >
                    {/* Image 1: Top left - square */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '1',
                        gridRow: '1',
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[0]?.src ? (
                        <img 
                          src={images.enthusiasts[0].src} 
                          alt={images.enthusiasts[0].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                    
                    {/* Image 2: Top right - tall */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '2',
                        gridRow: '1 / 3',
                        width: '100%',
                        aspectRatio: '1/2',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[1]?.src ? (
                        <img 
                          src={images.enthusiasts[1].src} 
                          alt={images.enthusiasts[1].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                    
                    {/* Image 3: Second row left - tall */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '1',
                        gridRow: '2 / 4',
                        width: '100%',
                        aspectRatio: '1/2',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[2]?.src ? (
                        <img 
                          src={images.enthusiasts[2].src} 
                          alt={images.enthusiasts[2].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                    
                    {/* Image 4: Third row right - square */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '2',
                        gridRow: '3',
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[3]?.src ? (
                        <img 
                          src={images.enthusiasts[3].src} 
                          alt={images.enthusiasts[3].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Mobile: 2 images side by side */}
                  <div 
                    className="grid grid-cols-2 gap-2 w-full md:hidden"
                    style={{
                      maxWidth: '100%'
                    }}
                  >
                    {/* Image 1 */}
                    <div 
                      className="rounded-lg overflow-hidden w-full"
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[0]?.src ? (
                        <img 
                          src={images.enthusiasts[0].src} 
                          alt={images.enthusiasts[0].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                    
                    {/* Image 2 */}
                    <div 
                      className="rounded-lg overflow-hidden w-full"
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px'
                      }}
                    >
                      {images.enthusiasts[1]?.src ? (
                        <img 
                          src={images.enthusiasts[1].src} 
                          alt={images.enthusiasts[1].placeholder}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : selectedImage ? (
                // Single image for Artists/Buyers
                <div className="flex items-center justify-center relative">
                  <div 
                    className="rounded-lg overflow-hidden w-full"
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px'
                    }}
                  >
                    <img 
                      src={selectedImage.src} 
                      alt={selectedImage.description}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default QuoteSection;

