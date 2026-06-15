import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LoginModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate authentication
    setTimeout(() => {
      setIsSubmitting(false);
      if (formData.email && formData.password) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    }, 1200);
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
        boxShadow: 'inset 0 0 100px rgba(255,255,255,0.1), 0 0 200px rgba(0,0,0,0.1)'
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[440px] rounded-3xl p-8 md:p-10 overflow-y-auto transform scale-95 opacity-0 border border-white border-opacity-20 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <span className="text-5xl mb-4 block">👋</span>
            <h2 className="text-black font-extrabold text-xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Welcome back!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You have successfully logged in to the Studio 3 platform.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-black font-extrabold text-2xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Log In
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter your credentials to access your account.
            </p>

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
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.3)'
                  }}
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-black text-xs font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.3)'
                  }}
                  placeholder="••••••••"
                />
              </div>

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl text-red-600 text-xs text-center">
                  Authentication failed. Please try again.
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
