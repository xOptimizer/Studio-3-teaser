import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { pageGradientStyle } from '../loading/PageLoaders';

const BRAND_ACCENT = '#B8C5D6';

export default function PaymentProcessingOverlay({ active, amountLabel }) {
  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center p-4 sm:p-6"
      style={pageGradientStyle}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="payment-processing-title"
      aria-describedby="payment-processing-desc"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10 text-center"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-white/80">
          <svg
            className="h-8 w-8 animate-spin text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Please wait</p>
        <h2 id="payment-processing-title" className="text-black font-extrabold text-xl sm:text-2xl mt-2">
          Payment processing
        </h2>

        {amountLabel && (
          <p className="text-sm font-semibold text-gray-700 mt-2 tabular-nums">{amountLabel}</p>
        )}

        <p id="payment-processing-desc" className="text-gray-600 text-sm leading-relaxed mt-4 max-w-sm mx-auto">
          Your payment is being confirmed. Do not close this page, reload, or press back until you see your
          confirmation.
        </p>

        <div
          className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-gray-700"
          style={{ backgroundColor: 'rgba(184, 197, 214, 0.35)' }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: BRAND_ACCENT }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: BRAND_ACCENT }}
            />
          </span>
          Securing your tickets…
        </div>
      </div>
    </div>,
    document.body
  );
}
