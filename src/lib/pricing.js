/** Keep in sync with studio-3-ticketing-api/src/lib/pricing.js */
export const SALES_TAX_RATE = 0.0825;
export const SERVICE_FEE_RATE = 0;

export function calculateTieredTicketSubtotal(input) {
  const {
    soldCount,
    quantity,
    earlyBirdLimit,
    earlyBirdPriceCents,
    regularPriceCents,
  } = input;

  const earlyBirdRemaining = Math.max(0, earlyBirdLimit - soldCount);
  const earlyBirdQty = Math.min(quantity, earlyBirdRemaining);
  const regularQty = quantity - earlyBirdQty;
  const ticketSubtotalCents =
    earlyBirdQty * earlyBirdPriceCents + regularQty * regularPriceCents;

  return {
    quantity,
    soldCount,
    earlyBirdLimit,
    earlyBirdRemaining,
    earlyBirdQty,
    regularQty,
    earlyBirdPriceCents,
    regularPriceCents,
    ticketSubtotalCents,
    currentTier: soldCount >= earlyBirdLimit ? 'regular' : 'early_bird',
  };
}

export function calculateOrderPricingFromSubtotal(ticketSubtotalCents, quantity, percentOff = 0) {
  const discountPercent = Math.max(0, Math.min(100, Number(percentOff) || 0));
  const discountCents =
    discountPercent > 0 ? Math.round(ticketSubtotalCents * discountPercent / 100) : 0;
  const discountedTicketSubtotalCents = ticketSubtotalCents - discountCents;
  const serviceFeeCents = Math.round(discountedTicketSubtotalCents * SERVICE_FEE_RATE);
  const salesTaxCents = Math.round(discountedTicketSubtotalCents * SALES_TAX_RATE);
  const totalCents = discountedTicketSubtotalCents + serviceFeeCents + salesTaxCents;

  return {
    quantity,
    ticketSubtotalCents,
    discountPercent,
    discountCents,
    discountedTicketSubtotalCents,
    serviceFeeCents,
    salesTaxCents,
    totalCents,
    rates: {
      salesTax: SALES_TAX_RATE,
      serviceFee: SERVICE_FEE_RATE,
    },
  };
}

export function calculateTieredOrderPricing(input) {
  const { percentOff = 0, ...tierInput } = input;
  const tier = calculateTieredTicketSubtotal(tierInput);
  const fees = calculateOrderPricingFromSubtotal(
    tier.ticketSubtotalCents,
    tier.quantity,
    percentOff
  );

  return {
    ...tier,
    ...fees,
  };
}

export function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatRate(rate) {
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatCentsAsDollars(cents) {
  return cents / 100;
}
