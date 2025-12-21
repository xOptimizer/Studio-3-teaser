const MarketplaceSection = () => {
  return (
    <section
      id="marketplace"
      className="w-full min-h-screen flex flex-col"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(to bottom, #F7F7F7, #EDEDED)',
        scrollSnapAlign: 'start',
        paddingTop: '72px',
        paddingBottom: '112px',
        paddingLeft: '148px',
        paddingRight: '148px'
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
              fontSize: '24pt',
              lineHeight: '1.2',
              marginBottom: '24px'
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
              fontSize: '40pt',
              lineHeight: '1.3',
              marginBottom: '48px'
            }}
          >
            A curated creative supply marketplace offering the best prices with no hidden markups.
          </p>
        </div>

        {/* Feature List and Placeholder Row */}
        <div className="flex items-center" style={{ marginBottom: '48px' }}>
          {/* Left Column - Feature List */}
          <div className="flex-1 flex items-center" style={{ marginRight: '24px', minHeight: '650px' }}>
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
                <li className="flex flex-col" style={{ marginBottom: '24px' }}>
                  <span 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: '28pt',
                      color: '#000'
                    }}
                  >
                    Create with confidence
                  </span>
                  <div 
                    style={{
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#848597',
                      marginTop: '24px'
                    }}
                  />
                </li>
                <li className="flex flex-col" style={{ marginBottom: '24px' }}>
                  <span 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '28pt',
                      color: '#666',
                      marginLeft: '0px'
                    }}
                  >
                    Quality supplies, no markups
                  </span>
                  <div 
                    style={{
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#848597',
                      marginTop: '24px'
                    }}
                  />
                </li>
                <li className="flex flex-col">
                  <span 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '28pt',
                      color: '#666',
                      marginLeft: '0px'
                    }}
                  >
                    AI-Powered commerce
                  </span>
                </li>
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
              className="rounded-lg"
              style={{
                width: '712px',
                height: '650px',
                backgroundColor: '#D1D5DB',
                background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;

