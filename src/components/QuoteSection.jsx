import { useState, useRef, useEffect } from 'react';

const QuoteSection = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    { title: 'Artists', id: 'artists' },
    { title: 'Buyers & Collectors', id: 'buyers' },
    { title: 'Enthusiasts', id: 'enthusiasts' }
  ];

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

    if (distance > minSwipeDistance && currentSlide < slides.length - 1) {
      // Swipe left - next slide
      setCurrentSlide(currentSlide + 1);
    } else if (distance < -minSwipeDistance && currentSlide > 0) {
      // Swipe right - previous slide
      setCurrentSlide(currentSlide - 1);
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

        {/* Desktop: Three Columns | Mobile: Carousel */}
        {/* Desktop View */}
        <div className="hidden md:flex justify-center">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col items-center" style={{ marginRight: index < slides.length - 1 ? '48px' : '0' }}>
              <h3 
                className="text-black"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '24pt',
                  color: '#000',
                  borderBottom: '2px solid #000',
                  paddingBottom: '8px',
                  marginBottom: '16px',
                  width: '380px',
                  textAlign: 'center'
                }}
              >
                {slide.title}
              </h3>
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
                  <span>Image Placeholder</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
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
              transform: `translateX(-${currentSlide * 100}%)`
            }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="flex flex-col items-center flex-shrink-0 w-full px-4">
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
                  {slide.title}
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
                    <span>Image Placeholder</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-black w-8' : 'bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

