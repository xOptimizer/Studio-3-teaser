import React, { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const [expandedSection, setExpandedSection] = useState('social');
  const imageContainerRefs = useRef([]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'social',
      title: 'The Social Discover',
      description: 'A creator focused social platform where your work isn\'t buried by algorithms. Share your process, tell your story, and connect with collectors; all in one home built for artists, not content.',
      comingSoon: 'Coming Spring 2026',
      images: ['social-left', 'social-right'] // Two side-by-side cards
    },
    {
      id: 'studio',
      title: 'The Studio',
      description: 'Our flagship Dallas studio blends creation, community, and wellness - a true third space for creatives. Membership gives you access to dedicated work areas, world class workshops, curated events, and a creative environment designed for connection.',
      comingSoon: 'Coming Summer 2026',
      images: ['studio-main', 'poolside', 'wellness'] // Image names to be added
    },
    {
      id: 'marketplace',
      title: 'The Marketplace',
      description: 'A curated creative supply marketplace offering the best prices with no hidden markups. Every product is organized by skill level so you can shop confidently and choose the right materials for your craft.',
      comingSoon: 'Coming Spring 2026',
      images: ['marketplace-desktop', 'marketplace-mobile'] // UI mockup images
    }
  ];

  useGSAP(() => {
    // Animate title
    gsap.from('.explore-title', {
      scrollTrigger: {
        trigger: '.explore-title',
        start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Animate main card
    gsap.from('.section-card', {
      scrollTrigger: {
        trigger: '.section-card',
        start: 'top 80%'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out'
    });

    // Animate image containers sliding in from right when scrolling
    imageContainerRefs.current.forEach((container, index) => {
      if (!container) return;
      
      // Reset animation state
      gsap.set(container, { x: 100, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(container, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          });
        },
        once: false,
      });
    });
  }, [expandedSection]);

  return (
    <section className="w-full bg-white py-12 md:py-20 px-5 md:px-10 border-t border-gray-100">
      <div className="screen-max-width">
        {/* Title */}
        <h2 className="explore-title text-black text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
          About Studio 3
        </h2>

        {/* Main Card */}
        <div className="section-card bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Section - Collapsible Items */}
            <div className="flex-1 space-y-0">
              {sections.map((section, index) => (
                <div key={section.id} className={`border-b border-gray-200 last:border-b-0 transition-colors ${expandedSection === section.id ? 'bg-gray-50 -mx-2 px-2 rounded-lg' : ''}`}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-5 md:py-6 text-left group hover:opacity-80 transition-opacity"
                  >
                    <h3 className={`text-black text-lg md:text-xl lg:text-2xl font-semibold transition-colors ${expandedSection === section.id ? 'text-black' : 'text-gray-800'}`}>
                      {section.title}
                    </h3>
                    <svg
                      className={`w-5 h-5 md:w-6 md:h-6 text-gray-600 transition-all duration-300 ${
                        expandedSection === section.id ? 'rotate-180 text-black' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {expandedSection === section.id && (
                    <div className="pb-5 md:pb-6 animate-fadeIn">
                      {section.comingSoon && (
                        <p className="text-gray-500 text-sm md:text-base italic mb-4 font-medium">
                          {section.comingSoon}
                        </p>
                      )}
                      {section.description && (
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {section.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section - Images (Desktop) */}
            {expandedSection === 'social' && (
              <div 
                ref={(el) => (imageContainerRefs.current[0] = el)}
                className="hidden lg:flex flex-1 gap-4 ml-4"
              >
                {/* Left Card - Artwork Display */}
                <div className="flex-1 rounded-2xl overflow-hidden bg-white shadow-2xl">
                  <img
                    src="/assets/images/social-left.jpg"
                    alt="Social Discover Left Card"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-white items-center justify-center text-gray text-sm border border-gray-300 rounded-2xl" style={{ minHeight: '500px' }}>
                    Social Discover Left Card
                  </div>
                </div>
                {/* Right Card - Artwork Details */}
                <div className="flex-1 rounded-2xl overflow-hidden bg-white shadow-2xl">
                  <img
                    src="/assets/images/social-right.jpg"
                    alt="Social Discover Right Card"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-white items-center justify-center text-gray text-sm border border-gray-300 rounded-2xl" style={{ minHeight: '500px' }}>
                    Social Discover Right Card
                  </div>
                </div>
              </div>
            )}

            {expandedSection === 'studio' && (
              <div 
                ref={(el) => (imageContainerRefs.current[1] = el)}
                className="hidden lg:flex flex-col flex-1 gap-4 ml-4"
              >
                {/* Large Landscape Image - Art Studio */}
                <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <img
                    src="/assets/images/studio-main.jpg"
                    alt="Art Studio"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-sm" style={{ aspectRatio: '16/9' }}>
                    Art Studio Image
                  </div>
                </div>

                {/* Two Smaller Landscape Images */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <img
                      src="/assets/images/poolside.jpg"
                      alt="Poolside"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-xs" style={{ aspectRatio: '16/9' }}>
                      Poolside Image
                    </div>
                  </div>
                  <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <img
                      src="/assets/images/wellness.jpg"
                      alt="Wellness Space"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-xs" style={{ aspectRatio: '16/9' }}>
                      Wellness Image
                    </div>
                  </div>
                </div>
              </div>
            )}

            {expandedSection === 'marketplace' && (
              <div 
                ref={(el) => (imageContainerRefs.current[2] = el)}
                className="hidden lg:flex flex-1 relative items-start justify-end ml-4"
              >
                {/* Desktop UI Mockup - Larger, positioned upper right */}
                <div className="w-full max-w-lg device-frame-laptop relative z-10">
                  <div className="device-screen">
                    <img
                      src="/assets/images/marketplace-desktop.jpg"
                      alt="Marketplace Desktop"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-96 bg-white items-center justify-center text-gray text-sm border border-gray-300 rounded-2xl">
                      Marketplace Desktop Mockup
                    </div>
                  </div>
                </div>
                {/* Mobile UI Mockup - Smaller, positioned lower left, overlapping */}
                <div className="absolute bottom-0 left-0 w-40 device-frame-mobile -ml-8 -mb-4 z-20">
                  <div className="device-screen">
                    <img
                      src="/assets/images/marketplace-mobile.jpg"
                      alt="Marketplace Mobile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-56 bg-white items-center justify-center text-gray text-xs border border-gray-300 rounded-2xl">
                      Mobile Mockup
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile View - Images shown when sections are expanded */}
          <div className="lg:hidden mt-6">
              {expandedSection === 'social' && (
                <div 
                  ref={(el) => (imageContainerRefs.current[0] = el)}
                  className="mt-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {/* Left Card - Artwork Display */}
                    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-lg">
                      <img
                        src="/assets/images/social-left.jpg"
                        alt="Social Discover Left Card"
                        className="w-full h-auto object-contain"
                        style={{ display: 'block', maxWidth: '100%' }}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-auto bg-white items-center justify-center text-gray text-xs border border-gray-300 rounded-2xl" style={{ minHeight: '300px' }}>
                        Social Discover Left Card
                      </div>
                    </div>
                    {/* Right Card - Artwork Details */}
                    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-lg">
                      <img
                        src="/assets/images/social-right.jpg"
                        alt="Social Discover Right Card"
                        className="w-full h-auto object-contain"
                        style={{ display: 'block', maxWidth: '100%' }}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-auto bg-white items-center justify-center text-gray text-xs border border-gray-300 rounded-2xl" style={{ minHeight: '300px' }}>
                        Social Discover Right Card
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {expandedSection === 'studio' && (
                <div 
                  ref={(el) => (imageContainerRefs.current[1] = el)}
                  className="mt-4 space-y-4"
                >
                  {/* Large Landscape Image - Art Studio */}
                  <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <img
                      src="/assets/images/studio-main.jpg"
                      alt="Art Studio"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-sm" style={{ aspectRatio: '16/9' }}>
                      Art Studio Image
                    </div>
                  </div>

                  {/* Two Smaller Landscape Images */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                      <img
                        src="/assets/images/poolside.jpg"
                        alt="Poolside"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-xs" style={{ aspectRatio: '16/9' }}>
                        Poolside
                      </div>
                    </div>
                    <div className="w-full rounded-2xl overflow-hidden bg-gray-300 shadow-lg" style={{ aspectRatio: '16/9' }}>
                      <img
                        src="/assets/images/wellness.jpg"
                        alt="Wellness Space"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-gray-300 items-center justify-center text-gray text-xs" style={{ aspectRatio: '16/9' }}>
                        Wellness
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {expandedSection === 'marketplace' && (
                <div 
                  ref={(el) => (imageContainerRefs.current[2] = el)}
                  className="mt-4"
                >
                  {/* Desktop UI Mockup - Only show laptop in mobile view */}
                  <div className="w-full device-frame-laptop">
                    <div className="device-screen">
                      <img
                        src="/assets/images/marketplace-desktop.jpg"
                        alt="Marketplace Desktop"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-64 bg-white items-center justify-center text-gray text-sm border border-gray-300 rounded-2xl">
                        Marketplace Desktop Mockup
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </section>
  )
}

export default HowItWorks
  