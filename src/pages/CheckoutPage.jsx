import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { checkout, fetchCheckoutConfig } from '../lib/api';
import { getCheckoutSubmitted, markCheckoutSubmitted } from '../lib/checkoutSession';
import {
  BRAND_ACCENT_SOFT,
  EVENT_CHECKOUT,
  CheckoutStepIndicator,
  FinixPaymentForm,
  checkoutButtonClass,
  checkoutButtonStyle,
  glassCardClass,
} from '../components/checkout/shared';
import WalletPayments from '../components/checkout/WalletPayments';
import SocialLinks from '../components/SocialLinks';
import { AccountMarketingOptIns, CheckoutTransactionalNotice } from '../components/checkout/CheckoutOptInCopy';
import PaymentProcessingOverlay from '../components/checkout/PaymentProcessingOverlay';
import { calculateTieredOrderPricing, formatCents, formatRate, formatCentsAsDollars } from '../lib/pricing';
import { STUDIO_EVENT } from '../constants/event';

import { formatUSPhone, toE164US } from '../lib/phone';

const DEFAULT_TIERS = {
  soldCount: 0,
  earlyBirdLimit: STUDIO_EVENT.earlyBirdLimit,
  earlyBirdPriceCents: Math.round(STUDIO_EVENT.ticketPrice * 100),
  regularPriceCents: Math.round(STUDIO_EVENT.regularTicketPrice * 100),
};

function OrderPricingBreakdown({ pricing, compact = false }) {
  const textClass = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={`space-y-2 ${textClass}`}>
      {pricing.earlyBirdQty > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>
            Early bird ({pricing.earlyBirdQty}x @ {formatCents(pricing.earlyBirdPriceCents)})
          </span>
          <span className="tabular-nums text-gray-900">
            {formatCents(pricing.earlyBirdQty * pricing.earlyBirdPriceCents)}
          </span>
        </div>
      )}
      {pricing.regularQty > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>
            Regular ({pricing.regularQty}x @ {formatCents(pricing.regularPriceCents)})
          </span>
          <span className="tabular-nums text-gray-900">
            {formatCents(pricing.regularQty * pricing.regularPriceCents)}
          </span>
        </div>
      )}
      {pricing.earlyBirdQty === 0 && pricing.regularQty === 0 && (
        <div className="flex justify-between text-gray-600">
          <span>Tickets ({pricing.quantity}x)</span>
          <span className="tabular-nums text-gray-900">{formatCents(pricing.ticketSubtotalCents)}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-600">
        <span>Sales tax ({formatRate(pricing.rates.salesTax)})</span>
        <span className="tabular-nums text-gray-900">{formatCents(pricing.salesTaxCents)}</span>
      </div>
      <div className={`flex justify-between items-center pt-2 border-t border-gray-200 ${compact ? '' : 'text-base'}`}>
        <span className="font-bold text-gray-900">Total</span>
        <span className="font-extrabold text-gray-900 tabular-nums">{formatCents(pricing.totalCents)}</span>
      </div>
    </div>
  );
}

