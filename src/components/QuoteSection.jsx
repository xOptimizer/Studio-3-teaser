import { useState } from 'react';

const QuoteSection = () => {
  const [activeTab, setActiveTab] = useState('artists');

  return (
    <section
      id="social-discover"
      className="w-full min-h-screen flex flex-col"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        background: 'linear-gradient(to bottom, #F7F7F7, #EDEDED)',
        scrollSnapAlign: 'start',
        paddingTop: '72px',
        paddingBottom: '44px',
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
            The Social Discover
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
            A creator focused social platform where your work isn't buried by algorithms.
          </p>
        </div>

        {/* Three Columns with Images */}
        <div className="flex justify-center">
          {/* First Column - Artists */}
          <div className="flex flex-col items-center" style={{ marginRight: '48px' }}>
            <h3 
              className="text-black"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '24pt',
                color: '#000',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '16px',
                width: '380px',
                textAlign: 'center'
              }}
            >
              Artists
            </h3>
            <div 
              className="rounded-lg overflow-hidden flex-shrink-0"
              style={{
                width: '380px',
                height: '580px',
                backgroundColor: '#D1D5DB',
                background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
              }}
            >
              {/* Placeholder - Replace with <img> when ready */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Image Placeholder</span>
              </div>
            </div>
          </div>

          {/* Second Column - Buyers & Collectors */}
          <div className="flex flex-col items-center" style={{ marginRight: '48px' }}>
            <h3 
              className="text-black"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '24pt',
                color: '#000',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '16px',
                width: '380px',
                textAlign: 'center'
              }}
            >
              Buyers & Collectors
            </h3>
            <div 
              className="rounded-lg overflow-hidden flex-shrink-0"
              style={{
                width: '380px',
                height: '580px',
                backgroundColor: '#D1D5DB',
                background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
              }}
            >
              {/* Placeholder - Replace with <img> when ready */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Image Placeholder</span>
              </div>
            </div>
          </div>

          {/* Third Column - Enthusiasts */}
          <div className="flex flex-col items-center">
            <h3 
              className="text-black"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '24pt',
                color: '#000',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '16px',
                width: '380px',
                textAlign: 'center'
              }}
            >
              Enthusiasts
            </h3>
            <div 
              className="rounded-lg overflow-hidden flex-shrink-0"
              style={{
                width: '380px',
                height: '580px',
                backgroundColor: '#D1D5DB',
                background: 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
              }}
            >
              {/* Placeholder - Replace with <img> when ready */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

