const QuoteSection = () => {
  return (
    <section
      id="social-discover"
      className="w-full bg-gradient-to-b from-[#faf8f3] to-[#f5f0e8] min-h-screen flex items-center py-12 md:py-16"
      style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapAlign: 'start' }}
    >
      <div className="w-full flex justify-center">
        <div 
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start"
          style={{ width: '95%' }}
        >
          {/* Left Column - Portrait Photo/Video */}
          <div className="w-full">
            <div className="w-full overflow-hidden group cursor-pointer rounded-sm shadow-lg transition-all duration-500 hover:shadow-2xl" style={{ aspectRatio: '3/4' }}>
              <img
                src="/assets/images/social-left.jpg"
                alt="Social Discover Portrait"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* You can replace img with video tag if needed:
              <video
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/path/to/video.mp4" type="video/mp4" />
              </video>
              */}
            </div>
          </div>

          {/* Right Column - Landscape Photo/Video and Text */}
          <div className="w-full flex flex-col gap-6 md:gap-8 lg:gap-10">
            {/* Landscape Photo/Video */}
            <div className="w-full aspect-video overflow-hidden group cursor-pointer rounded-sm shadow-lg transition-all duration-500 hover:shadow-2xl">
              <img
                src="/assets/images/social-right.jpg"
                alt="Social Discover Landscape"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* You can replace img with video tag if needed:
              <video
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/path/to/video.mp4" type="video/mp4" />
              </video>
              */}
            </div>

            {/* Text Content */}
            <div className="w-full text-center mt-8 md:mt-12 lg:mt-16">
              {/* Title */}
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl text-black mb-6 md:mb-8 transition-all duration-300 hover:opacity-80 hover:-translate-y-1" 
                style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: '1.2' }}
              >
                The Social Discover
              </h2>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl text-black/70 leading-relaxed mb-6 md:mb-8 transition-all duration-300 hover:text-black/90" style={{ lineHeight: '1.6' }}>
                A creator focused social platform where your work isn't buried by algorithms. Share your process, tell your story, and connect with collectors; all in one home built for artists, not content.
              </blockquote>

              {/* Attribution */}
              <div className="text-base md:text-lg text-black/60 transition-all duration-300 hover:text-black/80">
                <cite className="not-italic font-light tracking-wide">Coming Spring, 2026</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

