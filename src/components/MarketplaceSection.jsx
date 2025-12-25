import { useState, useEffect, useRef } from 'react';

const MarketplaceSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef([]);
  const listContainerRef = useRef(null);

  const features = [
    {
      id: 1,
      title: 'Create with confidence',
      placeholder: 'Create with confidence Image',
      fontWeight: 600,
      color: '#000'
    },
    {
      id: 2,
      title: 'Quality supplies, no markups',
      placeholder: 'Quality supplies Image',
      fontWeight: 400,
      color: '#848597'
    },
    {
      id: 3,
      title: 'AI-Powered commerce',
      placeholder: 'AI-Powered commerce Image',
      fontWeight: 400,
      color: '#848597'
    }
  ];

  // Intersection Observer to detect which feature is in view
  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    // Method 1: Intersection Observer (works when container is scrollable)
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveFeature(index);
            }
          });
        },
        {
          root: container,
          threshold: 0.6,
          rootMargin: '-30% 0px -30% 0px'
        }
      );

      observer.observe(ref);
      return observer;
    });

    // Method 2: Scroll event listener (fallback for viewport scrolling)
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      featureRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const refRect = ref.getBoundingClientRect();
        const refCenter = refRect.top + refRect.height / 2;

        // Check if this feature's center is closest to container center
        if (Math.abs(refCenter - containerCenter) < refRect.height / 2) {
          setActiveFeature(index);
        }
      });
    };

    // Use viewport-based intersection observer as fallback
    const viewportObservers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Check if it's in the center area of viewport
              const rect = entry.boundingClientRect;
              const viewportCenter = window.innerHeight / 2;
              const elementCenter = rect.top + rect.height / 2;
              
              if (Math.abs(elementCenter - viewportCenter) < rect.height) {
                setActiveFeature(index);
              }
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: '-30% 0px -30% 0px'
        }
      );

      observer.observe(ref);
      return observer;
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
      viewportObservers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="marketplace"
      className="w-full min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: '#F7F7F7',
        scrollSnapAlign: 'start',
        paddingTop: 'clamp(40px, 8vw, 72px)',
        paddingBottom: 'clamp(40px, 10vw, 112px)'
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
            The Marketplace
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
            A curated creative supply marketplace offering the best prices with no hidden markups.
          </p>
        </div>

        {/* Mobile: Feature + Photo pairs, Desktop: Side-by-side layout */}
        {/* Mobile Layout - Feature then Photo for each */}
        <div className="flex flex-col lg:hidden" style={{ marginBottom: 'clamp(32px, 6vw, 48px)', gap: '32px' }}>
          {features.map((feature, index) => (
            <div key={feature.id} className="flex flex-col w-full">
              {/* Feature Title */}
              <div 
                ref={(el) => (featureRefs.current[index] = el)}
                className="mb-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(18pt, 4vw, 28pt)',
                  color: '#000'
                }}
              >
                {feature.title}
              </div>
              {/* Feature Photo */}
              <div 
                className="rounded-lg w-full"
                style={{
                  height: 'clamp(400px, 50vh, 500px)',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>{feature.placeholder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Side-by-side with lines */}
        <div className="hidden lg:flex items-start" style={{ marginBottom: 'clamp(32px, 6vw, 48px)', gap: '24px' }}>
          {/* Left Column - Feature List */}
          <div 
            ref={listContainerRef}
            className="flex-1 flex items-center overflow-visible mr-6 min-h-[650px] max-h-[650px]" 
            style={{ 
              scrollBehavior: 'smooth'
            }}
          >
            <div className="flex flex-col w-full">
              {/* Top Line */}
              <div 
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: '#848597',
                  marginBottom: '24px'
                }}
              />
              <ul className="flex flex-col w-full">
                {features.map((feature, index) => (
                  <li 
                    key={feature.id}
                    ref={(el) => (featureRefs.current[index] = el)}
                    className="flex flex-col transition-all duration-300 cursor-pointer"
                    style={{ 
                      marginBottom: index < features.length - 1 ? '24px' : '0',
                      opacity: activeFeature === index ? 1 : 0.6
                    }}
                    onMouseEnter={() => setActiveFeature(index)}
                    onMouseLeave={() => {
                      // Optional: You can keep the hover state or revert to scroll-based
                      // For now, we'll keep it on hover for better UX
                    }}
                  >
                    <span 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: activeFeature === index ? 600 : feature.fontWeight,
                        fontSize: '28pt',
                        color: activeFeature === index ? '#000' : feature.color,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {feature.title}
                    </span>
                    {index < features.length - 1 && (
                      <div 
                        style={{
                          width: '100%',
                          height: '1px',
                          backgroundColor: '#848597',
                          marginTop: '24px'
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
              {/* Bottom Line */}
              <div 
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: '#848597',
                  marginTop: '24px'
                }}
              />
            </div>
          </div>

          {/* Right Column - Placeholder */}
          <div className="flex-shrink-0">
            <div 
              className="rounded-lg transition-all duration-500 w-[712px]"
              style={{
                height: '650px',
                backgroundColor: '#D1D5DB',
                background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>{features[activeFeature]?.placeholder || 'Placeholder'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;

