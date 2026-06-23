import { useState, useRef, useEffect } from 'react';
import RegistrationModal from './RegistrationModal';
import LoginModal from './LoginModal';
import SocialLinks from './SocialLinks';
import { useAuth } from '../context/AuthContext';
import { resolveProfilePhotoUrl } from '../lib/api';

const navLinkClass =
  'text-xs sm:text-sm font-semibold transition-all duration-200 hover:opacity-80 whitespace-nowrap flex-shrink-0';

const pillButtonClass =
  'h-8 sm:h-9 px-3.5 sm:px-4 rounded-full text-black text-xs sm:text-sm font-medium transition-all duration-200 hover:opacity-80 whitespace-nowrap flex-shrink-0 flex items-center justify-center';

const pillButtonStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: '#B8C5D6',
  borderRadius: '9999px',
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

const getUserInitial = (user) => {
  const source = user?.name?.trim() || user?.email?.trim() || '';
  return source ? source.charAt(0).toUpperCase() : '?';
};

const TopBar = ({ onNavigate, currentPath }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const needsPasswordChange = user?.mustChangePassword && user?.role !== 'admin';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [currentPath, user]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    onNavigate?.('/');
  };

  const profilePhotoUrl = user ? resolveProfilePhotoUrl(user.profilePhotoUrl) : null;

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
          pointerEvents: 'auto',
        }}
      >
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

        <div className="flex flex-col items-end gap-1 sm:gap-1.5 min-w-0">
          <SocialLinks variant="navbar" />

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-end">
          <button
            onClick={() => onNavigate && onNavigate('/event')}
            className={navLinkClass}
            style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
          >
            Launch Event
          </button>

          {user && !needsPasswordChange && (
            <button
              onClick={() => onNavigate && onNavigate('/tickets')}
              className={navLinkClass}
              style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
            >
              My Tickets
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate && onNavigate('/admin')}
              className={navLinkClass}
              style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
            >
              Admin
            </button>
          )}

          {/* Join Launch List — temporarily hidden
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
          */}

          {user ? (
            <div className="relative flex-shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-black transition-all duration-200 hover:opacity-80 overflow-hidden"
                style={{
                  backgroundColor: profilePhotoUrl ? 'transparent' : '#B8C5D6',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
                }}
                aria-label="Account menu"
                aria-expanded={isUserMenuOpen}
              >
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  getUserInitial(user)
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl border border-white/60 bg-white/95 backdrop-blur py-1.5 shadow-lg"
                  style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)' }}
                >
                  {!needsPasswordChange && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate?.('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Profile
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className={pillButtonClass}
              style={pillButtonStyle}
            >
              Login
            </button>
          )}
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
};

export default TopBar;
