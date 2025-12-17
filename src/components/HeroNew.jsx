import { useState } from 'react';

const HeroNew = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    { name: 'The Social Discover', image: '/assets/images/social-left.jpg' },
    { name: 'The Marketplace', image: '/assets/images/marketplace-desktop.jpg' },
    { name: 'The Studio', image: '/assets/images/studio-main.jpg' },
  ];

  return (
    <section
      className="w-full bg-[#faf8f3] min-h-screen flex items-center justify-center pt-4 pb-24 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column */}
        <div className="flex flex-col">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-16 md:mb-20 text-black tracking-tight transition-all duration-300 hover:opacity-80 hover:translate-x-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
            }}
          >
            About Studio 3
          </h1>

          <div className="flex gap-6 items-start">
            {/* Services List Sub-column */}
            <div className="flex-shrink-0">
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="text-xl md:text-2xl text-black cursor-pointer"
                    style={{ fontWeight: 300 }}
                    onMouseEnter={() => setHoveredService(index)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <span className="relative inline-flex items-center group">
                      {/* Text */}
                      <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-70">
                        {service.name}
                      </span>

                      {/* Underline */}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Preview Sub-column */}
            <div className="flex-1 min-w-0">
              <div className="relative" style={{ minHeight: '200px' }}>
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`absolute top-0 left-0 transition-all duration-300 ease-out ${
                      hoveredService === index
                        ? 'opacity-100 translate-x-0 scale-100 z-10'
                        : 'opacity-0 translate-x-4 scale-95 z-0 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="block max-w-[240px] max-h-[240px] object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-black mb-10 leading-tight transition-all duration-500 hover:opacity-80 hover:-translate-y-1"
            style={{
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            A Connected Ecosystem Built for Creatives!!!
          </h2>

          <p
            className="text-lg md:text-xl text-black leading-relaxed max-w-2xl transition-opacity duration-300 hover:opacity-75"
            style={{ fontWeight: 300 }}
          >
            The outside is in all of us, but the outdoorsy world of hiking boots and
            mountain peaks can be intimidating. As an app built and curated by the
            community, AllTrails helps people plan, live, and share their next outdoor
            adventure — whether that's a hike up a mountain or a stroll around the
            neighborhood. Our brand system leverages a path framing outside stories big
            and small along with inclusive imagery to awaken the outside people in all
            of us.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
