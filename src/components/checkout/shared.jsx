import React, { useEffect, useRef, memo } from 'react';
import { STUDIO_EVENT_DISPLAY, STUDIO_EVENT } from '../../constants/event';

export const TICKET_PRICE = STUDIO_EVENT.ticketPrice;
export const BRAND_ACCENT = '#B8C5D6';
export const BRAND_ACCENT_SOFT = 'rgba(184, 197, 214, 0.35)';
export const BRAND_ACCENT_MUTED = '#7A8FA8';
export const FINIX_FORM_ID = 'finix-payment-form';

export const EVENT_CHECKOUT = {
  ...STUDIO_EVENT_DISPLAY,
};

export const CHECKOUT_STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Tickets' },
  { id: 3, label: 'Payment' },
];

export const checkoutButtonClass =
  'w-full py-4 px-6 rounded-full text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] hover:opacity-90 disabled:opacity-50';

export const checkoutButtonStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

export const glassCardClass =
  'bg-white bg-opacity-60 border border-white rounded-3xl backdrop-blur shadow-sm';

export const CheckoutStepIndicator = ({ currentStep, compact = false }) => (
  <div className={`flex items-center justify-between gap-1.5 sm:gap-2 ${compact ? 'mb-3' : 'mb-8'}`}>
    {CHECKOUT_STEPS.map((step, index) => {
      const isComplete = currentStep > step.id;
      const isActive = currentStep === step.id;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div
              className={`rounded-full flex items-center justify-center font-bold transition-colors ${
                compact ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 sm:w-9 sm:h-9 text-xs'
              }`}
              style={{
                backgroundColor: isComplete || isActive ? BRAND_ACCENT : '#f3f4f6',
                color: isComplete || isActive ? '#000000' : '#9ca3af',
              }}
            >
              {isComplete ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`font-semibold truncate w-full text-center ${
                compact ? 'text-[9px] mt-1' : 'text-[10px] sm:text-xs mt-1.5'
              }`}
              style={{ color: isActive ? '#000000' : '#9ca3af' }}
            >
              {step.label}
            </span>
          </div>
          {index < CHECKOUT_STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 rounded-full transition-colors ${compact ? 'mb-4' : 'mb-5'}`}
              style={{ backgroundColor: currentStep > step.id ? BRAND_ACCENT : '#e5e7eb' }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export const FinixPaymentForm = memo(({ onPaymentSubmit, onConfigError }) => {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return undefined;

    const appId = import.meta.env.VITE_FINIX_APPLICATION_ID;
    const merchantId = import.meta.env.VITE_FINIX_MERCHANT_ID;
    const finixEnv = import.meta.env.VITE_FINIX_ENV || 'sandbox';

    if (!window.Finix || !appId) {
      onConfigError('Payment form is not configured. Set VITE_FINIX_APPLICATION_ID.');
      return undefined;
    }

    initializedRef.current = true;

    let finixAuth;
    if (merchantId) {
      try {
        finixAuth = window.Finix.Auth(finixEnv, merchantId);
      } catch (err) {
        console.error('[Finix.Auth]', err);
      }
    }

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      window.Finix.PaymentForm(FINIX_FORM_ID, finixEnv, appId, {
        showAddress: false,
        onSubmit: (error, response) => onPaymentSubmit(error, response, finixAuth),
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      initializedRef.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onPaymentSubmit, onConfigError]);

  return (
    <div
      ref={containerRef}
      id={FINIX_FORM_ID}
      className="min-h-[130px] rounded-xl border border-gray-200 bg-white p-2"
    />
  );
});

FinixPaymentForm.displayName = 'FinixPaymentForm';
