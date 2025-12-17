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
      className="w-full bg-[#faf8f3] min-h-screen flex items-center justify-center pt-4 pb-12 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column */}
        <div className="flex flex-col">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-16 md:mb-20 text-black tracking-tight transition-all duration-300 hover:opacity-80 hover:translate-x-1"
            style={{
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            About Studio 3
          </h1>

          <div className="flex gap-6 items-start">
            {/* Services List */}
            <div className="flex-shrink-0">
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="text-xl md:text-2xl text-black cursor-pointer"
                    style={{ fontWeight: 300 }}
                    onClick={() => handleServiceClick(service.sectionId)}
                  >
                    <span className="relative inline-flex items-center">
                      {/* Text */}
                      <span>
                        {service.name}
                      </span>

                      {/* Underline - always visible */}
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-black" />
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
            Studio 3 is a creative platform built for emerging independent artists.
            Mainstream platforms reward engagement, trends, and performance, burying meaningful work beneath viral noise. Galleries offer visibility, but often through conventional paths to visibility that limit access and reduce the share artists keep from their own work.
            <br /><br />
            <span style={{ fontWeight: 700 }}>Studio 3 changes that.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
