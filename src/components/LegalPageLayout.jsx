const PAGE_BG = '#F7F7F7';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

function LegalPageLayout({ title, subtitle, children, onNavigate, fullWidth = false }) {
  return (
    <div
      className="min-h-screen text-gray-900"
      style={{ background: PAGE_BG, fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      <div
        className={`mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24 ${
          fullWidth ? 'max-w-7xl w-full' : 'max-w-3xl'
        }`}
      >
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </button>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 italic mt-2 text-sm sm:text-base">{subtitle}</p>
          )}
        </header>

        <div className={`${glassCardClass} p-6 sm:p-8 md:p-10 text-gray-900`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default LegalPageLayout;
