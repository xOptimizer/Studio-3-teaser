import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-black">Privacy Policy</h2>
                    <p className="text-gray-500 italic mb-8">Last updated: [January 18, 2026]</p>

                    <div className="space-y-6 text-[#1A1A1A] text-sm md:text-base leading-relaxed">
                        <p className="mb-6">
                            Studio 3 respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you visit our website and sign up to receive updates about our launch.
                        </p>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Information We Collect</h3>
                            <p className="mb-2">We collect limited personal information, including:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-2">
                                <li>Your email address, if you choose to sign up for launch updates</li>
                            </ul>
                            <p>We do not collect payment information or require account creation on this website.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">How We Use Your Information</h3>
                            <p className="mb-2">We use your information to:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-2">
                                <li>Notify you about the launch of Studio 3</li>
                                <li>Share occasional updates related to our products, studio, or platform</li>
                            </ul>
                            <p>You may unsubscribe from these communications at any time.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">How We Share Information</h3>
                            <p className="mb-2">We do not sell or rent your personal information.</p>
                            <p>We may share information with trusted service providers (such as email delivery services) solely to help us operate this website and communicate with you.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Data Security</h3>
                            <p>We take reasonable measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Cookies & Analytics</h3>
                            <p>This website may use basic analytics tools to understand site traffic and usage. These tools may collect anonymized information such as browser type or device information.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Your Choices</h3>
                            <p>You may unsubscribe from our emails at any time by following the instructions in any message we send.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Updates to This Policy</h3>
                            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>
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

export default PrivacyPolicyModal;
