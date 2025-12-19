const StudioSection = () => {
  return (
    <section
      id="studio"
      className="w-full bg-gradient-to-b from-[#faf8f3] to-[#f5f0e8] min-h-screen flex items-center justify-center py-24 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapAlign: 'start' }}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Large Quotation Marks */}
        <div className="-mb-4 md:-mb-6 lg:-mb-8 transition-all duration-500 hover:opacity-60">
          <span className="text-7xl md:text-9xl lg:text-[12rem] text-black/20 leading-none transition-all duration-500 hover:text-black/30" style={{ fontWeight: 300 }}>
            "
          </span>
        </div>

        {/* Title inside quote */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-black mb-8 md:mb-10 transition-all duration-300 hover:opacity-80 hover:-translate-y-1" style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
          The Studio
        </h2>

        {/* Quote Text */}
        <blockquote className="text-2xl md:text-3xl lg:text-4xl text-black/70 leading-relaxed mb-8 md:mb-12 px-4 transition-all duration-300 hover:text-black/90" style={{ lineHeight: '1.6' }}>
          Our flagship Dallas studio blends creation, community, and wellness - a true third space for creatives. Membership gives you access to dedicated work areas, world class workshops, curated events, and a creative environment designed for connection.
        </blockquote>

        {/* Attribution */}
        <div className="text-lg md:text-xl text-black/60 transition-all duration-300 hover:text-black/80">
          <cite className="not-italic font-light tracking-wide">Coming Summer, 2026</cite>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;

