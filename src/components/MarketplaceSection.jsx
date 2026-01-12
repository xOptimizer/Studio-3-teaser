import { useState } from 'react';
import { getCloudinaryImageUrl } from '../utils/cloudinary';

const MarketplaceSection = () => {
  const [expandedFeature, setExpandedFeature] = useState(1);

  const features = [
    {
      id: 1,
      title: 'AI-Powered E-Commerce',
      placeholder: 'AI-Powered commerce Image',
      src: getCloudinaryImageUrl('marketplace-image-1.webp', { 
        width: 2800, 
        quality: 90, 
        format: 'auto' 
      }),
      description: 'AI powered insights that identify the best tools for your style, build project ready supply lists, and make choosing materials feel effortless.'
    },
    {
      id: 2,
      title: 'Quality supplies, no markups',
      placeholder: 'Quality supplies Image',
      src: getCloudinaryImageUrl('marketplace-image-3.webp', {
        width: 2800, 
        quality: 90, 
        format: 'auto' 
      }),
      description: 'Professional materials priced fairly, with no additional Studio 3 margin.'
    },
    {
      id: 3,
      title: 'Purchase with Confidence',
      placeholder: 'Purchase with confidence Image',
      src: getCloudinaryImageUrl('marketplace-image-2.webp', { 
        width: 2800, 
        quality: 90, 
        format: 'auto' 
      }),
      description: "You'll always know exactly what to buy and why it fits your needs."
    }
  ];

  const toggleFeature = (featureId) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId);
  };

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
              fontSize: 'clamp(19pt, 4vw, 25pt)',
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
                className="rounded-lg w-full overflow-hidden"
                style={{
                  height: 'clamp(400px, 50vh, 500px)',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                }}
              >
                {feature.src ? (
                  <img 
                    src={feature.src} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>{feature.placeholder}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Side-by-side with dropdown */}
        <div className="hidden lg:flex items-start" style={{ marginBottom: 'clamp(32px, 6vw, 48px)', gap: '24px' }}>
          {/* Left Column - Feature List */}
          <div className="flex-1 flex items-center overflow-visible mr-6 min-h-[650px] max-h-[650px]">
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
                {features.map((feature, index) => {
                  const isExpanded = expandedFeature === feature.id;
                  return (
                    <li 
                      key={feature.id}
                      className="flex flex-col"
                      style={{ 
                        marginBottom: index < features.length - 1 ? '24px' : '0'
                      }}
                    >
                      {/* Feature Header with Dropdown */}
                      <div
                        className="flex w-full"
                        style={{
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        {/* Text Content (Title + Description) */}
                        <div 
                          className="flex-1"
                          style={{
                            minWidth: 0
                          }}
                        >
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className="w-full text-left cursor-pointer"
                            style={{
                              padding: 0,
                              background: 'none',
                              border: 'none',
                              outline: 'none',
                              width: '100%'
                            }}
                          >
                            <span 
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: isExpanded ? 600 : 400,
                                fontSize: '28pt',
                                color: isExpanded ? '#000' : '#848597',
                                transition: 'all 0.3s ease',
                                display: 'block',
                                lineHeight: '1.2'
                              }}
                            >
                              {feature.title}
                            </span>
                          </button>

                          {/* Dropdown Content */}
                          {isExpanded && feature.description && (
                            <div
                              style={{
                                marginTop: '12px',
                                animation: 'fadeIn 0.3s ease'
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                  fontSize: '14pt',
                                  color: '#4B5563',
                                  lineHeight: '1.5',
                                  textAlign: 'left',
                                  margin: 0,
                                  padding: 0
                                }}
                              >
                                {feature.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Chevron Icon - Vertically Centered */}
                        <button
                          onClick={() => toggleFeature(feature.id)}
                          className="flex-shrink-0 cursor-pointer"
                          style={{
                            padding: 0,
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: '24px',
                            height: '24px',
                            marginTop: 0
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '24pt',
                              color: '#848597',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                              display: 'block',
                              lineHeight: '1'
                            }}
                          >
                            ›
                          </span>
                        </button>
                      </div>

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
                  );
                })}
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

          {/* Right Column - Image (only shown when feature is expanded) */}
          <div className="flex-shrink-0">
            {expandedFeature && (
              <div 
                className="rounded-lg transition-all duration-500 overflow-hidden"
                style={{
                  width: '691px',
                  height: '631px',
                  backgroundColor: '#D1D5DB',
                  background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {(() => {
                  const activeFeature = features.find(f => f.id === expandedFeature);
                  return activeFeature?.src ? (
                    <img 
                      src={activeFeature.src} 
                      alt={activeFeature.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>{activeFeature?.placeholder || 'Placeholder'}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default MarketplaceSection;
