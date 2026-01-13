import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getCloudinaryImageUrl } from '../utils/cloudinary';

const QuoteSection = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For mobile carousel - tracks which image in the active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const tabs = [
    { title: 'Artists', id: 'artists' },
    { title: 'Buyers & Collectors', id: 'buyers' },
    { title: 'Enthusiasts', id: 'enthusiasts' }
  ];

  // Images with descriptions for Artists section - using Cloudinary URLs
  const images = {
    artists: [
      { 
        id: 1, 
        src: getCloudinaryImageUrl('artists-image-2.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('artists-image-2-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Share Your Art' 
      },
      { 
        id: 2, 
        src: getCloudinaryImageUrl('artists-image-1.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('artists-image-1-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Find Your Audience' 
      },
      { 
        id: 3, 
        src: getCloudinaryImageUrl('artists-image-4.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('artists-image-4-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Focus on Your Art, We\'ll Handle the Rest' 
      },
      { 
        id: 4, 
        src: getCloudinaryImageUrl('artists-image-3.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('artists-image-3-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Grow Your Practice' 
      }
    ],
    buyers: [
      { 
        id: 4, 
        src: getCloudinaryImageUrl('buyers-image-1.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('buyers-image-1-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Connect Directly With Artists' 
      },
      { 
        id: 5, 
        src: getCloudinaryImageUrl('buyers-image-2.webp', { width: 2400, quality: 90, format: 'auto' }), 
        mobileSrc: getCloudinaryImageUrl('buyers-image-2-mobile.webp', { width: 1200, quality: 90, format: 'auto' }),
        description: 'Purchase With Peace of Mind' 
      }
    ],
    enthusiasts: [
      { 
        id: 7, 
        src: getCloudinaryImageUrl('AdobeStock_213841942.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 1' 
      },
      { 
        id: 8, 
        src: getCloudinaryImageUrl('AdobeStock_785220762.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 2' 
      },
      { 
        id: 9, 
        src: getCloudinaryImageUrl('AdobeStock_469893497.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 3' 
      },
      { 
        id: 10, 
        src: getCloudinaryImageUrl('AdobeStock_460628886.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 4' 
      },
      { 
        id: 11, 
        src: getCloudinaryImageUrl('AdobeStock_231517092.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 5' 
      },
      { 
        id: 12, 
        src: getCloudinaryImageUrl('AdobeStock_135490522.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 6' 
      },
      { 
        id: 13, 
        src: getCloudinaryImageUrl('AdobeStock_118182508.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 7' 
      },
      { 
        id: 14, 
        src: getCloudinaryImageUrl('AdobeStock_421538237.webp', { width: 1200, quality: 'auto', format: 'auto' }), 
        placeholder: 'Enthusiasts Image 8' 
      }
    ]
  };

  // Feature descriptions for artists mobile slider
  const artistFeatureDescriptions = {
    1: "Your work is displayed instantly in a gallery style environment, and surfaced by discovery tools that prioritize creativity over trends.",
    2: "Reach people who value your work through aligned visibility. Your art is surfaced to viewers who appreciate your style, with discovery that recognizes skill, intention, and artistic depth.",
    3: "From global sales tax (VAT/GST) and PCI compliance to fraud protection, chargebacks, packaging, and delivery, Studio 3 handles the heavy lifting so you can stay focused on what you love: making art.",
    4: "Build direct collector relationships without markups or gatekeepers. Set your own pricing and value, and use real insights on views, saves, and collector interest to guide demand, pricing, and future work."
  };

  // Feature descriptions for buyers mobile slider
  const buyerFeatureDescriptions = {
    4: "Explore art in a gallery style space guided by creativity, connect with artists in real time, and build relationships that deepen your collection as their work and practice evolve.",
    5: "We authenticate each piece, secure every payment with encryption and insurance, and ship with professional packaging and tracking for a safe, confident collecting experience."
  };

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug: Log image URLs in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('QuoteSection - Desktop image URLs:');
      images.artists.forEach(img => {
        console.log(`Artists ${img.id}:`, img.src);
      });
      images.buyers.forEach(img => {
        console.log(`Buyers ${img.id}:`, img.src);
        if (img.id === 4) {
          console.log('🔍 Buyers Image 1 (ID 4) URL:', img.src);
          console.log('🔍 Buyers Image 1 filename: buyers-image-1.webp');
        }
      });
    }
  }, []);

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
    // Don't open modal on mobile (lg breakpoint is 1024px)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return;
    }

    // Open modal for artist or buyers/collectors images (desktop only)
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

  // Navigation functions for artist and buyers modal
  const handleNextImage = useCallback(() => {
    if (activeTab === 'artists' && selectedImage) {
      const currentIndex = images.artists.findIndex(img => img.id === selectedImage.id);
      if (currentIndex < images.artists.length - 1) {
        setSelectedImage(images.artists[currentIndex + 1]);
      } else {
        // Loop to first image
        setSelectedImage(images.artists[0]);
      }
    } else if (activeTab === 'buyers' && selectedImage) {
      const currentIndex = images.buyers.findIndex(img => img.id === selectedImage.id);
      if (currentIndex < images.buyers.length - 1) {
        setSelectedImage(images.buyers[currentIndex + 1]);
      } else {
        // Loop to first image
        setSelectedImage(images.buyers[0]);
      }
    }
  }, [activeTab, selectedImage]);

  const handlePreviousImage = useCallback(() => {
    if (activeTab === 'artists' && selectedImage) {
      const currentIndex = images.artists.findIndex(img => img.id === selectedImage.id);
      if (currentIndex > 0) {
        setSelectedImage(images.artists[currentIndex - 1]);
      } else {
        // Loop to last image
        setSelectedImage(images.artists[images.artists.length - 1]);
      }
    } else if (activeTab === 'buyers' && selectedImage) {
      const currentIndex = images.buyers.findIndex(img => img.id === selectedImage.id);
      if (currentIndex > 0) {
        setSelectedImage(images.buyers[currentIndex - 1]);
      } else {
        // Loop to last image
        setSelectedImage(images.buyers[images.buyers.length - 1]);
      }
    }
  }, [activeTab, selectedImage]);

  // Keyboard navigation for artist and buyers modal
  useEffect(() => {
    if (!isModalOpen || (activeTab !== 'artists' && activeTab !== 'buyers')) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isModalOpen, activeTab, selectedImage, handleNextImage, handlePreviousImage]);

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
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                      style={{ borderRadius: '20px', willChange: 'transform' }}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('Desktop image failed to load:', e.target.src);
                        console.error('Image object:', image);
                      }}
                      onLoad={() => {
                        if (import.meta.env.DEV) {
                          console.log('Desktop image loaded:', image.src);
                        }
                      }}
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
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                      style={{ borderRadius: '20px', willChange: 'transform' }}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('❌ Desktop buyers image failed to load:', e.target.src);
                        console.error('Image ID:', image.id);
                        console.error('Image description:', image.description);
                        console.error('Full image object:', image);
                        // Try to open the URL directly for debugging
                        if (import.meta.env.DEV && image.id === 4) {
                          console.error('🔍 Buyers Image 1 (ID 4) - Check if this URL works in browser:', e.target.src);
                        }
                      }}
                      onLoad={() => {
                        if (import.meta.env.DEV) {
                          console.log('✅ Desktop buyers image loaded:', image.src);
                          if (image.id === 4) {
                            console.log('✅ Buyers Image 1 (ID 4) loaded successfully!');
                          }
                        }
                      }}
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
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[0]?.src ? (
                      <img 
                        src={images.enthusiasts[0].src} 
                        alt={images.enthusiasts[0].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
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
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[1]?.src ? (
                      <img 
                        src={images.enthusiasts[1].src} 
                        alt={images.enthusiasts[1].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
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
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {images.enthusiasts[2]?.src ? (
                    <img 
                      src={images.enthusiasts[2].src} 
                      alt={images.enthusiasts[2].placeholder}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                      style={{ borderRadius: '20px', willChange: 'transform' }}
                      loading="lazy"
                      decoding="async"
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
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {images.enthusiasts[3]?.src ? (
                    <img 
                      src={images.enthusiasts[3].src} 
                      alt={images.enthusiasts[3].placeholder}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110"
                      style={{ borderRadius: '20px', willChange: 'transform' }}
                      loading="lazy"
                      decoding="async"
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
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[4]?.src ? (
                      <img 
                        src={images.enthusiasts[4].src} 
                        alt={images.enthusiasts[4].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <span>{images.enthusiasts[4]?.placeholder}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 6: 294x318 - Aligned with end of Image 3 */}
                  <div 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[5]?.id)}
                    style={{
                      width: '100%',
                      aspectRatio: '294/318',
                      backgroundColor: '#D1D5DB',
                      background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[5]?.src ? (
                      <img 
                        src={images.enthusiasts[5].src} 
                        alt={images.enthusiasts[5].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
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
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[6]?.src ? (
                      <img 
                        src={images.enthusiasts[6].src} 
                        alt={images.enthusiasts[6].placeholder}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
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
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {images.enthusiasts[7]?.src ? (
                      <img 
                        src={images.enthusiasts[7].src} 
                        alt={images.enthusiasts[7].placeholder}
                        className="w-full h-full object-cover"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
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
              {/* Mobile Enthusiasts Collage - 3 images: Image 5 (wide top), Image 3 and Image 6 (squares bottom) */}
              <div 
                className="flex flex-col"
                style={{
                  gap: '8px',
                  width: '100%'
                }}
              >
                {/* Image 5: Top - wide/rectangular */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(images.enthusiasts[4]?.id)}
                  style={{
                    width: '100%',
                    aspectRatio: '353/157',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                    borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[4]?.src ? (
                    <img 
                      src={images.enthusiasts[4].src} 
                      alt={images.enthusiasts[4].placeholder}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[4]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                {/* Bottom row: Image 3 and Image 6 side by side */}
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}
                >
                  {/* Image 3: Bottom left */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(images.enthusiasts[2]?.id)}
                  style={{
                    width: '100%',
                      aspectRatio: '172/228',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                  }}
                >
                  {images.enthusiasts[2]?.src ? (
                    <img 
                      src={images.enthusiasts[2].src} 
                      alt={images.enthusiasts[2].placeholder}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      <span>{images.enthusiasts[2]?.placeholder}</span>
                    </div>
                  )}
                </div>
                
                  {/* Image 6: Bottom right */}
                <div 
                  className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(images.enthusiasts[5]?.id)}
                  style={{
                    width: '100%',
                      aspectRatio: '172/228',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                      borderRadius: '20px'
                  }}
                >
                    {images.enthusiasts[5]?.src ? (
                    <img 
                        src={images.enthusiasts[5].src} 
                        alt={images.enthusiasts[5].placeholder}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        <span>{images.enthusiasts[5]?.placeholder}</span>
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
                  fontSize: '14pt',
                  color: '#000',
                  lineHeight: '1.4',
                  marginTop: '12px',
                  textAlign: 'left',
                  width: '100%',
                  marginBottom: '12px'
                }}
              >
                Experience Art Uninterrupted
              </p>
              
              {/* Feature Description */}
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11pt',
                  color: '#4B5563',
                  lineHeight: '1.5',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                A space to explore art without the noise of conventional social media. Engage with creativity driven discovery, dive into stories and materials, and gather inspiration that broadens how you experience art
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
                          className="rounded-lg overflow-hidden w-full"
                          style={{
                            height: activeTab === 'artists' || activeTab === 'buyers' ? 'clamp(400px, 50vh, 500px)' : 'clamp(400px, 50vh, 500px)',
                            borderRadius: '20px',
                            marginBottom: image.description ? '12px' : '0',
                            backgroundColor: '#D1D5DB',
                            background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                          }}
                        >
                          <img 
                            src={isMobile && image.mobileSrc ? image.mobileSrc : image.src} 
                            alt={image.description || image.placeholder}
                            className="w-full h-full object-cover"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      decoding="async"
                    />
                        </div>
                        {image.description && (
                          <>
                          <p 
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                                fontSize: '14pt',
                              color: '#000',
                              lineHeight: '1.4',
                                textAlign: 'left',
                                width: '100%',
                                marginBottom: (activeTab === 'artists' || activeTab === 'buyers') ? '12px' : '0'
                            }}
                          >
                            {image.description}
                          </p>
                            {activeTab === 'artists' && artistFeatureDescriptions[image.id] && (
                              <p 
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                  fontSize: '11pt',
                                  color: '#4B5563',
                                  lineHeight: '1.5',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                {artistFeatureDescriptions[image.id]}
                              </p>
                            )}
                            {activeTab === 'buyers' && buyerFeatureDescriptions[image.id] && (
                              <p 
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                  fontSize: '11pt',
                                  color: '#4B5563',
                                  lineHeight: '1.5',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                {buyerFeatureDescriptions[image.id]}
                              </p>
                            )}
                          </>
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

          {/* Pagination Dots - At the bottom */}
          {activeTab !== 'enthusiasts' ? (
            <div className="flex justify-center gap-4 items-center">
              {/* Left Arrow */}
              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  className="transition-opacity hover:opacity-70"
                  aria-label="Previous image"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '24px', color: '#000', lineHeight: '1', fontWeight: 300 }}>‹</span>
                </button>
              )}
              
              {/* Pagination Dots */}
              <div className="flex gap-2 items-center">
              {images[activeTab].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                    className="rounded-full transition-all"
                  style={{
                      width: index === currentImageIndex ? '10px' : '8px',
                      height: index === currentImageIndex ? '10px' : '8px',
                      backgroundColor: index === currentImageIndex ? '#000' : '#D1D5DB',
                      opacity: index === currentImageIndex ? 1 : 0.5
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
              
              {/* Right Arrow */}
              {currentImageIndex < images[activeTab].length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  className="transition-opacity hover:opacity-70"
                  aria-label="Next image"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '24px', color: '#000', lineHeight: '1', fontWeight: 300 }}>›</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center gap-2 items-center">
              {/* Show 3 dots for the 3 images displayed (Image 5, Image 3, Image 6) */}
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-full transition-all"
                  style={{
                    width: index === 0 ? '10px' : '8px',
                    height: index === 0 ? '10px' : '8px',
                    backgroundColor: index === 0 ? '#000' : '#D1D5DB',
                    opacity: index === 0 ? 1 : 0.5
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Artist Modal - White Glassmorphism Landscape */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay with white glass effect */}
          <div 
            className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md"
            style={{
              boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content - White Glass with transparency */}
          <div 
            className={`relative z-10 rounded-2xl w-full border border-white border-opacity-20 shadow-2xl overflow-y-auto flex flex-col group ${
              (activeTab === 'artists' || activeTab === 'buyers') ? 'pl-16 pr-16 py-8 md:py-10 lg:py-12' : 'p-8 md:p-10 lg:p-12'
            }`}
            style={{ 
              maxWidth: '90vw',
              width: '90vw',
              maxHeight: '90vh',
              minHeight: '85vh',
              margin: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center z-30"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Navigation Arrows - For Artists and Buyers */}
            {(activeTab === 'artists' || activeTab === 'buyers') && selectedImage && (
              <>
                {/* Previous Arrow - Visible on mobile, hover on desktop */}
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black transition-all text-4xl md:text-5xl leading-none w-10 h-10 flex items-center justify-center z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                {/* Next Arrow - Visible on mobile, hover on desktop */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black transition-all text-4xl md:text-5xl leading-none w-10 h-10 flex items-center justify-center z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 items-center flex-1">
              {/* Left Panel - Content - Top on mobile, left on desktop */}
              <div className="flex flex-col justify-center order-1 md:order-1 w-full">
                {activeTab === 'artists' && selectedImage?.id === 1 ? (
                  <>
                    {/* Header */}
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '12pt',
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Gallery style presentation
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Context rich profile
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Aligned Visibility
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Curated discovery, not popularity metrics
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Total Creative Autonomy
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • End-to-End Fulfillment
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Set Your Own Value
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Understand your Audience with Real Insights
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Explore art in a gallery style space guided by creativity, and connect directly with artists to deepen your collection and follow their evolving practice.
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Message artists instantly
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Build relationships that deepen your collection
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Verified authenticity
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Secure payments, safe delivery
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Art first browsing
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                            color: '#000',
                            marginBottom: '4px'
                          }}
                        >
                          • Explore deeply & intentionally
                        </p>
                        <p 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12pt',
                            color: '#4B5563',
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
                        color: '#4B5563',
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
                        color: '#000',
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
                        color: '#4B5563',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                      }}
                    >
                      Your work is displayed instantly in a gallery style environment, and surfaced by discovery tools that prioritize creativity over trends.
                    </p>
                  </>
                )}
              </div>

              {/* Right Panel - Image or Collage - Bottom on mobile, right on desktop */}
              {selectedImage && activeTab === 'enthusiasts' ? (
                // Enthusiasts Collage - 4 images on desktop, 2 images on mobile
                <div className="flex items-center justify-center w-full order-2 md:order-2">
                  {/* Desktop: 4-image collage */}
                  <div 
                    className="hidden md:grid w-full"
                    style={{
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(3, auto)',
                      gap: '8px',
                      maxWidth: '850px',
                      width: '100%'
                    }}
                  >
                    {/* Image 1: Top left - 306x202 */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '1',
                        gridRow: '1',
                        width: '100%',
                        aspectRatio: '306/202',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[0]?.src ? (
                        <img 
                          src={images.enthusiasts[0].src} 
                          alt={images.enthusiasts[0].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 2: Top right - 306x431 */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '2',
                        gridRow: '1 / 3',
                        width: '100%',
                        aspectRatio: '306/431',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[3]?.src ? (
                        <img 
                          src={images.enthusiasts[3].src} 
                          alt={images.enthusiasts[3].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 3: Second row left - 306x431 */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '1',
                        gridRow: '2 / 4',
                        width: '100%',
                        aspectRatio: '306/431',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[1]?.src ? (
                        <img 
                          src={images.enthusiasts[1].src} 
                          alt={images.enthusiasts[1].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 4: Third row right - 306x202 */}
                    <div 
                      className="rounded-lg overflow-hidden"
                      style={{
                        gridColumn: '2',
                        gridRow: '3',
                        width: '100%',
                        aspectRatio: '306/202',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[7]?.src ? (
                        <img 
                          src={images.enthusiasts[7].src} 
                          alt={images.enthusiasts[7].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Mobile: 4 images in 2x2 grid */}
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
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[0]?.src ? (
                        <img 
                          src={images.enthusiasts[0].src} 
                          alt={images.enthusiasts[0].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 2 */}
                    <div 
                      className="rounded-lg overflow-hidden w-full"
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[3]?.src ? (
                        <img 
                          src={images.enthusiasts[3].src} 
                          alt={images.enthusiasts[3].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 3 */}
                    <div 
                      className="rounded-lg overflow-hidden w-full"
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[1]?.src ? (
                        <img 
                          src={images.enthusiasts[1].src} 
                          alt={images.enthusiasts[1].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                    
                    {/* Image 4 */}
                    <div 
                      className="rounded-lg overflow-hidden w-full"
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                      }}
                    >
                      {images.enthusiasts[7]?.src ? (
                        <img 
                          src={images.enthusiasts[7].src} 
                          alt={images.enthusiasts[7].placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                      ) : null}
                    </div>
                  </div>
                </div>
                ) : selectedImage ? (
                 // Single image for Artists/Buyers - Bottom on mobile, right on desktop
                 <div className="flex items-center justify-center w-full order-2 md:order-2">
                   {/* Desktop: Single centered image - Consistent size */}
                   <div className="hidden md:flex items-center justify-center relative w-full">
                     <div 
                       className="rounded-lg overflow-hidden"
                       style={{
                         aspectRatio: '1/1',
                         borderRadius: '12px',
                         width: '100%',
                         maxWidth: '850px',
                       }}
                     >
                       <img 
                         src={selectedImage.src} 
                         alt={selectedImage.description || selectedImage.placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                     </div>
                   </div>
                   
                   {/* Mobile: Single image in similar container to enthusiasts */}
                   <div 
                     className="w-full md:hidden"
                     style={{
                       maxWidth: '100%'
                     }}
                   >
                     <div 
                       className="rounded-lg overflow-hidden w-full"
                       style={{
                         aspectRatio: '1/1',
                         borderRadius: '12px',
                       }}
                     >
                       <img 
                         src={selectedImage.src} 
                         alt={selectedImage.description || selectedImage.placeholder}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '12px' }}
                         loading="eager"
                         decoding="async"
                       />
                     </div>
                   </div>
                 </div>
               ) : null}
            </div>

            {/* Pagination - For Artists and Buyers */}
            {activeTab === 'artists' && selectedImage && (
              <div className="flex justify-center items-center gap-2 mt-6 pb-4">
                {images.artists.map((image, index) => {
                  const currentIndex = images.artists.findIndex(img => img.id === selectedImage.id);
                  return (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`transition-all rounded-full ${
                        index === currentIndex
                          ? 'bg-gray-800 w-3 h-3'
                          : 'bg-gray-400 bg-opacity-60 w-2 h-2 hover:bg-opacity-80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  );
                })}
              </div>
            )}
            {activeTab === 'buyers' && selectedImage && (
              <div className="flex justify-center items-center gap-2 mt-6 pb-4">
                {images.buyers.map((image, index) => {
                  const currentIndex = images.buyers.findIndex(img => img.id === selectedImage.id);
                  return (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`transition-all rounded-full ${
                        index === currentIndex
                          ? 'bg-gray-800 w-3 h-3'
                          : 'bg-gray-400 bg-opacity-60 w-2 h-2 hover:bg-opacity-80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default QuoteSection;

