import { useState } from 'react';
import RegistrationModal from './RegistrationModal';
import LoginModal from './LoginModal';

// top bar
const TopBar = ({ onNavigate, currentPath }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4"
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <div
        className="flex items-center justify-between gap-2 sm:gap-4 w-full max-w-7xl mx-auto rounded-2xl px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 min-h-[3.25rem] sm:min-h-[3.5rem]"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Studio 3 Logo */}
        <div
          onClick={() => onNavigate && onNavigate('/')}
          className="flex items-center flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
        >
          <img
            src="/assets/Logo_Without_Text.svg"
            alt="Studio 3"
            className="h-10 w-10 sm:hidden"
          />
          <img
            src="/assets/Logo_With_Text.svg"
            alt="Studio 3"
            className="hidden sm:block h-12 md:h-[3.25rem] w-auto"
          />
        </div>

        {/* Right: Navigation options & Join Launch List Button */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
          {/* Events Link */}
          <button
            onClick={() => onNavigate && onNavigate('/event')}
            className="text-xs sm:text-sm font-semibold transition-all duration-200 hover:opacity-80 whitespace-nowrap flex-shrink-0"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#000000'
            }}
          >
            Events
          </button>

          {/* Join Launch List Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-5 rounded-full text-black text-sm font-medium transition-all duration-200 hover:opacity-80 whitespace-nowrap flex-shrink-0 flex items-center justify-center"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              backgroundColor: '#B8C5D6',
              borderRadius: '9999px',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <span className="hidden min-[400px]:inline">Join Launch List</span>
            <span className="min-[400px]:hidden">Join</span>
          </button>

          {/* Profile Icon for Login */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="h-11 w-11 rounded-full text-black transition-all duration-200 hover:opacity-80 flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: '#B8C5D6',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
            }}
            aria-label="Profile Login"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  );
};

export default TopBar;
