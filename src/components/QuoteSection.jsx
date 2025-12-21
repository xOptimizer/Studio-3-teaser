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

  // 9 images total - 3 for each tab
  const images = {
    artists: [
      { id: 1, placeholder: 'Artists Image 1' },
      { id: 2, placeholder: 'Artists Image 2' },
      { id: 3, placeholder: 'Artists Image 3' }
    ],
    buyers: [
      { id: 4, placeholder: 'Buyers Image 1' },
      { id: 5, placeholder: 'Buyers Image 2' },
      { id: 6, placeholder: 'Buyers Image 3' }
    ],
    enthusiasts: [
      { id: 7, placeholder: 'Enthusiasts Image 1' },
      { id: 8, placeholder: 'Enthusiasts Image 2' },
      { id: 9, placeholder: 'Enthusiasts Image 3' }
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
        background: 'linear-gradient(to bottom, #F7F7F7, #EDEDED)',
        scrollSnapAlign: 'start',
        paddingTop: 'clamp(40px, 8vw, 72px)',
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
              fontSize: 'clamp(18pt, 4vw, 24pt)',
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

        {/* Desktop: Three Columns with Headings */}
        <div className="hidden md:flex justify-center">
          {tabs.map((tab, tabIndex) => (
            <div key={tab.id} className="flex flex-col items-center" style={{ marginRight: tabIndex < tabs.length - 1 ? '48px' : '0' }}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '24pt',
                  color: activeTab === tab.id ? '#000' : '#848597',
                  borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid #848597',
                  paddingBottom: '8px',
                  marginBottom: '16px',
                  width: '380px',
                  textAlign: 'center',
                  background: 'none',
                  border: 'none',
                  outline: 'none'
                }}
              >
                {tab.title}
              </button>
              <div 
                className="rounded-lg overflow-hidden flex-shrink-0"
                style={{
                  width: '380px',
                  height: '580px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>{images[activeTab][tabIndex]?.placeholder || 'Image Placeholder'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel - Shows tabs with headings and images */}
        <div 
          ref={carouselRef}
          className="md:hidden relative overflow-hidden"
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
              <div key={image.id} className="flex flex-col items-center flex-shrink-0 w-full px-4">
                <h3 
                  className="text-black w-full"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 'clamp(18pt, 5vw, 24pt)',
                    color: '#000',
                    borderBottom: '2px solid #000',
                    paddingBottom: '8px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}
                >
                  {tabs.find(t => t.id === activeTab)?.title}
                </h3>
                <div 
                  className="rounded-lg overflow-hidden flex-shrink-0 w-full max-w-[380px] mx-auto"
                  style={{
                    aspectRatio: '380/580',
                    backgroundColor: '#D1D5DB',
                    background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>{image.placeholder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Buttons for Mobile - Below carousel */}
          <div className="flex justify-center gap-4 mt-6 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-black transition-all duration-200"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(14pt, 3vw, 16pt)',
                  color: activeTab === tab.id ? '#000' : '#848597',
                  borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
                  paddingBottom: '8px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  outline: 'none'
                }}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Carousel Indicators - Shows dots for images in active tab */}
          <div className="flex justify-center gap-2 mt-2">
            {images[activeTab].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-black w-8' : 'bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

