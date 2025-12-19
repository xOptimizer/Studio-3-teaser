const HeroNew = () => {
  const services = [
    { name: 'The Social Discover', sectionId: 'social-discover' },
    { name: 'The Marketplace', sectionId: 'marketplace' },
    { name: 'The Studio', sectionId: 'studio' },
  ];

  const handleServiceClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="w-full bg-gradient-to-b from-[#faf8f3] to-[#f5f0e8] min-h-screen flex items-center justify-center pt-4 pb-12 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapAlign: 'start' }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* Left Column */}
        <div className="flex flex-col">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-16 md:mb-20 text-black tracking-tight transition-all duration-500 hover:opacity-90 hover:translate-x-2"
            style={{
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            About Studio 3
          </h1>

          <div className="flex gap-6 items-start">
            {/* Services List */}
            <div className="flex-shrink-0">
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="text-xl md:text-2xl text-black cursor-pointer group"
                    style={{ fontWeight: 300 }}
                    onClick={() => handleServiceClick(service.sectionId)}
                  >
                    <span className="relative inline-flex items-center transition-all duration-300 group-hover:translate-x-2">
                      {/* Text */}
                      <span className="transition-all duration-300 group-hover:opacity-70">
                        {service.name}
                      </span>

                      {/* Underline with animation */}
                      <span className="absolute -bottom-1 left-0 h-px bg-black transition-all duration-300 group-hover:w-full" style={{ width: '100%' }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-black mb-10 leading-tight transition-all duration-500 hover:opacity-90 hover:-translate-y-2"
            style={{
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            A Connected Ecosystem Built for Creatives
          </h2>

          <p
            className="text-lg md:text-xl text-black/80 leading-relaxed max-w-2xl transition-all duration-300 hover:text-black/90"
            style={{ fontWeight: 300, lineHeight: '1.8' }}
          >
            Studio 3 is a creative platform built for emerging independent artists.
            Mainstream platforms reward engagement, trends, and performance, burying meaningful work beneath viral noise. Galleries offer visibility, but often through conventional paths to visibility that limit access and reduce the share artists keep from their own work.
            <br /><br />
            <span className="transition-all duration-300 hover:opacity-80" style={{ fontWeight: 700, color: '#000' }}>Studio 3 changes that.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
