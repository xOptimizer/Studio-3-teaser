import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { fetchTickets, downloadTicketPdf, fetchTicketQrBlob } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import { captureElementAsPng } from '../utils/ticketDownload';

const BRAND_ACCENT = '#B8C5D6';
const PAGE_BG = '#F7F7F7';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

const primaryBtnClass =
  'flex-1 py-3 rounded-full text-black text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50';

const primaryBtnStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

const outlineBtnClass =
  'flex-1 py-3 rounded-full text-black text-sm font-bold border border-gray-300 bg-white hover:bg-gray-50 transition-all disabled:opacity-50';

function formatListDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function useTicketQr(ticketId) {
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticketId) return undefined;

    let objectUrl = null;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTicketQrBlob(ticketId)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setQrImageUrl(objectUrl);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ticketId]);

  return { qrImageUrl, loading, error };
}

function ModalOverlay({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
}

function DownloadFormatModal({ ticket, onClose, onError }) {
  const captureRef = useRef(null);
  const { qrImageUrl, loading: qrLoading } = useTicketQr(ticket.id);
  const [downloading, setDownloading] = useState(null);

  const handleDownloadPdf = async () => {
    setDownloading('pdf');
    try {
      const blob = await downloadTicketPdf(ticket.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticket.confirmationCode}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      onError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPng = async () => {
    setDownloading('png');
    try {
      await new Promise((r) => setTimeout(r, 100));
      await captureElementAsPng(
        captureRef.current,
        `ticket-${ticket.confirmationCode}.png`
      );
      onClose();
    } catch (err) {
      onError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl p-6 sm:p-8 border border-white/40 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2 className="text-black font-extrabold text-lg mb-1">Download ticket</h2>
        <p className="text-gray-500 text-sm mb-6">Choose a format for {ticket.event.title}</p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={downloading || qrLoading || !qrImageUrl}
            className={primaryBtnClass}
            style={primaryBtnStyle}
          >
            {downloading === 'png' ? 'Preparing...' : 'Download as PNG'}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className={outlineBtnClass}
          >
            {downloading === 'pdf' ? 'Downloading...' : 'Download as PDF'}
          </button>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-black py-2">
            Cancel
          </button>
        </div>

        {/* Off-screen ticket for PNG capture */}
        <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
          <div ref={captureRef} className="p-4" style={{ background: PAGE_BG }}>
            <TicketCard
              ticket={ticket}
              qrImageUrl={qrImageUrl}
              perforationColor={PAGE_BG}
            />
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function TicketViewModal({ ticket, onClose }) {
  const { qrImageUrl, loading, error } = useTicketQr(ticket.id);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-md flex flex-col items-start">
        <div
          className="w-full rounded-3xl p-4 sm:p-5 border border-white/40 shadow-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black font-extrabold text-lg">My Ticket</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <p className="text-left text-gray-500 text-sm py-12">Loading ticket...</p>
          )}
          {error && (
            <p className="text-left text-red-600 text-sm py-4">{error}</p>
          )}
          {!loading && !error && (
            <TicketCard
              ticket={ticket}
              qrImageUrl={qrImageUrl}
              perforationColor={PAGE_BG}
            />
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

const MyTicketsPage = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [downloadTicket, setDownloadTicket] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      onNavigate('/');
      return;
    }

    fetchTickets()
      .then((data) => setTickets(data.tickets || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, onNavigate]);

  const handleDownloadError = useCallback((message) => {
    setError(message);
    setDownloadTicket(null);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ background: PAGE_BG }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
          <p className="text-gray-500">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        <h1 className="text-2xl font-extrabold text-black mb-1">My Tickets</h1>
        <p className="text-gray-500 text-sm mb-8">Signed in as {user?.email}</p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        )}

        {tickets.length === 0 ? (
          <div className={`${glassCardClass} p-8 text-left text-gray-500`}>
            No tickets yet.{' '}
            <button type="button" onClick={() => onNavigate('/event')} className="font-bold" style={{ color: '#7A8FA8' }}>
              Browse events
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className={`${glassCardClass} p-5 sm:p-6`}>
                <div className="flex gap-4">
                  <img
                    src="/assets/images/art_gallery_poster.png"
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-black leading-tight">{ticket.event.title}</h2>
                    <p className="text-gray-500 text-xs mt-1">{formatListDate(ticket.event.startsAt)}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{ticket.event.venue}</p>
                    <p className="text-xs mt-2">
                      <span className="text-gray-400">Booking ID:</span>{' '}
                      <span className="font-mono font-semibold text-black">{ticket.confirmationCode}</span>
                    </p>
                    <p className="text-xs mt-1">
                      <span
                        className={
                          ticket.status === 'valid'
                            ? 'text-emerald-600 font-bold uppercase text-[10px]'
                            : 'text-gray-500 font-bold uppercase text-[10px]'
                        }
                      >
                        {ticket.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setViewingTicket(ticket)}
                    className={primaryBtnClass}
                    style={primaryBtnStyle}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadTicket(ticket)}
                    className={outlineBtnClass}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingTicket && (
        <TicketViewModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} />
      )}

      {downloadTicket && (
        <DownloadFormatModal
          ticket={downloadTicket}
          onClose={() => setDownloadTicket(null)}
          onError={handleDownloadError}
        />
      )}
    </div>
  );
};

export default MyTicketsPage;
