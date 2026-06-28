import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword, resolveProfilePhotoUrl } from '../lib/api';

const BRAND_ACCENT = '#B8C5D6';

const inputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.3)',
};

const primaryBtnStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

function getFirstName(user) {
  const name = user?.name?.trim();
  if (name) return name.split(/\s+/).filter(Boolean)[0];
  const email = user?.email?.trim();
  if (email) return email.split('@')[0];
  return 'there';
}

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

function LoginWelcomeSuccess({ user, onClose, onNavigate }) {
  const successRef = useRef(null);
  const isAdmin = user?.role === 'admin';
  const firstName = getFirstName(user);
  const photoUrl = resolveProfilePhotoUrl(user?.profilePhotoUrl);
  const initials = getUserInitials(user);

  const { headline, message, primaryLabel, primaryPath } = useMemo(() => {
    if (isAdmin) {
      return {
        headline: `Welcome back, ${firstName}`,
        message: 'Your dashboard is ready — manage orders, issue passes, and check in guests at the door.',
        primaryLabel: 'Open dashboard',
        primaryPath: '/admin',
      };
    }
    return {
      headline: `Good to see you, ${firstName}`,
      message: 'You’re signed in. View your tickets, download passes, or update your profile anytime.',
      primaryLabel: 'View my tickets',
      primaryPath: '/tickets',
    };
  }, [firstName, isAdmin]);

  useGSAP(() => {
    if (!successRef.current) return;

    gsap.fromTo(
      successRef.current.querySelector('.welcome-check'),
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }
    );
    gsap.fromTo(
      successRef.current.querySelectorAll('.welcome-animate'),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.12 }
    );
  }, []);

  const handlePrimary = () => {
    onClose();
    onNavigate?.(primaryPath);
  };

  return (
    <div ref={successRef} className="py-2">
      <div className="welcome-check mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/10">
        <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="welcome-animate text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold text-center">
        Signed in successfully
      </p>
      <h2
        className="welcome-animate text-black font-extrabold text-2xl mt-2 mb-3 text-center leading-tight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {headline}
      </h2>

      <div className="welcome-animate mx-auto mb-5 flex max-w-xs items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/50 px-3 py-2.5">
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-10 w-10 rounded-full object-cover shrink-0 bg-gray-100" />
        ) : (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-gray-800"
            style={{ backgroundColor: 'rgba(184, 197, 214, 0.55)' }}
          >
            {initials}
          </span>
        )}
        <div className="min-w-0 text-left">
          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name?.trim() || firstName}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      <p className="welcome-animate text-gray-600 text-sm mb-6 text-center leading-relaxed max-w-sm mx-auto">
        {message}
      </p>

      <div className="welcome-animate flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handlePrimary}
          className="w-full py-3 px-4 rounded-full text-black text-sm font-bold transition-all hover:opacity-90"
          style={primaryBtnStyle}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-full text-gray-700 text-sm font-semibold border border-gray-300 bg-white/70 hover:bg-white transition-all"
        >
          Continue browsing
        </button>
      </div>
    </div>
  );
}

const LoginModal = ({ isOpen, onClose, onNavigate }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const pointerDownOnOverlay = useRef(false);
  const { login } = useAuth();
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setView('login');
      setFormData({ email: '', password: '' });
      setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      setSubmitStatus(null);
      setLoggedInUser(null);
      setErrorMessage('');
      setInfoMessage('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useGSAP(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(contentRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(contentRef.current, { scale: 0.95, opacity: 0, duration: 0.2 });
    }
  }, [isOpen, view]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const loggedInUser = await login(formData.email, formData.password);
      if (loggedInUser?.mustChangePassword) {
        onClose();
        onNavigate?.('/set-password');
        return;
      }
      setLoggedInUser(loggedInUser);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      const data = await forgotPassword(resetData.email);
      setInfoMessage(data.message);
      setView('forgot-reset');
    } catch (err) {
      setErrorMessage(err.message || 'Could not send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (resetData.newPassword !== resetData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword(resetData.email, resetData.otp, resetData.newPassword);
      setView('login');
      setFormData({ email: resetData.email, password: '' });
      setInfoMessage('Password reset successfully. Log in with your new password.');
    } catch (err) {
      setErrorMessage(err.message || 'Could not reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayMouseDown = (e) => {
    pointerDownOnOverlay.current = e.target === overlayRef.current;
  };

  const handleOverlayClick = (e) => {
    if (e.target !== overlayRef.current || !pointerDownOnOverlay.current) return;
    const selection = window.getSelection?.();
    if (selection?.toString()) return;
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 opacity-0"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 0 100px rgba(255,255,255,0.1), 0 0 200px rgba(0,0,0,0.1)',
      }}
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[440px] rounded-3xl p-8 md:p-10 overflow-y-auto transform scale-95 opacity-0 border border-white border-opacity-20 shadow-2xl"
        onMouseDown={() => {
          pointerDownOnOverlay.current = false;
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        {submitStatus === 'success' && loggedInUser ? (
          <LoginWelcomeSuccess user={loggedInUser} onClose={onClose} onNavigate={onNavigate} />
        ) : view === 'forgot-email' ? (
          <div>
            <h2 className="text-black font-extrabold text-2xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Forgot password
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter your account email and we&apos;ll send a 6-digit verification code.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
                required
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={inputStyle}
                placeholder="name@example.com"
              />
              {errorMessage && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl text-red-600 text-xs text-center">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send code'}
              </button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full text-sm text-gray-500 hover:text-black"
              >
                Back to login
              </button>
            </form>
          </div>
        ) : view === 'forgot-reset' ? (
          <div>
            <h2 className="text-black font-extrabold text-2xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Reset password
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter the 6-digit code from your email and choose a new password.
            </p>
            {infoMessage && (
              <div className="mb-4 p-3 bg-emerald-500 bg-opacity-20 border border-emerald-500 rounded-2xl text-emerald-700 text-xs text-center">
                {infoMessage}
              </div>
            )}
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
                required
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={inputStyle}
                placeholder="Email"
              />
              <input
                type="text"
                name="otp"
                value={resetData.otp}
                onChange={handleResetChange}
                required
                pattern="\d{6}"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs tracking-widest"
                style={inputStyle}
                placeholder="6-digit code"
              />
              <input
                type="password"
                name="newPassword"
                value={resetData.newPassword}
                onChange={handleResetChange}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={inputStyle}
                placeholder="New password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={resetData.confirmPassword}
                onChange={handleResetChange}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={inputStyle}
                placeholder="Confirm new password"
              />
              {errorMessage && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl text-red-600 text-xs text-center">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </button>
              <button
                type="button"
                onClick={() => setView('forgot-email')}
                className="w-full text-sm text-gray-500 hover:text-black"
              >
                Resend code
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-black font-extrabold text-2xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Log In
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Use the email and password sent when you purchased your ticket.
            </p>
            {infoMessage && (
              <div className="mb-4 p-3 bg-emerald-500 bg-opacity-20 border border-emerald-500 rounded-2xl text-emerald-700 text-xs text-center">
                {infoMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-black text-xs font-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-black text-xs font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot-email');
                      setResetData((prev) => ({ ...prev, email: formData.email }));
                      setErrorMessage('');
                      setInfoMessage('');
                    }}
                    className="text-xs font-semibold hover:opacity-80"
                    style={{ color: '#7A8FA8' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl text-red-600 text-xs text-center">
                  {errorMessage || 'Authentication failed. Please try again.'}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'Verifying...' : 'Log In'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
