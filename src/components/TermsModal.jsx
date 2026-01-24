import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const TermsModal = ({ isOpen, onClose }) => {
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

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-md transition-opacity"
                style={{
                    boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)'
                }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full rounded-2xl border border-white border-opacity-20 shadow-2xl overflow-y-auto animate-fadeIn"
                style={{
                    maxWidth: '90vw',
                    width: '90vw',
                    maxHeight: '90vh',
                    minHeight: '85vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
                }}
            >
                <div className="p-8 md:p-10 lg:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-black">Terms of Service</h2>
                    <p className="text-gray-500 italic mb-8">Last updated: [January 18, 2026]</p>

                    <div className="space-y-6 text-[#1A1A1A] text-sm md:text-base leading-relaxed">
                        <p className="mb-6">
                            These Terms of Use govern your access to and use of the Studio 3 website. By using this site, you agree to these terms.
                        </p>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Informational Purpose Only</h3>
                            <p className="mb-2">This website is provided for informational purposes only. Studio 3 is a forthcoming platform and physical studio. Features, timelines, and offerings described on this site are subject to change and do not constitute a binding offer.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Email Signups</h3>
                            <p className="mb-2">By submitting your email address, you agree to receive updates related to the Studio 3 launch. You can unsubscribe at any time.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Intellectual Property</h3>
                            <p className="mb-2">All content on this website, including text, images, logos, and design elements, is owned by or licensed to Studio 3 and may not be used without permission.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">No Warranties</h3>
                            <p className="mb-2">This website is provided “as is.” We make no guarantees regarding availability, accuracy, or completeness of the information presented.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Limitation of Liability</h3>
                            <p className="mb-2">To the fullest extent permitted by law, Studio 3 shall not be liable for any damages arising from your use of this website.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Third-Party Services</h3>
                            <p className="mb-2">This website may rely on third party tools or services. We are not responsible for the content or practices of those third parties.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Changes to These Terms</h3>
                            <p>We may update these Terms of Use at any time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Governing Law</h3>
                            <p>These terms are governed by the laws of the State of Texas, without regard to conflict of law principles.</p>
                        </div>
                    </div>
                </div>

                {/* Close Button styling matching typical modal patterns */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                    style={{ fontSize: '24px', opacity: 0.6 }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L13 13M1 13L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default TermsModal;
