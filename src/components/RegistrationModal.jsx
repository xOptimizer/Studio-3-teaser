import { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    creativePractice: '',
    city: '',
    role: 'artist',
    ambassadorInfo: false
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
          phone: formData.phone,
          creativePractice: formData.creativePractice,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="modal-overlay fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="modal-content relative z-10 bg-zinc rounded-3xl p-8 md:p-10 lg:p-12 w-full max-w-4xl mx-4 transform scale-95 opacity-0 border border-gray-300 shadow-2xl overflow-y-auto md:overflow-visible md:max-h-none" style={{ maxHeight: '90vh' }}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray hover:text-white transition-colors text-3xl leading-none w-8 h-8 flex-center"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            Join the Launch List
          </h2>
          <p className="text-gray text-sm">
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
              className="w-full px-4 py-2.5 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-xs"
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
              className="w-full px-4 py-2.5 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-xs"
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
              className="w-full px-4 py-2.5 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-xs"
              placeholder="Phone Number"
            />
          </div>

          <div className="space-y-2">
            <p className="text-white text-xs font-medium">Are you an artist, collector, or both?</p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={formData.role === 'artist'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-300 bg-gray-300 border-gray-300 focus:ring-gray-300 focus:ring-2"
                />
                <span className="ml-2 text-gray text-xs">Artist</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="collector"
                  checked={formData.role === 'collector'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-300 bg-gray-300 border-gray-300 focus:ring-gray-300 focus:ring-2"
                />
                <span className="ml-2 text-gray text-xs">Collector</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="both"
                  checked={formData.role === 'both'}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-gray-300 bg-gray-300 border-gray-300 focus:ring-gray-300 focus:ring-2"
                />
                <span className="ml-2 text-gray text-xs">Both</span>
              </label>
            </div>
          </div>

          <div>
            <input
              type="text"
              id="creativePractice"
              name="creativePractice"
              value={formData.creativePractice}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-xs"
              placeholder="How would you describe your creative practice? (i.e. painting, design, pottery, etc.)"
            />
          </div>

          <div>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-300 backdrop-blur rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-xs"
              placeholder="What city are you based in?"
            />
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-gray text-xs leading-relaxed">
              Studio 3 is selecting 50 creators across the U.S. and 50 creators in Dallas, Tx to be part of our exclusive Ambassador Program.
            </p>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="ambassadorInfo"
                checked={formData.ambassadorInfo}
                onChange={handleChange}
                className="mt-0.5 w-3.5 h-3.5 text-gray-300 bg-gray-300 border-gray-300 rounded focus:ring-gray-300 focus:ring-2"
              />
              <span className="ml-2 text-gray text-xs">Click here to receive more information.</span>
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
            className="w-full bg-white text-black py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;

