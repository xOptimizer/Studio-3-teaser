import SocialLinks from './SocialLinks';

const Footer = ({ onNavigate }) => (
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
      <SocialLinks variant="footer" showLabels />
      <div className="text-black text-sm font-semibold">
        © 2026 Studio 3. All rights reserved.
      </div>
    </div>

    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      <button
        onClick={() => onNavigate && onNavigate('/event')}
        className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
      >
        Events
      </button>
      <button
        onClick={() => onNavigate && onNavigate('/privacy')}
        className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
      >
        Privacy Policy
      </button>
      <button
        onClick={() => onNavigate && onNavigate('/terms')}
        className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
      >
        Terms
      </button>
      <button
        onClick={() => onNavigate && onNavigate('/contact')}
        className="text-black text-sm font-semibold hover:opacity-70 transition-opacity"
      >
        Contact
      </button>
    </div>
  </footer>
);

export default Footer;
