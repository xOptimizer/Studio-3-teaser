import { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to('.modal-overlay', { opacity: 1, duration: 0.3 });
      gsap.to('.modal-content', { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to('.modal-overlay', { opacity: 0, duration: 0.2 });
      gsap.to('.modal-content', { scale: 0.95, opacity: 0, duration: 0.2 });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile
        })
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', mobile: '' });
      
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="modal-overlay fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="modal-content relative z-10 bg-zinc rounded-3xl p-8 md:p-10 w-full max-w-md mx-4 transform scale-95 opacity-0 border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray hover:text-white transition-colors text-3xl leading-none w-8 h-8 flex-center"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-white">
            Pre-Register
          </h2>
          <p className="text-gray text-sm">
            Be the first to experience Studio 3
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all text-sm"
              placeholder="Full Name"
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
              className="w-full px-5 py-3 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all text-sm"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all text-sm"
              placeholder="Mobile Number"
            />
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
            className="w-full btn py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;

