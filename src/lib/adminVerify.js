export function extractQrToken(value) {
  if (!value) return null;
  try {
    if (value.includes('?t=')) {
      const url = new URL(value.startsWith('http') ? value : `https://local${value}`);
      return url.searchParams.get('t');
    }
    if (value.includes('/admin/verify?t=')) {
      return value.split('t=')[1]?.split('&')[0];
    }
  } catch {
    // not a URL
  }
  return value.trim();
}

export function parseAdminVerifySearch(search = window.location.search) {
  const params = new URLSearchParams(search);
  const qrToken = params.get('t')?.trim() || null;
  const bookingId = params.get('bookingId')?.trim() || null;
  const ticketId = params.get('ticketId')?.trim() || null;

  if (qrToken) return { lookup: { qrToken }, label: 'QR code' };
  if (bookingId) return { lookup: { bookingId }, label: `Booking ID ${bookingId}` };
  if (ticketId) return { lookup: { ticketId }, label: 'Ticket' };
  return { lookup: null, label: null };
}

export function buildAdminVerifyPath(lookup) {
  if (!lookup) return '/admin/verify';
  if (lookup.qrToken) {
    return `/admin/verify?t=${encodeURIComponent(lookup.qrToken)}`;
  }
  if (lookup.bookingId) {
    return `/admin/verify?bookingId=${encodeURIComponent(lookup.bookingId)}`;
  }
  if (lookup.ticketId) {
    return `/admin/verify?ticketId=${encodeURIComponent(lookup.ticketId)}`;
  }
  return '/admin/verify';
}

export function buildCheckInLookup(result, fallbackLookup) {
  if (result?.ticket?.id) return { ticketId: result.ticket.id };
  if (result?.lookup?.ticketId) return { ticketId: result.lookup.ticketId };
  if (result?.lookup?.qrToken) return { qrToken: result.lookup.qrToken };
  if (result?.lookup?.bookingId) return { bookingId: result.lookup.bookingId };
  if (result?.qrToken) return { qrToken: result.qrToken };
  if (fallbackLookup) return fallbackLookup;
  return null;
}
