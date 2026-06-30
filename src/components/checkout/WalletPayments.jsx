import { useCallback, useEffect, useRef, useState } from 'react';
import { createApplePaySession, fetchCheckoutConfig } from '../../lib/api';

const GOOGLE_PAY_SCRIPT = 'https://pay.google.com/gp/p/js/pay.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function formatAmount(amountCents) {
  return (amountCents / 100).toFixed(2);
}

function buildWalletAddress(contact) {
  if (!contact) {
    return { country: 'US', postal_code: '00000' };
  }

  return {
    country: contact.countryCode || 'US',
    postal_code: contact.postalCode || '00000',
    line1: contact.addressLines?.[0],
    line2: contact.addressLines?.[1],
    city: contact.locality,
    region: contact.administrativeArea,
  };
}

function buildWalletName(contact, fallbackName) {
  if (!contact) return fallbackName;

  const given = contact.givenName?.trim() || '';
  const family = contact.familyName?.trim() || '';
  const full = `${given} ${family}`.trim();
  return full || fallbackName;
}

function getApplePaySupportMessage() {
  if (typeof window === 'undefined') {
    return 'Apple Pay is not available in this environment.';
  }

  if (!window.isSecureContext) {
    return 'Apple Pay requires a secure connection (HTTPS). Open this site over HTTPS and try again.';
  }

  if (!window.ApplePaySession) {
    return 'Apple Pay is not supported in this browser. Open this page in Safari on iPhone, iPad, or Mac.';
  }

  try {
    if (!ApplePaySession.canMakePayments()) {
      return 'Apple Pay is not set up on this device. Add a card to Wallet, or use Google Pay or card instead.';
    }
  } catch {
    return 'Apple Pay is not available on this device right now.';
  }

  return null;
}

async function getGooglePayClient(finixEnv) {
  await loadScript(GOOGLE_PAY_SCRIPT);
  if (!window.google?.payments?.api) {
    throw new Error('Google Pay could not be loaded. Check your connection and try again.');
  }

  const environment = finixEnv === 'prod' ? 'PRODUCTION' : 'TEST';
  return new window.google.payments.api.PaymentsClient({ environment });
}

function WalletButtonSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="h-11 rounded-full bg-gray-100 animate-pulse" />
    </div>
  );
}

function ApplePayButton({ disabled, onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="w-full h-11 rounded-full bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Pay with Apple Pay"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      {busy ? 'Opening Apple Pay…' : 'Apple Pay'}
    </button>
  );
}

function GooglePayButton({ disabled, onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="w-full h-11 rounded-full bg-white text-black font-semibold text-sm border border-gray-300 flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Pay with Google Pay"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.8-5.4 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.7 0 2.9.7 3.6 1.3l2.7-2.6C16.9 3.3 14.6 2.4 12 2.4 6.8 2.4 2.5 6.7 2.5 12s4.3 9.6 9.5 9.6c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z" />
      </svg>
      {busy ? 'Opening Google Pay…' : 'Google Pay'}
    </button>
  );
}

