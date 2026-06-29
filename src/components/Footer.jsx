import SocialLinks from './SocialLinks';
import { SUPPORT_EMAIL } from '../constants/support';

const footerLinkClass =
  'text-black text-sm font-semibold hover:opacity-70 transition-opacity text-left py-1.5 md:py-0 w-full md:w-auto flex items-center justify-start';

const Footer = ({ onNavigate }) => (
  <footer
    className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-36 pt-8 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-[calc(2rem+env(safe-area-inset-bottom))] md:pt-8"
    style={{
      backgroundColor: '#D4D4D4',
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:flex md:flex-row md:justify-between md:items-start md:gap-10">
        <div className="flex flex-col items-start gap-3 md:gap-4 md:max-w-sm">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="hover:opacity-75 transition-opacity"
            aria-label="Studio 3 home"
          >
            <img
              src="/assets/Logo_With_Text.svg"
              alt="Studio 3"
              className="h-16 w-auto max-w-full sm:h-18 md:h-20"
            />
          </button>

          <SocialLinks variant="footer" showLabels className="items-start" />

          <p className="hidden md:block text-black text-sm font-semibold">
            © 2026 Studio 3. All rights reserved.
          </p>
        </div>

        <nav
          className="flex flex-col items-start gap-0.5 md:flex-row md:flex-wrap md:justify-end md:gap-x-8 md:gap-y-2"
          aria-label="Footer navigation"
        >
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/event')}
            className={footerLinkClass}
          >
            Events
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/privacy')}
            className={footerLinkClass}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/terms')}
            className={footerLinkClass}
          >
            Terms
          </button>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={footerLinkClass}>
            Support
          </a>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/contact')}
            className={footerLinkClass}
          >
            Contact
          </button>
        </nav>
      </div>

      <p className="md:hidden text-black text-xs sm:text-sm font-semibold text-center w-full mt-6 pt-4 border-t border-black/10">
        © 2026 Studio 3. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
