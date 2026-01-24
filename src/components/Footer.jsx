import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsModal from './TermsModal';
import ContactModal from './ContactModal';

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer
        className="w-full flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36 py-8"
        style={{
          backgroundColor: '#D4D4D4',
          fontFamily: "'Inter', sans-serif",
          scrollSnapAlign: 'start'
        }}
      >
        <div className="text-black text-sm font-semibold mb-4 md:mb-0">
          © 2026 Studio 3. All rights reserved.
        </div>

        <div className="flex gap-8">
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
