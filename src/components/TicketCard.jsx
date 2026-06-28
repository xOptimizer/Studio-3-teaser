import { STUDIO_EVENT } from '../constants/event';

function fmtBookingId(code) {
  const digits = code?.replace(/\D/g, '') ?? '';
  return digits.length >= 4 ? digits.padStart(14, '0').slice(-14) : (code || '—').toUpperCase();
}

function TicketCard({ ticket, qrImageUrl, perforationColor = '#F3F4F6' }) {
  const valid = ticket.status === 'valid';

  return (
    <div
      className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-xl"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Studio 3 logo + company name */}
      <div className="px-4 py-4 text-center bg-white border-b border-gray-100">
        <img
          src={STUDIO_EVENT.logoWithText}
          alt="Studio 3"
          className="h-12 w-auto max-w-[200px] mx-auto object-contain"
          crossOrigin="anonymous"
        />
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.14em] mt-2 font-semibold">
          Admission Ticket
        </p>
      </div>

      {/* Event ticket banner */}
      <div className="h-[132px] bg-[#E65100] overflow-hidden">
        <img
          src={STUDIO_EVENT.ticketBanner}
          alt={STUDIO_EVENT.title}
          className="w-full h-full object-cover object-center"
          crossOrigin="anonymous"
        />
      </div>

      {/* Details — aligned with Event page */}
      <div className="px-7 pt-4 pb-4 border-b border-gray-100">
        <h3 className="font-bold text-[14px] text-black leading-snug mb-3">{STUDIO_EVENT.title}</h3>

        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Member Name</p>
        <p className="text-sm font-bold text-black mb-1">{ticket.attendeeName}</p>
        {ticket.status !== 'valid' && (
          <p className="text-xs font-bold text-red-600 uppercase mb-2">Status: {ticket.status}</p>
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Date</p>
            <p className="text-xs font-semibold text-black">{STUDIO_EVENT.dateLabel}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Time</p>
            <p className="text-xs font-semibold text-black">{STUDIO_EVENT.timeLabel}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Admit</p>
            <p className="text-xs font-semibold text-black">01 only</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Venue</p>
            <p className="text-xs font-semibold text-black leading-snug">
              {STUDIO_EVENT.venue}, {STUDIO_EVENT.address}
            </p>
          </div>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative h-4 flex items-center">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{ backgroundColor: perforationColor }}
        />
        <div className="flex-1 border-t border-dashed border-gray-300 mx-3" />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full"
          style={{ backgroundColor: perforationColor }}
        />
      </div>

      {/* QR */}
      <div className="px-7 pt-4 pb-6 flex flex-col items-center">
        <div className={`p-2 rounded-xl border border-gray-200 ${valid ? '' : 'opacity-40'}`}>
          {qrImageUrl ? (
            <img src={qrImageUrl} alt="QR" width={120} height={120} crossOrigin="anonymous" />
          ) : (
            <div className="w-[120px] h-[120px] bg-gray-100 animate-pulse rounded-lg" />
          )}
        </div>
        <p className="mt-3 text-[10px] font-bold tracking-widest uppercase text-center">
          Booking ID — {fmtBookingId(ticket.confirmationCode)}
        </p>
        <p className="text-[9px] text-gray-400 mt-1">{ticket.confirmationCode}</p>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Present this QR code at the door for entry.
        </p>
      </div>
    </div>
  );
}

export default TicketCard;
