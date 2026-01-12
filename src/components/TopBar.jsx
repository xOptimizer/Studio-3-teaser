import { useState } from 'react';
import RegistrationModal from './RegistrationModal';

// top bar
const TopBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-4 lg:px-4" 
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <div 
        className="flex items-center justify-between w-full max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Menu Icon + Studio 3 */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Circular Menu Icon */}
          <button 
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 flex-shrink-0"
            aria-label="Menu"
          >
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black"></div>
            </div>
          </button>
          
          {/* Studio 3 Text */}
          <h1 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black whitespace-nowrap"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            studio 3
          </h1>
        </div>

        {/* Right: Join Launch List Button */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
          {/* Join Launch List Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-full text-black text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-200 hover:opacity-80 whitespace-nowrap flex-shrink-0"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              backgroundColor: '#B8C5D6',
              borderRadius: '9999px',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <span className="hidden sm:inline">Join Launch List</span>
            <span className="sm:hidden">Join</span>
          </button>
        </div>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </header>
  );
};

export default TopBar;