export default function WalletPayments({
  amountCents,
  buyerName,
  disabled,
  onPay,
  onError,
}) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState('');
  const [walletMessage, setWalletMessage] = useState('');
  const [applePayBusy, setApplePayBusy] = useState(false);
  const [googlePayBusy, setGooglePayBusy] = useState(false);

  const configRef = useRef(null);
  const googlePayClientRef = useRef(null);

  const reportError = useCallback(
    (message) => {
      setWalletMessage(message);
      onError?.(message);
    },
    [onError]
  );

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const checkoutConfig = await fetchCheckoutConfig();
        if (cancelled) return;

        setConfig(checkoutConfig);
        setConfigError('');

        /* Google Pay disabled
        try {
          googlePayClientRef.current = await getGooglePayClient(checkoutConfig.finixEnv);
        } catch (err) {
          console.warn('[WalletPayments] Google Pay preload failed', err);
        }
        */
      } catch (err) {
        if (!cancelled) {
          const message = err.message || 'Could not load payment options. Refresh and try again.';
          setConfigError(message);
          console.warn('[WalletPayments] config load failed', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const startApplePay = useCallback(() => {
    setWalletMessage('');

    const checkoutConfig = configRef.current;
    if (!checkoutConfig) {
      reportError(configError || 'Payment options are still loading. Wait a moment and try again.');
      return;
    }

    if (disabled) {
      reportError('A payment is already in progress.');
      return;
    }

    const supportMessage = getApplePaySupportMessage();
    if (supportMessage) {
      reportError(supportMessage);
      return;
    }

    setApplePayBusy(true);

    let session;
    try {
      session = new ApplePaySession(6, {
        countryCode: 'US',
        currencyCode: checkoutConfig.event?.currency || 'USD',
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        total: {
          label: checkoutConfig.merchantDisplayName || 'Studio 3',
          amount: formatAmount(amountCents),
        },
        requiredBillingContactFields: ['postalAddress', 'name'],
      });
    } catch (err) {
      setApplePayBusy(false);
      reportError(err.message || 'Could not start Apple Pay on this device.');
      return;
    }

    session.onvalidatemerchant = async (event) => {
      try {
        const { sessionDetails } = await createApplePaySession({
          validationUrl: event.validationURL,
          domain: window.location.hostname,
        });

        session.completeMerchantValidation(JSON.parse(sessionDetails));
      } catch (err) {
        console.error('[Apple Pay] merchant validation failed', err);
        session.abort();
        setApplePayBusy(false);
        reportError(
          err.message ||
            'Apple Pay merchant validation failed. Register this domain in the Finix Dashboard under Alt Payment Methods.'
        );
      }
    };

    session.onpaymentauthorized = async (event) => {
      try {
        const payment = event.payment;
        const billing = payment.billingContact;

        await onPay({
          paymentMethod: 'apple_pay',
          thirdPartyToken: JSON.stringify({ token: payment.token }),
          walletName: buildWalletName(billing, buyerName),
          address: buildWalletAddress(billing),
        });

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
      } catch (err) {
        console.error('[Apple Pay] payment failed', err);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        reportError(err.message || 'Apple Pay payment failed.');
      } finally {
        setApplePayBusy(false);
      }
    };

    session.oncancel = () => {
      setApplePayBusy(false);
    };

    try {
      session.begin();
    } catch (err) {
      setApplePayBusy(false);
      reportError(err.message || 'Could not open Apple Pay. Try Safari on a Mac or iPhone.');
    }
  }, [amountCents, buyerName, configError, disabled, onPay, reportError]);

  const startGooglePay = useCallback(async () => {
    setWalletMessage('');

    const checkoutConfig = configRef.current;
    if (!checkoutConfig) {
      reportError(configError || 'Payment options are still loading. Wait a moment and try again.');
      return;
    }

    if (disabled) {
      reportError('A payment is already in progress.');
      return;
    }

    setGooglePayBusy(true);

    let paymentsClient = googlePayClientRef.current;

    try {
      if (!paymentsClient) {
        paymentsClient = await getGooglePayClient(checkoutConfig.finixEnv);
        googlePayClientRef.current = paymentsClient;
      }
    } catch (err) {
      setGooglePayBusy(false);
      reportError(err.message || 'Google Pay is not available right now. Use Apple Pay or card instead.');
      return;
    }

    const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
    const allowedCardNetworks = ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'];
    const baseCardPaymentMethod = {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
      },
    };

    const tokenizationSpecification = {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'finix',
        gatewayMerchantId: checkoutConfig.merchantIdentityId,
      },
    };

    const cardPaymentMethod = {
      ...baseCardPaymentMethod,
      tokenizationSpecification,
    };

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [cardPaymentMethod],
      transactionInfo: {
        countryCode: 'US',
        currencyCode: checkoutConfig.event?.currency || 'USD',
        totalPrice: formatAmount(amountCents),
        totalPriceStatus: 'FINAL',
      },
      merchantInfo: {
        merchantName: checkoutConfig.merchantDisplayName || 'Studio 3',
      },
    };

    const googleMerchantId = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID;
    if (checkoutConfig.finixEnv === 'prod' && googleMerchantId) {
      paymentDataRequest.merchantInfo.merchantId = googleMerchantId;
    }

    try {
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      const token = paymentData.paymentMethodData.tokenizationData.token;
      const billing = paymentData.paymentMethodData.info?.billingAddress;

      await onPay({
        paymentMethod: 'google_pay',
        thirdPartyToken: token,
        walletName: billing?.name || buyerName,
        address: {
          country: billing?.countryCode || 'US',
          postal_code: billing?.postalCode || '00000',
          line1: billing?.address1,
          line2: billing?.address2,
          city: billing?.locality,
          region: billing?.administrativeArea,
        },
      });
    } catch (err) {
      if (err?.statusCode === 'CANCELED') return;
      console.error('[Google Pay] payment failed', err);
      reportError(err.message || 'Google Pay payment failed. Use Apple Pay or card instead.');
    } finally {
      setGooglePayBusy(false);
    }
  }, [amountCents, buyerName, configError, disabled, onPay, reportError]);

  if (loading) {
    return <WalletButtonSkeleton />;
  }

  return (
    <div className="space-y-3">
      {configError && (
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs">
          {configError}
        </div>
      )}

      {walletMessage && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs">
          {walletMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <ApplePayButton disabled={disabled || !!configError} onClick={startApplePay} busy={applePayBusy} />
        {/* Google Pay disabled
        <GooglePayButton disabled={disabled || !!configError} onClick={startGooglePay} busy={googlePayBusy} />
        */}
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">or pay with card</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
