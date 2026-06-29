const CHECKOUT_LOCK_KEY = 'studio3_checkout_submitted';
const LOCK_TTL_MS = 15 * 60 * 1000;

export function markCheckoutSubmitted(email, transferId) {
  if (!email) return;
  sessionStorage.setItem(
    CHECKOUT_LOCK_KEY,
    JSON.stringify({
      email: email.toLowerCase(),
      transferId: transferId || null,
      at: Date.now(),
    })
  );
}

export function getCheckoutSubmitted(email) {
  if (!email) return null;

  const raw = sessionStorage.getItem(CHECKOUT_LOCK_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.email !== email.toLowerCase()) return null;
    if (Date.now() - parsed.at > LOCK_TTL_MS) {
      sessionStorage.removeItem(CHECKOUT_LOCK_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearCheckoutSubmitted() {
  sessionStorage.removeItem(CHECKOUT_LOCK_KEY);
}

/** Treat payment-received responses as success so users never pay twice after a charge. */
export function normalizeCheckoutResponse(data, status) {
  if (data?.success) {
    return data;
  }

  if (status === 409 && data?.error === 'Payment already received') {
    return {
      success: true,
      pending: true,
      alreadyReceived: true,
      orderId: data.orderId,
      transferId: data.transferId,
      message: data.message,
    };
  }

  const message = data?.message || '';
  if (
    status === 503 &&
    (message.toLowerCase().includes('do not pay again') ||
      message.toLowerCase().includes('payment received'))
  ) {
    return {
      success: true,
      pending: true,
      message,
    };
  }

  return null;
}
