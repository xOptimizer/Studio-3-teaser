import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ContactModal = ({ isOpen, onClose }) => {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
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
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                message: ''
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
                        Contact Us
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Have questions or interested in partnering? Send us a message.
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
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-xs resize-none"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 0, 0, 0.3)'
                            }}
                            placeholder="Your Message"
                        />
                    </div>

                    {submitStatus === 'success' && (
                        <div className="p-4 bg-blue bg-opacity-20 border border-blue rounded-2xl text-blue text-sm text-center">
                            Message sent successfully!
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
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
            <style>{`
        input::placeholder, textarea::placeholder {
          color: #000000 !important;
          opacity: 0.6;
        }
        input:focus, textarea:focus {
          border-color: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
        </div>,
        document.body
    );
};

export default ContactModal;
