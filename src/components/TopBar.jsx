import { useState, useRef, useEffect } from 'react';
import RegistrationModal from './RegistrationModal';
import LoginModal from './LoginModal';
import SocialLinks from './SocialLinks';
import { useAuth } from '../context/AuthContext';
import { resolveProfilePhotoUrl } from '../lib/api';

const BRAND_ACCENT = '#B8C5D6';

const pillButtonClass =
  'h-8 sm:h-9 px-3.5 sm:px-4 rounded-full text-black text-xs sm:text-sm font-medium transition-all duration-200 hover:opacity-90 whitespace-nowrap flex-shrink-0 flex items-center justify-center';

const pillButtonStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  borderRadius: '9999px',
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

function getUserInitials(user) {
  const name = user?.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  const email = user?.email?.trim();
  return email ? email.charAt(0).toUpperCase() : '?';
}

function getFirstName(user) {
  const name = user?.name?.trim();
  if (name) {
    return name.split(/\s+/).filter(Boolean)[0];
  }
  const email = user?.email?.trim();
  if (email) return email.split('@')[0];
  return 'Account';
}

function isNavActive(currentPath, path) {
  if (!currentPath || !path) return false;
  if (path === '/') return currentPath === '/';
  return currentPath === path || currentPath.startsWith(`${path}/`);
}

function NavLink({ path, label, currentPath, onNavigate }) {
  const active = isNavActive(currentPath, path);

  return (
    <button
      type="button"
      onClick={() => onNavigate?.(path)}
      className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
        active
          ? 'text-gray-900 bg-white shadow-sm ring-1 ring-black/5'
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </button>
  );
}

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
  const displayName = user ? getFirstName(user) : 'Account';
  const fullName = user?.name?.trim() || user?.email || 'Account';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4"
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <div
        className="flex items-center justify-between gap-2 sm:gap-4 w-full max-w-7xl mx-auto rounded-2xl px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 min-h-[3.25rem] sm:min-h-[3.5rem]"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/')}
          className="flex items-center flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity duration-200"
          aria-label="Studio 3 home"
        >
          <img
            src="/assets/S3_Horizontal.png"
            alt="Studio 3"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap justify-end min-w-0">
          <NavLink path="/event" label="Launch Event" currentPath={currentPath} onNavigate={onNavigate} />

          {user && !needsPasswordChange && (
            <NavLink path="/tickets" label="My Tickets" currentPath={currentPath} onNavigate={onNavigate} />
          )}

          <SocialLinks variant="header" />

          {user ? (
            <div className="relative flex-shrink-0 ml-0.5 sm:ml-1" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 pl-1 pr-2.5 sm:pr-3 py-1 rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-black/15 border bg-white/60 backdrop-blur-sm ${
                  isUserMenuOpen
                    ? 'border-gray-300/90 bg-white/90 shadow-sm'
                    : 'border-gray-200/80 hover:border-gray-300/90 hover:bg-white/80 hover:shadow-sm'
                }`}
                style={{ boxShadow: isUserMenuOpen ? '0 2px 8px rgba(0,0,0,0.06)' : undefined }}
                aria-label="Account menu"
                aria-expanded={isUserMenuOpen}
              >
                <span
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-gray-900 overflow-hidden shrink-0 ring-1 ring-black/5"
                  style={{
                    backgroundColor: profilePhotoUrl ? 'transparent' : BRAND_ACCENT,
                  }}
                >
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover border-0" />
                  ) : (
                    getUserInitials(user)
                  )}
                </span>
                <span
                  className="hidden md:inline max-w-[140px] truncate text-sm font-semibold text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {displayName}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`absolute right-0 top-full mt-2 min-w-[180px] origin-top-right transition-all duration-200 ease-out ${
                  isUserMenuOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                }`}
              >
                <div
                  className="rounded-2xl border border-white/70 bg-white/95 backdrop-blur-xl py-1.5 overflow-hidden"
                  style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
                >
                  <div className="px-4 py-2.5 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {!needsPasswordChange && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate?.('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Profile
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate?.('/admin');
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        isNavActive(currentPath, '/admin')
                          ? 'text-gray-900 bg-gray-50 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Log out
                  </button>
                </div>
              </div>
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

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
};

export default TopBar;
