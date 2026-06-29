const BRAND_ACCENT = '#B8C5D6';

const glassCardClass =
  'bg-white/70 border border-white/80 rounded-3xl backdrop-blur-sm shadow-sm';

const primaryBtnClass =
  'w-full py-3.5 px-5 rounded-full text-black font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';

const primaryBtnStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

const outlineBtnClass =
  'w-full py-3.5 px-5 rounded-full border border-gray-300 text-gray-800 font-semibold text-sm bg-white hover:bg-gray-50 transition-colors';

function formatEventDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCheckedIn(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusIcon({ type }) {
  if (type === 'valid') {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (type === 'already_used') {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function getStatusConfig(result) {
  if (!result) return null;

  if (result.valid) {
    return {
      type: 'valid',
      label: 'Valid ticket',
      hint: 'Guest may be checked in at the door',
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200/80',
      text: 'text-emerald-900',
      iconBg: 'bg-emerald-100 text-emerald-700',
      ring: 'ring-emerald-100',
    };
  }
  if (result.result === 'already_used') {
    return {
      type: 'already_used',
      label: 'Already checked in',
      hint: 'This ticket was scanned before',
      bg: 'bg-amber-50/90',
      border: 'border-amber-200/80',
      text: 'text-amber-900',
      iconBg: 'bg-amber-100 text-amber-800',
      ring: 'ring-amber-100',
    };
  }
  return {
    type: 'invalid',
    label: 'Invalid ticket',
    hint: 'Not found, unpaid, or cancelled',
    bg: 'bg-red-50/90',
    border: 'border-red-200/80',
    text: 'text-red-900',
    iconBg: 'bg-red-100 text-red-700',
    ring: 'ring-red-100',
  };
}

function DetailCell({ label, value, mono = false, className = '' }) {
  if (!value) return null;
  return (
    <div className={`rounded-2xl bg-white/80 border border-gray-100 p-4 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className={`text-sm font-semibold text-gray-900 mt-1.5 break-words ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </div>
  );
}

export function TicketVerificationPanel({
  result,
  error,
  checkingIn = false,
  onCheckIn,
  onScanAnother,
  scanAnotherLabel = 'Verify another ticket',
  showScanAnother = true,
}) {
  const status = getStatusConfig(result);
  const ticket = result?.ticket;
  const checkedInLabel = formatCheckedIn(ticket?.checkedInAt);

  return (
    <div className="space-y-6 text-left w-full">
      {error && (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/90 backdrop-blur-sm p-4 sm:p-5">
          <p className="text-sm font-bold text-red-900">Verification failed</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      )}

      {result && status && (
        <>
          <div
            className={`rounded-3xl border p-5 sm:p-7 lg:p-8 ring-4 ${status.bg} ${status.border} ${status.ring}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${status.iconBg}`}>
                  <StatusIcon type={status.type} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xl sm:text-2xl font-extrabold tracking-tight ${status.text}`}>
                    {status.label}
                  </p>
                  <p className={`text-sm mt-1 ${status.text} opacity-80`}>{status.hint}</p>
                </div>
              </div>

              {ticket?.attendeeName && (
                <div className="lg:text-right lg:pl-6 lg:border-l lg:border-black/5 shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Guest</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-1 tracking-tight">
                    {ticket.attendeeName}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {ticket && (
              <section className={`${glassCardClass} p-5 sm:p-6 lg:col-span-8`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                  Ticket details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  <DetailCell label="Event" value={ticket.event?.title} className="sm:col-span-2 xl:col-span-3" />
                  <DetailCell label="Venue" value={ticket.event?.venue} />
                  <DetailCell label="Event date" value={formatEventDate(ticket.event?.startsAt)} />
                  <DetailCell label="Booking ID" value={ticket.confirmationCode} mono />
                  <DetailCell label="Ticket status" value={ticket.status} />
                  {ticket.buyerEmail && (
                    <DetailCell label="Buyer email" value={ticket.buyerEmail} className="sm:col-span-2 xl:col-span-3" />
                  )}
                  {checkedInLabel && (
                    <DetailCell label="Checked in at" value={checkedInLabel} className="sm:col-span-2 xl:col-span-3" />
                  )}
                </div>
              </section>
            )}

            <aside className={`space-y-4 ${ticket ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
              <div className={`${glassCardClass} p-5 sm:p-6`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  {result.valid && onCheckIn && (
                    <button
                      type="button"
                      onClick={onCheckIn}
                      disabled={checkingIn}
                      className={primaryBtnClass}
                      style={primaryBtnStyle}
                    >
                      {checkingIn ? 'Checking in…' : 'Check in guest'}
                    </button>
                  )}
                  {showScanAnother && onScanAnother && (
                    <button type="button" onClick={onScanAnother} className={outlineBtnClass}>
                      {scanAnotherLabel}
                    </button>
                  )}
                </div>
              </div>

              <div className={`${glassCardClass} p-5 sm:p-6`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">At the door</p>
                <ul className="mt-3 space-y-2.5 text-sm text-gray-600">
                  <li className="flex gap-2.5">
                    <span className="text-gray-400 font-bold">•</span>
                    <span>Match guest name to photo ID.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-gray-400 font-bold">•</span>
                    <span>Only admit when status is valid.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-gray-400 font-bold">•</span>
                    <span>Check in once — tickets cannot be reused.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export { BRAND_ACCENT, formatEventDate };
