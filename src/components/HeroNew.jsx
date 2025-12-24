const HeroNew = () => {
  return (
    <section
      id="about"
      className="w-full min-h-screen flex flex-col items-center justify-center px-8 md:px-12 lg:px-20 xl:px-32 relative"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(to bottom, #F7F7F7, #EDEDED)',
        scrollSnapAlign: 'start',
        paddingTop: '0',
        paddingBottom: '112px'
      }}
    >
      <div className="w-full max-w-7xl flex flex-col items-center text-center">
        {/* Primary Heading - studio 3 with 96px top spacing */}
        <h1
          className="text-black"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '200pt',
            lineHeight: '1.1',
            paddingTop: '96px',
            margin: 0,
            marginBottom: '40px',
            display: 'block'
          }}
        >
          studio 3
        </h1>

        {/* Secondary Heading - 40px spacing from primary and placeholder */}
        <h2
          className="text-black"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '48pt',
            lineHeight: '1.2',
            marginTop: 0,
            marginBottom: '40px',
            display: 'block'
          }}
        >
          A Connected Ecosystem<br />Built for Creatives
        </h2>

        {/* Placeholder Element - 40px spacing from secondary heading, 112px bottom spacing */}
        <div 
          className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"
          style={{
            marginTop: 0,
            marginBottom: '112px',
            width: '660px',
            height: '226px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'block'
          }}
        >
          {/* This will be replaced with video/image content */}
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            Placeholder
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
