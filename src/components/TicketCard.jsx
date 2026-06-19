import { useEffect, useState } from 'react';

const POSTER = '/assets/images/art_gallery_poster.png';
const LOGO = '/assets/Logo_With_Text.svg';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
}

function fmtBookingId(code) {
  const digits = code?.replace(/\D/g, '') ?? '';
  return digits.length >= 4 ? digits.padStart(14, '0').slice(-14) : (code || '—').toUpperCase();
}

function TicketCard({ ticket, qrImageUrl, eventImage = POSTER, perforationColor = '#F3F4F6' }) {
  const [posterSrc, setPosterSrc] = useState(eventImage);
  const valid = ticket.status === 'valid';

  useEffect(() => setPosterSrc(eventImage), [eventImage]);

  return (
    <div
      className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-xl"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header — label below logo, no overlap */}
      <div className="pt-4 pb-3 text-center border-b border-gray-100">
        <img src={LOGO} alt="Studio 3" className="h-[58px] w-auto mx-auto object-contain" crossOrigin="anonymous" />
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.14em] mt-2 mb-1">Admission Ticket</p>
      </div>

      {/* Poster */}
      <div className="h-[170px] bg-gray-100 overflow-hidden">
        <img
          src={posterSrc}
          alt={ticket.event.title}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={() => setPosterSrc('/assets/Logo_Without_Text.svg')}
        />
      </div>

      {/* Details */}
      <div className="px-7 pt-4 pb-4 border-b border-gray-100">
        <h3 className="font-bold text-[14px] text-black leading-snug mb-3">{ticket.event.title}</h3>

        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Member Name</p>
        <p className="text-sm font-bold text-black mb-1">{ticket.attendeeName}</p>
        {ticket.status !== 'valid' && (
          <p className="text-xs font-bold text-red-600 uppercase mb-2">Status: {ticket.status}</p>
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Date</p>
            <p className="text-xs font-semibold text-black">{fmtDate(ticket.event.startsAt)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Time</p>
            <p className="text-xs font-semibold text-black">{fmtTime(ticket.event.startsAt)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Admit</p>
            <p className="text-xs font-semibold text-black">01 only</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Venue</p>
            <p className="text-xs font-semibold text-black leading-snug">
              {ticket.event.venue}{ticket.event.address ? `, ${ticket.event.address}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative h-4 flex items-center">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: perforationColor }} />
        <div className="flex-1 border-t border-dashed border-gray-300 mx-3" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: perforationColor }} />
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
        <p className="text-[10px] text-gray-400 mt-2 text-center">Present this QR code at the door for entry.</p>
      </div>
    </div>
  );
}

export default TicketCard;
