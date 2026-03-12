import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const inputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.3)'
};

const PartnerModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    storeName: '',
    cityLocation: '',
    websiteOrInstagram: '',
    contactName: '',
    email: '',
    brandsOrMaterials: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmitStatus(null);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Partner form → dedicated Google Sheet (separate from Registration)
      const GOOGLE_SCRIPT_URL_PARTNER = 'https://script.google.com/macros/s/AKfycbwF-33EOQOAaZwgRMBMGPNuhP3CQ2L2kvaJBd4PY0ff9DoD4UmaubnJAkNc9kQruA/exec';

      await fetch(GOOGLE_SCRIPT_URL_PARTNER, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: formData.storeName,
          cityLocation: formData.cityLocation,
          websiteOrInstagram: formData.websiteOrInstagram,
          contactName: formData.contactName,
          email: formData.email,
          brandsOrMaterials: formData.brandsOrMaterials
        })
      });

      setSubmitStatus('success');
      setFormData({
        storeName: '',
        cityLocation: '',
        websiteOrInstagram: '',
        contactName: '',
        email: '',
        brandsOrMaterials: ''
      });

      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting partner form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md"
        onClick={onClose}
        style={{
          opacity: 0,
          boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)'
        }}
      />

      <div
        ref={contentRef}
        className="relative z-10 rounded-3xl p-8 md:p-10 lg:p-12 w-full transform scale-95 opacity-0 overflow-y-auto"
        style={{
          maxHeight: '90vh',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black">
            Partner With Studio 3
          </h2>
          <p className="text-gray-600 text-sm">
            Studio 3 partners with independent art supply stores to power the marketplace. Tell us a little about your store and we'll reach out with next steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="Store Name"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="cityLocation"
                  name="cityLocation"
                  value={formData.cityLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="City/Location"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="websiteOrInstagram"
                  name="websiteOrInstagram"
                  value={formData.websiteOrInstagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="Website or Instagram"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs"
                  style={inputStyle}
                  placeholder="Contact Name"
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
                  style={inputStyle}
                  placeholder="Email Address"
                />
              </div>

              <div>
                <textarea
                  id="brandsOrMaterials"
                  name="brandsOrMaterials"
                  value={formData.brandsOrMaterials}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs resize-y min-h-[100px]"
                  style={inputStyle}
                  placeholder="What brands or materials do you carry?"
                />
              </div>

          {submitStatus === 'success' && (
            <div className="p-4 bg-blue bg-opacity-20 border border-blue rounded-2xl text-blue text-sm text-center">
              Thanks! We'll be in touch soon.
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
            className="w-full bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <style>{`
        input::placeholder,
        textarea::placeholder {
          color: #000000 !important;
          opacity: 0.6;
        }
        input:focus,
        textarea:focus {
          border-color: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default PartnerModal;
