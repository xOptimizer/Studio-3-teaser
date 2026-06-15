import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsModal from './TermsModal';
import ContactModal from './ContactModal';

const Footer = ({ onNavigate }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer
        className="w-full flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36 md:py-8"
        style={{
          backgroundColor: '#D4D4D4',
          fontFamily: "'Inter', sans-serif",
          paddingTop: '2rem',
          paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex flex-col items-center md:items-start gap-3 mb-4 md:mb-0">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="hover:opacity-75 transition-opacity"
            aria-label="Studio 3 home"
          >
            <img
              src="/assets/Logo_Without_Text.svg"
              alt="Studio 3"
              className="h-10 w-10 sm:hidden"
            />
            <img
              src="/assets/Logo_With_Text.svg"
              alt="Studio 3"
              className="hidden sm:block h-12 w-auto"
            />
          </button>
          <div className="text-black text-sm font-semibold">
            © 2026 Studio 3. All rights reserved.
          </div>
        </div>

        <div className="flex gap-8">
          <button
            onClick={() => onNavigate && onNavigate('/event')}
            className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            Events
          </button>
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            Terms
          </button>
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            Contact
          </button>
        </div>
      </footer>

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};

export default Footer;
