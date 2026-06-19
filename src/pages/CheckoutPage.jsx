import { useState, useEffect, useRef, useCallback } from 'react';
import { checkout } from '../lib/api';
import {
  TICKET_PRICE,
  BRAND_ACCENT_SOFT,
  EVENT_CHECKOUT,
  CheckoutStepIndicator,
  FinixPaymentForm,
  checkoutButtonClass,
  checkoutButtonStyle,
  glassCardClass,
} from '../components/checkout/shared';

import { formatUSPhone, toE164US } from '../lib/phone';

const CheckoutPage = ({ onNavigate }) => {
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', email: '', confirmEmail: '', phone: '' });
  const [showEmail, setShowEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const buyerInfoRef = useRef(buyerInfo);
  const ticketQuantityRef = useRef(ticketQuantity);

  useEffect(() => {
    buyerInfoRef.current = buyerInfo;
  }, [buyerInfo]);

  useEffect(() => {
    ticketQuantityRef.current = ticketQuantity;
  }, [ticketQuantity]);

  const handleFinixConfigError = useCallback((message) => {
    setCheckoutError(message);
  }, []);

  const handleFinixSubmit = useCallback(async (error, response, finixAuth) => {
    if (error) {
      setCheckoutError('Card validation failed. Please check your card details.');
      return;
    }

    const { name, email, phone } = buyerInfoRef.current;
    const quantity = ticketQuantityRef.current;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      setCheckoutError('Please complete name, email, and phone before paying.');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError('');

    try {
      const token = response?.data?.id;
      if (!token) {
        throw new Error('No payment token received from Finix');
      }

      const data = await checkout({
        token,
        fraudSessionId: finixAuth?.getSessionKey?.(),
        quantity,
        name: name.trim(),
        email: email.trim(),
        phone: toE164US(phone),
      });

      setSuccessMessage(data.message || 'Check your email for your ticket and login details.');
      setCheckoutStep('success');
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const validateStep1 = () => {
    const { name, email, confirmEmail, phone } = buyerInfo;
    if (!name?.trim() || !email?.trim() || !confirmEmail?.trim() || !phone?.trim()) {
      setCheckoutError('Please fill in all fields.');
      return false;
    }
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setCheckoutError('Email addresses do not match.');
      return false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setCheckoutError('Please enter a valid 10-digit US phone number.');
      return false;
    }
    setCheckoutError('');
    return true;
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black border border-gray-200 bg-white transition-all';

  const inputWithIconClass = `${inputClass} pr-10`;

  const btnCompact = `${checkoutButtonClass} !py-3`;
  const btnOutline =
    'flex-1 py-3 px-5 rounded-full text-black font-bold text-sm border border-gray-300 bg-white hover:bg-gray-50 transition-all';

  return (
    <div
      className="relative w-full min-h-screen"
      style={{ background: '#F7F7F7', fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="absolute top-0 right-0 w-[30vw] h-[30vw] rounded-full blur-[100px] pointer-events-none opacity-10"
        style={{
          background: `radial-gradient(circle, ${BRAND_ACCENT_SOFT} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => onNavigate(checkoutStep === 'success' ? '/tickets' : '/event')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            {checkoutStep === 'success' ? 'Tickets' : 'Back'}
          </button>
          {checkoutStep !== 'success' && (
            <div className="text-right min-w-0">
              <h1 className="text-black font-extrabold text-lg sm:text-xl leading-tight truncate">Get Tickets</h1>
              <p className="text-gray-500 text-[11px] sm:text-xs truncate hidden sm:block">
                {EVENT_CHECKOUT.title}
              </p>
            </div>
          )}
        </div>

        {checkoutStep === 'success' ? (
          <div className={`${glassCardClass} p-6 sm:p-8 max-w-lg mx-auto w-full text-center animate-fadeIn`}>
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 mx-auto">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-black font-extrabold text-xl sm:text-2xl">You&apos;re Going!</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {successMessage || `Confirmation sent to`}{' '}
              <strong className="text-gray-800">{buyerInfo.email}</strong>.
            </p>
            <div className="w-full border border-gray-200 bg-gray-50 rounded-2xl p-4 my-5 text-left text-sm">
              <div className="flex justify-between font-bold text-black border-b border-gray-200 pb-2 mb-2">
                <span>General Admission</span>
                <span>{ticketQuantity}x</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total</span>
                <span className="font-mono text-black font-bold">${(TICKET_PRICE * ticketQuantity).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => onNavigate('/tickets')} className={btnCompact} style={checkoutButtonStyle}>
                My Tickets
              </button>
              <button type="button" onClick={() => onNavigate('/event')} className={btnOutline}>
                Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* Form column */}
            <div className={`${glassCardClass} p-4 sm:p-6 lg:p-8 ${checkoutStep === 3 ? 'lg:col-span-6' : 'lg:col-span-7'}`}>
              <CheckoutStepIndicator currentStep={checkoutStep} compact />

              {checkoutError && checkoutStep !== 3 && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs mb-4">{checkoutError}</div>
              )}

              <div className="mb-4 sm:mb-6">
                {checkoutStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label htmlFor="checkout-name" className="text-black font-semibold text-[10px] uppercase tracking-wide">Full Name</label>
                      <input type="text" id="checkout-name" value={buyerInfo.name} onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })} placeholder="Your name" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="checkout-email" className="text-black font-semibold text-[10px] uppercase tracking-wide">Email</label>
                      <div className="relative">
                        <input
                          type={showEmail ? 'text' : 'password'}
                          id="checkout-email"
                          name="email_entry"
                          value={buyerInfo.email}
                          onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          placeholder="name@example.com"
                          className={inputWithIconClass}
                          autoComplete="new-password"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          data-lpignore="true"
                          data-form-type="other"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEmail((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showEmail ? 'Hide email' : 'Show email'}
                        >
                          {showEmail ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 5.858a3 3 0 104.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="checkout-confirm-email" className="text-black font-semibold text-[10px] uppercase tracking-wide">Confirm Email</label>
                      <input
                        type="email"
                        id="checkout-confirm-email"
                        name="confirm_email_verification"
                        value={buyerInfo.confirmEmail}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, confirmEmail: e.target.value })}
                        onPaste={(e) => e.preventDefault()}
                        onDrop={(e) => e.preventDefault()}
                        placeholder="Re-enter your email"
                        className={inputClass}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label htmlFor="checkout-phone" className="text-black font-semibold text-[10px] uppercase tracking-wide">Phone</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold shrink-0 select-none">
                          +1
                        </span>
                        <input
                          type="tel"
                          id="checkout-phone"
                          inputMode="numeric"
                          value={buyerInfo.phone}
                          onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: formatUSPhone(e.target.value) })}
                          placeholder="(123) 456-7890"
                          className={`${inputClass} rounded-l-none`}
                          autoComplete="tel-national"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-black font-bold text-sm">General Admission</span>
                        <p className="text-gray-500 text-xs mt-0.5">${TICKET_PRICE.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                        <button type="button" onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold" aria-label="Decrease tickets">−</button>
                        <span className="text-black font-bold w-7 text-center tabular-nums">{ticketQuantity}</span>
                        <button type="button" onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold" aria-label="Increase tickets">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-500 text-sm">Subtotal</span>
                      <span className="text-black font-extrabold text-lg tabular-nums">${(TICKET_PRICE * ticketQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm space-y-3">
                    <p className="text-black font-bold text-sm">{EVENT_CHECKOUT.title}</p>
                    <p className="text-gray-500 text-xs">{EVENT_CHECKOUT.date} · {EVENT_CHECKOUT.time}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Name</span>
                      <span className="text-black font-semibold text-right truncate">{buyerInfo.name}</span>
                      <span className="text-gray-500">Email</span>
                      <span className="text-black font-semibold text-right truncate">{buyerInfo.email}</span>
                      <span className="text-gray-500">Phone</span>
                      <span className="text-black font-semibold text-right truncate">+1 {buyerInfo.phone}</span>
                      <span className="text-gray-500">Tickets</span>
                      <span className="text-black font-semibold text-right">{ticketQuantity}x</span>
                      <span className="text-gray-500 col-span-2 pt-2 border-t border-gray-200">Total</span>
                      <span className="text-black font-extrabold text-right col-span-2 text-lg tabular-nums">${(TICKET_PRICE * ticketQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
                {checkoutStep === 1 && (
                  <button type="button" onClick={() => validateStep1() && setCheckoutStep(2)} className={btnCompact} style={checkoutButtonStyle}>
                    Next
                  </button>
                )}
                {checkoutStep === 2 && (
                  <>
                    <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(1); }} className={btnOutline}>Back</button>
                    <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(3); }} className={`flex-1 ${btnCompact}`} style={checkoutButtonStyle}>Checkout</button>
                  </>
                )}
                {checkoutStep === 3 && (
                  <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(2); }} disabled={isSubmitting} className={`w-full ${btnOutline} disabled:opacity-50`}>Back</button>
                )}
              </div>
            </div>

            {/* Side column — poster or payment */}
            <div className={`w-full ${checkoutStep === 3 ? 'lg:col-span-6' : 'lg:col-span-5'} lg:sticky lg:top-[120px]`}>
              {checkoutStep === 3 ? (
                <div className={`${glassCardClass} p-4 sm:p-6 lg:p-8`}>
                  <div className="mb-4">
                    <h2 className="text-black font-extrabold text-lg sm:text-xl">Payment</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Enter your card details below.</p>
                  </div>
                  <FinixPaymentForm onPaymentSubmit={handleFinixSubmit} onConfigError={handleFinixConfigError} />
                  {checkoutError && (
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs mt-4">{checkoutError}</div>
                  )}
                  {isSubmitting && (
                    <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">Processing payment...</p>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl overflow-hidden shadow-lg border border-white border-opacity-40">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] bg-gray-200">
                    <img src={EVENT_CHECKOUT.poster} alt={EVENT_CHECKOUT.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      ${TICKET_PRICE.toFixed(2)}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-black/95 text-white flex justify-between items-center text-[7px] sm:text-[8px] uppercase tracking-widest font-semibold">
                    <div className="flex gap-2"><span>TikTok</span><span>Insta</span></div>
                    <span>studio3.dallas</span>
                    <span>Connection</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
