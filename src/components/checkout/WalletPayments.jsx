import { useCallback, useEffect, useRef, useState } from 'react';
import { createApplePaySession, fetchCheckoutConfig } from '../../lib/api';

const GOOGLE_PAY_SCRIPT = 'https://pay.google.com/gp/p/js/pay.js';

const GOOGLE_PAY_BASE_REQUEST = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

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

function getGooglePayPaymentMethods(checkoutConfig) {
  const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
    },
  };

  const cardPaymentMethod = {
    ...baseCardPaymentMethod,
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'finix',
        gatewayMerchantId: checkoutConfig.merchantIdentityId,
      },
    },
  };

  return { baseCardPaymentMethod, cardPaymentMethod };
}

function buildGooglePayPaymentDataRequest(checkoutConfig, amountCents, cardPaymentMethod) {
  const paymentDataRequest = {
    ...GOOGLE_PAY_BASE_REQUEST,
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

  return paymentDataRequest;
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
      return 'Apple Pay is not set up on this device. Add a card to Wallet, or pay with card instead.';
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

const WALLET_PAY_BTN_SLOT = 'wallet-pay-btn-slot';

function WalletButtonSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className={`${WALLET_PAY_BTN_SLOT} bg-gray-100 animate-pulse`} />
      <div className={`${WALLET_PAY_BTN_SLOT} bg-gray-100 animate-pulse`} />
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
  const [googlePayReady, setGooglePayReady] = useState(false);

  const configRef = useRef(null);
  const googlePayClientRef = useRef(null);
  const googlePayContainerRef = useRef(null);
  const startGooglePayRef = useRef(() => {});

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

        try {
          googlePayClientRef.current = await getGooglePayClient(checkoutConfig.finixEnv);
        } catch (err) {
          console.warn('[WalletPayments] Google Pay preload failed', err);
        }
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

  const startGooglePay = useCallback(() => {
    setWalletMessage('');

    const checkoutConfig = configRef.current;
    if (!checkoutConfig) {
      reportError(configError || 'Payment options are still loading. Wait a moment and try again.');
      return;
    }

    if (disabled || googlePayBusy) {
      if (disabled) {
        reportError('A payment is already in progress.');
      }
      return;
    }

    const paymentsClient = googlePayClientRef.current;
    if (!paymentsClient) {
      reportError('Google Pay is not available right now. Use Apple Pay or card instead.');
      return;
    }

    const { cardPaymentMethod } = getGooglePayPaymentMethods(checkoutConfig);
    const paymentDataRequest = buildGooglePayPaymentDataRequest(
      checkoutConfig,
      amountCents,
      cardPaymentMethod
    );

    setGooglePayBusy(true);

    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then(async (paymentData) => {
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
      })
      .catch((err) => {
        if (err?.statusCode === 'CANCELED') return;
        console.error('[Google Pay] payment failed', err);
        reportError(err.message || 'Google Pay payment failed. Use Apple Pay or card instead.');
      })
      .finally(() => {
        setGooglePayBusy(false);
      });
  }, [amountCents, buyerName, configError, disabled, googlePayBusy, onPay, reportError]);

  useEffect(() => {
    startGooglePayRef.current = startGooglePay;
  }, [startGooglePay]);

  useEffect(() => {
    if (loading || !config || configError) {
      setGooglePayReady(false);
      return undefined;
    }

    const container = googlePayContainerRef.current;
    if (!container) return undefined;

    let cancelled = false;

    async function mountGooglePayButton() {
      container.innerHTML = '';
      setGooglePayReady(false);

      try {
        let paymentsClient = googlePayClientRef.current;
        if (!paymentsClient) {
          paymentsClient = await getGooglePayClient(config.finixEnv);
          googlePayClientRef.current = paymentsClient;
        }

        const { baseCardPaymentMethod, cardPaymentMethod } = getGooglePayPaymentMethods(config);
        const isReadyToPayRequest = {
          ...GOOGLE_PAY_BASE_REQUEST,
          allowedPaymentMethods: [baseCardPaymentMethod],
        };

        const readyResponse = await paymentsClient.isReadyToPay(isReadyToPayRequest);
        if (cancelled || !readyResponse.result) {
          return;
        }

        const button = paymentsClient.createButton({
          onClick: () => startGooglePayRef.current(),
          allowedPaymentMethods: [cardPaymentMethod],
          buttonType: 'pay',
          buttonColor: 'default',
          buttonRadius: 4,
          buttonSizeMode: 'fill',
        });

        if (cancelled) return;

        container.appendChild(button);
        setGooglePayReady(true);
      } catch (err) {
        if (!cancelled) {
          console.warn('[WalletPayments] Google Pay button setup failed', err);
        }
      }
    }

    mountGooglePayButton();

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [config, configError, loading]);

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

  if (loading) {
    return <WalletButtonSkeleton />;
  }

  const paymentsLocked = disabled || applePayBusy || googlePayBusy;

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
        <div className={paymentsLocked ? 'pointer-events-none opacity-50' : ''}>
          <ApplePayButton
            disabled={disabled || !!configError}
            onClick={startApplePay}
            busy={applePayBusy}
          />
        </div>
        <div
          ref={googlePayContainerRef}
          className={`${WALLET_PAY_BTN_SLOT} ${
            googlePayReady ? '' : 'hidden'
          } ${paymentsLocked ? 'pointer-events-none opacity-50' : ''}`}
          aria-hidden={!googlePayReady}
        />
      </div>

      <style>{`
        .wallet-pay-btn-slot {
          width: 100%;
          height: 48px;
          min-height: 48px;
          max-height: 48px;
        }

        .wallet-pay-btn-slot > button,
        .wallet-pay-btn-slot .gpay-card-info-container {
          width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;
        }
      `}</style>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">or pay with card</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