const CheckoutPage = ({ onNavigate }) => {
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', email: '', confirmEmail: '', phone: '' });
  const [marketingOptIns, setMarketingOptIns] = useState({ email: false, sms: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutInfo, setCheckoutInfo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [checkoutOutcome, setCheckoutOutcome] = useState('complete');
  const [tierConfig, setTierConfig] = useState(DEFAULT_TIERS);

  useEffect(() => {
    fetchCheckoutConfig()
      .then((data) => {
        const p = data.pricing || {};
        setTierConfig({
          soldCount: p.soldCount ?? 0,
          earlyBirdLimit: p.earlyBirdLimit ?? DEFAULT_TIERS.earlyBirdLimit,
          earlyBirdPriceCents: p.earlyBirdPriceCents ?? DEFAULT_TIERS.earlyBirdPriceCents,
          regularPriceCents: p.regularPriceCents ?? DEFAULT_TIERS.regularPriceCents,
        });
      })
      .catch(() => {
        setCheckoutError('Could not load ticket pricing. Please refresh and try again.');
      });
  }, []);

  const buyerInfoRef = useRef(buyerInfo);
  const ticketQuantityRef = useRef(ticketQuantity);

  useEffect(() => {
    buyerInfoRef.current = buyerInfo;
  }, [buyerInfo]);

  useEffect(() => {
    ticketQuantityRef.current = ticketQuantity;
  }, [ticketQuantity]);

  const applyCheckoutSuccess = useCallback((data, email) => {
    const isPending = Boolean(data.pending);
    const isRecovered = Boolean(data.recovered);
    const isAlreadyReceived = Boolean(data.alreadyReceived);

    setCheckoutError('');
    setCheckoutInfo('');
    setSuccessMessage(
      data.message ||
        (isPending
          ? 'Payment received. Your tickets are being processed and will be emailed shortly.'
          : 'Check your email for your ticket and login details.')
    );
    setCheckoutOutcome(
      isAlreadyReceived ? 'alreadyReceived' : isRecovered ? 'recovered' : isPending ? 'pending' : 'complete'
    );
    setPaymentComplete(true);
    setCheckoutStep('success');
    markCheckoutSubmitted(email, data.transferId);
  }, []);

  const handleCheckoutFailure = useCallback((err) => {
    setCheckoutError(err.message || 'Checkout failed');
  }, []);

  useEffect(() => {
    if (checkoutStep !== 3) return;
    const submitted = getCheckoutSubmitted(buyerInfo.email);
    if (submitted) {
      setCheckoutInfo(
        'A payment was already submitted for this email. Please check your inbox for tickets before paying again.'
      );
    }
  }, [checkoutStep, buyerInfo.email]);

  const handleWalletPay = useCallback(async (walletPayload) => {
    const { name, email, phone } = buyerInfoRef.current;
    const quantity = ticketQuantityRef.current;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      throw new Error('Please complete name, email, and phone before paying.');
    }

    setIsSubmitting(true);
    setCheckoutError('');
    setCheckoutInfo('');

    try {
      const data = await checkout({
        ...walletPayload,
        quantity,
        name: name.trim(),
        email: email.trim(),
        phone: toE164US(phone),
      });

      applyCheckoutSuccess(data, email.trim());
    } catch (err) {
      handleCheckoutFailure(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [applyCheckoutSuccess, handleCheckoutFailure]);

  const handleFinixConfigError = useCallback((message) => {
    setCheckoutError(message);
  }, []);

  const handleWalletError = useCallback((message) => {
    setCheckoutError(message);
  }, []);

  const orderPricing = useMemo(
    () =>
      calculateTieredOrderPricing({
        ...tierConfig,
        quantity: ticketQuantity,
      }),
    [tierConfig, ticketQuantity]
  );
  const checkoutAmountCents = orderPricing.totalCents;

  const currentUnitPrice = orderPricing.currentTier === 'regular'
    ? formatCentsAsDollars(orderPricing.regularPriceCents)
    : formatCentsAsDollars(orderPricing.earlyBirdPriceCents);

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
    setCheckoutInfo('');

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

      applyCheckoutSuccess(data, email.trim());
    } catch (err) {
      handleCheckoutFailure(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyCheckoutSuccess, handleCheckoutFailure]);

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

  const noCopyClass = 'select-none';

  const preventCopy = (e) => e.preventDefault();

  const btnCompact = `${checkoutButtonClass} !py-3`;
  const btnOutline =
    'flex-1 py-3 px-5 rounded-full text-black font-bold text-sm border border-gray-300 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:pointer-events-none';

  const isProcessingPayment = isSubmitting && checkoutStep === 3;
  const paymentsLocked = isSubmitting || paymentComplete;

  const successTitle =
    checkoutOutcome === 'pending' || checkoutOutcome === 'alreadyReceived'
      ? 'Payment Received'
      : checkoutOutcome === 'recovered'
        ? 'Order Found'
        : "You're Going!";

  const successIconClass =
    checkoutOutcome === 'pending' || checkoutOutcome === 'alreadyReceived'
      ? 'bg-amber-50 border-amber-100 text-amber-600'
      : 'bg-emerald-50 border-emerald-100 text-emerald-600';

  return (
    <div
      className="relative w-full min-h-screen"
      style={{ background: '#F7F7F7', fontFamily: "'Inter', sans-serif" }}
    >
      <PaymentProcessingOverlay
        active={isProcessingPayment}
        amountLabel={formatCents(checkoutAmountCents)}
      />
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
            onClick={() => onNavigate(checkoutStep === 'success' ? '/' : '/event')}
            disabled={isProcessingPayment}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            {checkoutStep === 'success' ? 'Home' : 'Back'}
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
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-4 mx-auto ${successIconClass}`}>
              {checkoutOutcome === 'pending' || checkoutOutcome === 'alreadyReceived' ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h2 className="text-black font-extrabold text-xl sm:text-2xl">{successTitle}</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {successMessage ||
                (checkoutOutcome === 'complete' || checkoutOutcome === 'recovered' ? (
                  <>
                    You&apos;re all set! We sent a confirmation to{' '}
                    <strong className="text-gray-800">{buyerInfo.email}</strong>. Check your email for
                    your ticket PDF and login credentials.
                  </>
                ) : null)}
            </p>
            {(checkoutOutcome === 'pending' || checkoutOutcome === 'alreadyReceived') && (
              <p className="text-amber-800 text-xs mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                Please do not pay again. If you do not receive an email within 30 minutes, contact support.
              </p>
            )}
            <div className="w-full border border-gray-200 bg-gray-50 rounded-2xl p-4 my-5 text-left text-sm">
              <div className="flex justify-between font-bold text-black border-b border-gray-200 pb-2 mb-3">
                <span>General Admission</span>
                <span>{ticketQuantity}x</span>
              </div>
              <OrderPricingBreakdown pricing={orderPricing} compact />
            </div>
            <button type="button" onClick={() => onNavigate('/')} className={`w-full ${btnCompact}`} style={checkoutButtonStyle}>
              Back to home
            </button>
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
                      <input
                        type="email"
                        id="checkout-email"
                        name="email_entry"
                        value={buyerInfo.email}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                        onCopy={preventCopy}
                        onCut={preventCopy}
                        onContextMenu={preventCopy}
                        placeholder="name@example.com"
                        className={`${inputClass} ${noCopyClass}`}
                        autoComplete="email"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="checkout-confirm-email" className="text-black font-semibold text-[10px] uppercase tracking-wide">Confirm Email</label>
                      <input
                        type="email"
                        id="checkout-confirm-email"
                        name="confirm_email_verification"
                        value={buyerInfo.confirmEmail}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, confirmEmail: e.target.value })}
                        onPaste={preventCopy}
                        onCopy={preventCopy}
                        onCut={preventCopy}
                        onDrop={preventCopy}
                        onContextMenu={preventCopy}
                        placeholder="Re-enter your email"
                        className={`${inputClass} ${noCopyClass}`}
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

                    <div className="sm:col-span-2">
                      <AccountMarketingOptIns
                      emailOptIn={marketingOptIns.email}
                      smsOptIn={marketingOptIns.sms}
                      onEmailOptInChange={(checked) =>
                        setMarketingOptIns((prev) => ({ ...prev, email: checked }))
                      }
                      onSmsOptInChange={(checked) =>
                        setMarketingOptIns((prev) => ({ ...prev, sms: checked }))
                      }
                      onNavigate={onNavigate}
                      />
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    {orderPricing.currentTier === 'regular' && (
                      <p className="text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 mb-3">
                        Early bird sold out. Tickets are {formatCents(orderPricing.regularPriceCents)} each.
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-black font-bold text-sm">General Admission</span>
                        <p className="text-gray-500 text-xs mt-0.5">
                          ${currentUnitPrice.toFixed(2)} each
                          {orderPricing.regularQty > 0 && orderPricing.earlyBirdQty > 0
                            ? ' (mixed tiers)'
                            : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                        <button type="button" onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold" aria-label="Decrease tickets">−</button>
                        <span className="text-black font-bold w-7 text-center tabular-nums">{ticketQuantity}</span>
                        <button type="button" onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold" aria-label="Increase tickets">+</button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <OrderPricingBreakdown pricing={orderPricing} />
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
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <OrderPricingBreakdown pricing={orderPricing} compact />
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
                    <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(1); }} disabled={isProcessingPayment} className={btnOutline}>Back</button>
                    <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(3); }} className={`flex-1 ${btnCompact}`} style={checkoutButtonStyle}>Checkout</button>
                  </>
                )}
                {checkoutStep === 3 && (
                  <button type="button" onClick={() => { setCheckoutError(''); setCheckoutStep(2); }} disabled={isProcessingPayment} className={`w-full ${btnOutline}`}>Back</button>
                )}
              </div>
            </div>

            {/* Side column — poster or payment */}
            <div className={`w-full ${checkoutStep === 3 ? 'lg:col-span-6' : 'lg:col-span-5'} lg:sticky lg:top-[120px]`}>
              {checkoutStep === 3 ? (
                <div className={`${glassCardClass} p-4 sm:p-6 lg:p-8 ${paymentsLocked ? 'pointer-events-none opacity-60' : ''}`}>
                  <div className="mb-4">
                    <h2 className="text-black font-extrabold text-lg sm:text-xl">Payment</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Pay with Apple Pay, Google Pay, or enter your card details below.
                    </p>
                  </div>
                  {checkoutInfo && (
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs mb-4">{checkoutInfo}</div>
                  )}
                  <CheckoutTransactionalNotice onNavigate={onNavigate} />
                  <WalletPayments
                    amountCents={checkoutAmountCents}
                    buyerName={buyerInfo.name}
                    disabled={paymentsLocked}
                    onPay={handleWalletPay}
                    onError={handleWalletError}
                  />
                  {checkoutError && (
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs mt-4">{checkoutError}</div>
                  )}
                  <FinixPaymentForm onPaymentSubmit={handleFinixSubmit} onConfigError={handleFinixConfigError} />
                </div>
              ) : (
                <div className="rounded-3xl overflow-hidden shadow-lg border border-white border-opacity-40">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] bg-gray-200">
                    <img src={EVENT_CHECKOUT.poster} alt={EVENT_CHECKOUT.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-center leading-tight">
                      <span className="block">${currentUnitPrice.toFixed(2)}</span>
                      <span className="block font-semibold normal-case opacity-90">+ tax</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-black/95 text-white flex justify-center items-center">
                    <SocialLinks variant="dark" />
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
