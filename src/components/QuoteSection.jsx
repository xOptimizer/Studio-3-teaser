const QuoteSection = () => {
  return (
    <section
      id="social-discover"
      className="w-full bg-[#faf8f3] min-h-screen flex items-center justify-center py-24 px-8 md:px-12 lg:px-20 xl:px-32"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Large Quotation Marks */}
        <div className="mb-6 md:mb-8">
          <span className="text-7xl md:text-9xl lg:text-[12rem] text-gray-700 leading-none" style={{ fontWeight: 300 }}>
            "
          </span>
        </div>

        {/* Title inside quote */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-black mb-8 md:mb-10" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
          The Social Discover
        </h2>

        {/* Quote Text */}
        <blockquote className="text-2xl md:text-3xl lg:text-4xl text-gray-700 leading-relaxed mb-8 md:mb-12 px-4">
          A creator focused social platform where your work isn't buried by algorithms. Share your process, tell your story, and connect with collectors; all in one home built for artists, not content.
        </blockquote>

        {/* Attribution */}
        <div className="text-lg md:text-xl text-gray-600">
          <cite className="not-italic">Coming Spring, 2026</cite>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

