import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RegistrationModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    creativePractice: '',
    collectorInterests: '',
    enthusiastInterests: [],
    city: '',
    role: 'artist',
    ambassadorInfo: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  // Clear conditional fields when role changes
  useEffect(() => {
    if (formData.role !== 'artist' && formData.role !== 'both') {
      setFormData(prev => ({ ...prev, creativePractice: '' }));
    }
    if (formData.role !== 'collector' && formData.role !== 'both') {
      setFormData(prev => ({ ...prev, collectorInterests: '' }));
    }
    if (formData.role !== 'enthusiast') {
      setFormData(prev => ({ ...prev, enthusiastInterests: [] }));
    }
  }, [formData.role]);

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
    const { name, value, type, checked } = e.target;
    
    if (name === 'enthusiastInterest') {
      // Handle enthusiast interests as an array
      setFormData(prev => ({
        ...prev,
        enthusiastInterests: checked
          ? [...prev.enthusiastInterests, value]
          : prev.enthusiastInterests.filter(item => item !== value)
      }));
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate enthusiast interests
    if (formData.role === 'enthusiast' && formData.enthusiastInterests.length === 0) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymzzAV-kE29HFAEMJMn6sLLfEqDJRHvaRgfskvP56MhlW3qi416XrGGpNjBxkNVGO7iQ/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          creativePractice: formData.creativePractice,
          collectorInterests: formData.collectorInterests,
          enthusiastInterests: formData.enthusiastInterests,
          city: formData.city,
          role: formData.role,
          ambassadorInfo: formData.ambassadorInfo
        })
      });

      setSubmitStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        creativePractice: '', 
        collectorInterests: '',
        enthusiastInterests: [],
        city: '', 
        role: 'artist',
        ambassadorInfo: false
      });
      
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md"
        onClick={onClose}
        style={{ 
          opacity: 0,
          boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative z-10 rounded-3xl p-8 md:p-10 lg:p-12 w-full transform scale-95 opacity-0 border border-white border-opacity-20 shadow-2xl overflow-y-auto"
        style={{ 
          maxHeight: '90vh',
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex-center"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black">
            Join the Launch List
          </h2>
          <p className="text-gray-600 text-sm">
            Be the first to experience Studio 3 as we launch in 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.3)'
              }}
              placeholder="Name"
            />
          </div>

          <div>
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
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.3)'
              }}
              placeholder="Phone Number"
            />
          </div>

          <div className="space-y-2">
            <p className="text-black text-xs font-medium">Are you an artist, collector, enthusiast, or both?</p>
            <div className="flex flex-wrap gap-3 sm:flex-nowrap sm:gap-4">
              <label className="flex items-center cursor-pointer whitespace-nowrap">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={formData.role === 'artist'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 focus:ring-gray-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600 text-xs">Artist</span>
              </label>
              <label className="flex items-center cursor-pointer whitespace-nowrap">
                <input
                  type="radio"
                  name="role"
                  value="collector"
                  checked={formData.role === 'collector'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 focus:ring-gray-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600 text-xs">Collector</span>
              </label>
              <label className="flex items-center cursor-pointer whitespace-nowrap">
                <input
                  type="radio"
                  name="role"
                  value="enthusiast"
                  checked={formData.role === 'enthusiast'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 focus:ring-gray-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600 text-xs">Enthusiast / Supporter</span>
              </label>
              <label className="flex items-center cursor-pointer whitespace-nowrap">
                <input
                  type="radio"
                  name="role"
                  value="both"
                  checked={formData.role === 'both'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 focus:ring-gray-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600 text-xs">Both (Artist & Collector)</span>
              </label>
            </div>
          </div>

          {/* Conditional: Show creative practice if Artist OR Both */}
          {(formData.role === 'artist' || formData.role === 'both') && (
            <div>
              <input
                type="text"
                id="creativePractice"
                name="creativePractice"
                value={formData.creativePractice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.3)'
                }}
                placeholder="How would you describe your creative practice? (e.g. painting, sculpture, photography, fashion design, pottery, mixed media, etc.)"
              />
            </div>
          )}

          {/* Conditional: Show collector interests if Collector OR Both */}
          {(formData.role === 'collector' || formData.role === 'both') && (
            <div>
              <input
                type="text"
                id="collectorInterests"
                name="collectorInterests"
                value={formData.collectorInterests}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.3)'
                }}
                placeholder="What types of work are you most interested in collecting? (i.e. Painting, Sculpture, Photography, etc.)"
              />
            </div>
          )}

          {/* Conditional: Show enthusiast interests if Enthusiast */}
          {formData.role === 'enthusiast' && (
            <div className="space-y-2">
              <p className="text-black text-xs font-medium">What draws you most to art?</p>
              <div className="space-y-2">
                {[
                  'Discovering new artists',
                  'Learning about creative process',
                  'Finding inspiration',
                  'Supporting independent creators',
                  'Exploring culture & visual storytelling'
                ].map((interest) => (
                  <label key={interest} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="enthusiastInterest"
                      value={interest}
                      checked={formData.enthusiastInterests.includes(interest)}
                      onChange={handleChange}
                      className="mt-0.5 w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 rounded focus:ring-gray-500 focus:ring-2"
                    />
                    <span className="ml-2 text-gray-600 text-xs">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.3)'
              }}
              placeholder="What city are you based in?"
            />
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-gray-600 text-xs leading-relaxed">
              Studio 3 is selecting 50 creators across the U.S. and 50 creators in Dallas, Tx to be part of our exclusive Ambassador Program.
            </p>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="ambassadorInfo"
                checked={formData.ambassadorInfo}
                onChange={handleChange}
                className="mt-0.5 w-3.5 h-3.5 text-gray-600 bg-gray-200 border-gray-400 rounded focus:ring-gray-500 focus:ring-2"
              />
              <span className="ml-2 text-gray-600 text-xs">Click here to receive more information.</span>
            </label>
          </div>

          {submitStatus === 'success' && (
            <div className="p-4 bg-blue bg-opacity-20 border border-blue rounded-2xl text-blue text-sm text-center">
              Registration successful!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <style>{`
        input::placeholder {
          color: #000000 !important;
          opacity: 0.6;
        }
        input:focus {
          border-color: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default RegistrationModal;

