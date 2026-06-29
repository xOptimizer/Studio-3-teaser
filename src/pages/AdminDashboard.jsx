import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  adminFetchOrders,
  adminFetchStats,
  adminFetchFreePasses,
  adminFetchTicketQrBlob,
  adminResendOrderTickets,
} from '../lib/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import AdminFreePassPanel from '../components/AdminFreePassPanel';
import { DashboardSkeleton, TicketCardSkeleton } from '../components/loading/PageLoaders';
import { STUDIO_EVENT } from '../constants/event';

const BRAND_ACCENT = '#B8C5D6';
const PAGE_BG = '#F7F7F7';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

const actionBtnClass =
  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100';

function EyeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function SendIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
      style={{ transform: 'rotate(45deg)' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

const formatMoney = (cents) =>
  `$${(Number(cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const isPaidOrder = (status) =>
  ['paid', 'succeeded', 'completed', 'success'].includes(String(status || '').toLowerCase());

const statusStyles = (status) => {
  const key = String(status || '').toLowerCase();
  if (['paid', 'succeeded', 'completed', 'success'].includes(key)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }
  if (['pending', 'processing'].includes(key)) {
    return 'bg-amber-50 text-amber-700 border-amber-100';
  }
  if (['failed', 'cancelled', 'canceled', 'refunded'].includes(key)) {
    return 'bg-red-50 text-red-700 border-red-100';
  }
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

function ticketForCard(ticket, order) {
  return {
    id: ticket.id,
    confirmationCode: ticket.confirmationCode,
    status: ticket.status,
    attendeeName: ticket.attendeeName,
    event: {
      title: order.event?.title,
      venue: order.event?.venue,
      address: order.event?.address,
      startsAt: order.event?.startsAt,
      endsAt: order.event?.endsAt,
    },
  };
}

function useAdminTicketQr(ticketId) {
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticketId) return undefined;

    let objectUrl = null;
    let cancelled = false;
    setLoading(true);
    setError(null);

    adminFetchTicketQrBlob(ticketId)
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

function HomeGlassModal({ children, onClose, maxWidth = '600px' }) {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md"
        onClick={onClose}
        style={{
          boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)',
        }}
      />
      <div
        className="relative z-10 rounded-3xl p-8 md:p-10 w-full border border-white border-opacity-20 shadow-2xl overflow-y-auto text-gray-900"
        style={{
          maxHeight: '90vh',
          maxWidth,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5 border-b border-gray-200/70 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span
        className={`text-sm text-gray-900 text-right font-medium ${mono ? 'font-mono break-all' : ''}`}
      >
        {value || '—'}
      </span>
    </div>
  );
}

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

function OrderDetailModal({ order, onClose, onViewTickets, onResend, resending }) {
  const canAct = isPaidOrder(order.status) && (order.tickets?.length || 0) > 0;
  const tickets = order.tickets || [];

  return (
    <HomeGlassModal onClose={onClose} maxWidth="720px">
      <div className="mb-6 pr-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-black">Order Details</h2>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-gray-600 text-sm">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Buyer</p>
          <DetailRow label="Name" value={order.user?.name || 'Guest'} />
          <DetailRow label="Email" value={order.buyerEmail} />
          <DetailRow label="Phone" value={order.buyerPhone} />
          <DetailRow label="Quantity" value={String(order.quantity ?? '—')} />
          <DetailRow label="Amount" value={formatMoney(order.amountCents)} />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Event</p>
          <DetailRow label="Title" value={order.event?.title} />
          <DetailRow label="Venue" value={order.event?.venue} />
          <DetailRow label="Date" value={formatEventDate(order.event?.startsAt)} />
          <DetailRow label="Address" value={order.event?.address} />
          <DetailRow label="Order ID" value={order.id} mono />
          {order.finixTransferId && (
            <DetailRow label="Payment ref" value={order.finixTransferId} mono />
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200/70">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
          Tickets ({tickets.length})
        </p>
        {tickets.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets issued yet</p>
        ) : (
          <div className="space-y-0 max-h-44 overflow-y-auto">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-200/70 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Ticket {index + 1} · {ticket.attendeeName}
                  </p>
                  <p className="text-xs font-mono text-gray-600 mt-0.5">{ticket.confirmationCode}</p>
                  {ticket.checkedInAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Checked in {formatDateTime(ticket.checkedInAt)}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase text-gray-600 shrink-0">
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {canAct && (
        <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-200/70">
          <button
            type="button"
            onClick={() => onViewTickets(order)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-black transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND_ACCENT }}
          >
            <EyeIcon className="w-4 h-4" />
            View tickets
          </button>
          <button
            type="button"
            onClick={() => onResend(order)}
            disabled={resending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {resending ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <SendIcon />
            )}
            {resending ? 'Sending…' : 'Resend tickets'}
          </button>
        </div>
      )}
    </HomeGlassModal>
  );
}

function AdminTicketViewModal({ ticket, order, onClose }) {
  const cardTicket = ticketForCard(ticket, order);
  const { qrImageUrl, loading, error } = useAdminTicketQr(ticket.id);

  return (
    <HomeGlassModal onClose={onClose} maxWidth="420px">
      <div className="mb-4 pr-8">
        <h2 className="text-2xl font-bold text-black">Ticket</h2>
        <p className="text-gray-600 text-sm mt-1">
          {order.buyerEmail} · {ticket.confirmationCode}
        </p>
      </div>

      {loading && <TicketCardSkeleton />}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}
      {!loading && !error && (
        <TicketCard ticket={cardTicket} qrImageUrl={qrImageUrl} perforationColor={PAGE_BG} />
      )}
    </HomeGlassModal>
  );
}

function OrderTicketsModal({ order, onClose }) {
  const [viewingTicket, setViewingTicket] = useState(null);
  const tickets = order.tickets || [];

  return (
    <>
      <HomeGlassModal onClose={onClose} maxWidth="520px">
        <div className="mb-6 pr-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">Order tickets</h2>
          <p className="text-gray-600 text-sm mt-1">{order.buyerEmail}</p>
          <p className="text-gray-500 text-xs mt-0.5">{order.event?.title}</p>
        </div>

        <div className="space-y-0 max-h-[60vh] overflow-y-auto">
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-gray-200/70 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Ticket {index + 1} · {ticket.attendeeName}
                </p>
                <p className="text-xs text-gray-600 font-mono truncate">{ticket.confirmationCode}</p>
                <p className="text-[10px] font-bold uppercase mt-1 text-gray-600">{ticket.status}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingTicket(ticket)}
                className={actionBtnClass}
                style={{ backgroundColor: BRAND_ACCENT, color: '#111827' }}
                aria-label={`View ticket ${ticket.confirmationCode}`}
                title="View ticket"
              >
                <EyeIcon />
              </button>
            </div>
          ))}
        </div>
      </HomeGlassModal>

      {viewingTicket && (
        <AdminTicketViewModal
          ticket={viewingTicket}
          order={order}
          onClose={() => setViewingTicket(null)}
        />
      )}
    </>
  );
}

function EarlyBirdStatsCard({ stats }) {
  if (!stats) return null;

  const { earlyBirdSold, earlyBirdRemaining, earlyBirdLimit, event } = stats;
  const earlyBirdPrice = ((event?.earlyBirdPriceCents ?? 4995) / 100).toFixed(2);
  const regularPrice = ((event?.regularPriceCents ?? 9995) / 100).toFixed(2);
  const soldPct = earlyBirdLimit > 0 ? Math.min(100, (earlyBirdSold / earlyBirdLimit) * 100) : 0;
  const soldOut = earlyBirdRemaining === 0;

  return (
    <div className={`${glassCardClass} p-4 sm:p-5 mb-6 sm:mb-8 text-gray-900`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Early bird</p>
          <p className="text-sm text-gray-700 mt-1">
            ${earlyBirdPrice} tickets · first {earlyBirdLimit} sold
            {soldOut ? ' · sold out' : ''}
          </p>
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 sm:flex-none min-w-[120px] rounded-2xl bg-white/80 border border-gray-100 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">Sold</p>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums mt-0.5">
              {earlyBirdSold}
              <span className="text-sm font-semibold text-gray-500"> / {earlyBirdLimit}</span>
            </p>
          </div>
          <div className="flex-1 sm:flex-none min-w-[120px] rounded-2xl bg-white/80 border border-gray-100 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">Left</p>
            <p className={`text-2xl font-extrabold tabular-nums mt-0.5 ${soldOut ? 'text-gray-400' : 'text-emerald-700'}`}>
              {earlyBirdRemaining}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${soldOut ? 'bg-gray-400' : 'bg-emerald-500'}`}
          style={{ width: `${soldPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {soldOut
          ? `Early bird is full — new sales are at $${regularPrice}.`
          : `${earlyBirdRemaining} early bird seat${earlyBirdRemaining === 1 ? '' : 's'} remaining before price increases to $${regularPrice}.`}
      </p>
    </div>
  );
}

const isFreePassOrder = (order) =>
  order.isFreePass ||
  (isPaidOrder(order.status) && (order.amountCents || 0) === 0 && !order.finixTransferId);

const STAT_ICONS = {
  orders: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  paid: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tickets: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  checkin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4v1m6 11h2m-18 0h2m15-6.5V9a3 3 0 00-3-3h-2.5M6 8.5V9a3 3 0 003 3h2.5M9 12a3 3 0 006 0" />
    </svg>
  ),
  revenue: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  gift: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
};

function StatCard({ label, value, sub, icon, accent = BRAND_ACCENT, onClick }) {
  const baseClass =
    'group relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 backdrop-blur-sm p-4 sm:p-5 text-left w-full transition-all duration-300 ease-out';
  const interactiveClass = onClick
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200/80 active:translate-y-0'
    : 'hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5';

  const content = (
    <>
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.12] transition-transform duration-300 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, transparent 70%)` }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${accent}33`, color: '#374151' }}
        >
          {icon}
        </div>
      </div>
      <div className="relative mt-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tabular-nums tracking-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-500 mt-1.5">{sub}</p>}
        {onClick && (
          <p className="text-[10px] text-gray-400 mt-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View details →
          </p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClass} ${interactiveClass}`}>
        {content}
      </button>
    );
  }

  return <div className={`${baseClass} ${interactiveClass}`}>{content}</div>;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${statusStyles(status)}`}
    >
      {status || 'unknown'}
    </span>
  );
}

function OrderTicketActions({ order, onView, onResend, resending, canAct }) {
  if (!canAct) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const stop = (e) => e.stopPropagation();

  return (
    <div className="flex flex-wrap items-center gap-2" onClick={stop} onKeyDown={stop} role="presentation">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onView(order);
        }}
        className={actionBtnClass}
        style={{ backgroundColor: BRAND_ACCENT, color: '#111827' }}
        aria-label="View tickets"
        title="View tickets"
      >
        <EyeIcon />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onResend(order);
        }}
        disabled={resending}
        className={`${actionBtnClass} border border-gray-300 bg-white text-gray-900 hover:bg-gray-50`}
        aria-label="Resend tickets"
        title={resending ? 'Sending…' : 'Resend tickets'}
      >
        {resending ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <SendIcon />
        )}
      </button>
    </div>
  );
}

function OrderCard({ order, onSelect, onView, onResend, resendingId }) {
  const canAct = isPaidOrder(order.status) && (order.tickets?.length || 0) > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(order);
        }
      }}
      className={`${glassCardClass} p-4 sm:p-5 space-y-3 text-gray-900 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/80`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{order.user?.name || 'Guest'}</p>
          <p className="text-xs text-gray-600 truncate">{order.buyerEmail}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px]">Event</p>
          <p className="font-semibold text-gray-900 mt-0.5 line-clamp-2">{order.event?.title || '—'}</p>
        </div>
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px]">Date</p>
          <p className="font-semibold text-gray-900 mt-0.5">{formatDateTime(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px]">Qty</p>
          <p className="font-semibold text-gray-900 mt-0.5 tabular-nums">{order.quantity ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px]">Amount</p>
          <p className="font-extrabold text-gray-900 mt-0.5 tabular-nums">{formatMoney(order.amountCents)}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Tickets</p>
        <OrderTicketActions
          order={order}
          onView={onView}
          onResend={onResend}
          resending={resendingId === order.id}
          canAct={canAct}
        />
      </div>

      <p className="text-[10px] text-gray-500 font-mono truncate">Order {order.id}</p>
    </div>
  );
}

const AdminDashboard = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [query, setQuery] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [freePasses, setFreePasses] = useState([]);
  const [freePassExpanded, setFreePassExpanded] = useState(false);
  const [listTab, setListTab] = useState('orders');
  const freePassPanelRef = useRef(null);

  const openFreePassPanel = useCallback(() => {
    setFreePassExpanded(true);
    requestAnimationFrame(() => {
      freePassPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const loadDashboard = useCallback(() => {
    return Promise.all([
      adminFetchOrders().then((data) => setOrders(data.orders || [])),
      adminFetchStats().then((data) => setTicketStats(data)).catch(() => setTicketStats(null)),
      adminFetchFreePasses()
        .then((data) => setFreePasses(data.freePasses || []))
        .catch(() => setFreePasses([])),
    ]).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }

    setLoading(true);
    loadDashboard().finally(() => setLoading(false));
  }, [user, authLoading, onNavigate, loadDashboard]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidOrder(o.status));
    const revenueCents = paidOrders.reduce((sum, o) => sum + (o.amountCents || 0), 0);
    const orderTicketsSold = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
    const orderCheckIns = orders.reduce(
      (sum, o) => sum + (o.tickets?.filter((t) => t.status === 'used').length || 0),
      0
    );
    const freePassCheckIns = freePasses.filter((p) => p.status === 'used').length;

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      revenueCents,
      ticketsSold: ticketStats?.ticketsSold ?? orderTicketsSold,
      freePassesGiven: ticketStats?.freePassesIssued ?? freePasses.length,
      checkedInCount: orderCheckIns + freePassCheckIns,
    };
  }, [orders, freePasses, ticketStats]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      const haystack = [
        order.user?.name,
        order.buyerEmail,
        order.event?.title,
        order.status,
        order.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, query]);

  const filteredFreePasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return freePasses;

    return freePasses.filter((pass) => {
      const haystack = [
        pass.attendeeName,
        pass.email,
        pass.event?.title,
        pass.confirmationCode,
        pass.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [freePasses, query]);

  const handleResend = useCallback(async (order) => {
    if (!window.confirm(`Resend ticket email to ${order.buyerEmail}?`)) return;

    setResendingId(order.id);
    setError(null);
    setSuccess(null);

    try {
      const data = await adminResendOrderTickets(order.id);
      setSuccess(data.message || `Tickets resent to ${order.buyerEmail}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendingId(null);
    }
  }, []);

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        background: `linear-gradient(180deg, ${PAGE_BG} 0%, #EEF1F5 100%)`,
        fontFamily: "'Inter', sans-serif",
        color: '#111827',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Studio 3 Admin</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Monitor orders, issue complimentary passes, and manage door check-in — all in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={openFreePassPanel}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: STUDIO_EVENT.bannerGradient,
                boxShadow: '0 8px 24px rgba(230, 81, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.12)',
              }}
            >
              <svg className="w-4 h-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Issue free passes
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/scanner')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-gray-900 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                backgroundColor: BRAND_ACCENT,
                color: '#111827',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              }}
            >
              <svg
                className="w-4 h-4 shrink-0 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 17.25h1.875v1.875M17.25 21h1.875M21 17.25v1.875M21 21h1.875M21 21v1.875M21 17.25h1.875"
                />
              </svg>
              Open QR Scanner
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50/90 text-red-700 text-sm border border-red-100/80 backdrop-blur-sm animate-fadeIn">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50/90 text-emerald-800 text-sm border border-emerald-100/80 backdrop-blur-sm animate-fadeIn">
            {success}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <StatCard label="Total orders" value={stats.totalOrders} icon={STAT_ICONS.orders} accent="#94A3B8" />
          <StatCard label="Paid orders" value={stats.paidOrders} icon={STAT_ICONS.paid} accent="#34D399" />
          <StatCard label="Tickets sold" value={stats.ticketsSold} icon={STAT_ICONS.tickets} accent={BRAND_ACCENT} />
          <StatCard
            label="Checked in"
            value={stats.checkedInCount}
            sub="At the door"
            icon={STAT_ICONS.checkin}
            accent="#60A5FA"
            onClick={() => onNavigate('/admin/check-ins')}
          />
          <StatCard
            label="Revenue"
            value={formatMoney(stats.revenueCents)}
            sub="Paid orders"
            icon={STAT_ICONS.revenue}
            accent="#FBBF24"
          />
          <StatCard
            label="Free passes"
            value={stats.freePassesGiven}
            sub="Complimentary"
            icon={STAT_ICONS.gift}
            accent="#C084FC"
          />
        </div>

        <EarlyBirdStatsCard stats={ticketStats} />

        <AdminFreePassPanel
          panelRef={freePassPanelRef}
          expanded={freePassExpanded}
          onExpandedChange={setFreePassExpanded}
          onIssued={() => {
            setError(null);
            loadDashboard();
          }}
          onError={(msg) => setError(msg || null)}
          onSuccess={(msg) => {
            setError(null);
            setSuccess(msg);
          }}
        />

        <div className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-sm shadow-sm overflow-hidden text-gray-900">
          <div className="p-4 sm:p-6 flex flex-col gap-4 border-b border-gray-100/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">Orders & passes</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {listTab === 'orders'
                    ? `${filteredOrders.length} of ${orders.length} orders`
                    : `${filteredFreePasses.length} of ${freePasses.length} free passes`}
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, event..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setListTab('orders')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  listTab === 'orders'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white/80 text-gray-600 border border-gray-200 hover:bg-white'
                }`}
              >
                Orders
                {orders.length > 0 && (
                  <span className={`ml-1.5 tabular-nums ${listTab === 'orders' ? 'text-white/70' : 'text-gray-400'}`}>
                    ({orders.length})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setListTab('freePasses')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  listTab === 'freePasses'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white/80 text-gray-600 border border-gray-200 hover:bg-white'
                }`}
              >
                Free passes
                {freePasses.length > 0 && (
                  <span className={`ml-1.5 tabular-nums ${listTab === 'freePasses' ? 'text-white/70' : 'text-gray-400'}`}>
                    ({freePasses.length})
                  </span>
                )}
              </button>
            </div>
          </div>

          {listTab === 'orders' && filteredOrders.length === 0 ? (
            <p className="px-6 pb-12 pt-4 text-center text-gray-500 text-sm">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </p>
          ) : listTab === 'freePasses' && filteredFreePasses.length === 0 ? (
            <p className="px-6 pb-12 pt-4 text-center text-gray-500 text-sm">
              {freePasses.length === 0 ? 'No free passes issued yet.' : 'No free passes match your search.'}
            </p>
          ) : listTab === 'freePasses' ? (
            <>
              <div className="hidden lg:block px-4 sm:px-6 pb-6 pt-4">
                <div className="rounded-2xl overflow-hidden border border-gray-100/80">
                  <table className="w-full text-sm text-gray-900 border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest text-gray-500 bg-[#F3F4F6]/80">
                        <th className="px-5 py-3.5 font-bold">Issued</th>
                        <th className="px-5 py-3.5 font-bold">Guest</th>
                        <th className="px-5 py-3.5 font-bold">Event</th>
                        <th className="px-5 py-3.5 font-bold">Code</th>
                        <th className="px-5 py-3.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFreePasses.map((pass, index) => {
                        const isEven = index % 2 === 0;
                        return (
                          <tr
                            key={pass.id}
                            className={`${isEven ? 'bg-white/90' : 'bg-[#F8F9FB]/90'}`}
                          >
                            <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-xs">
                              {formatDateTime(pass.issuedAt)}
                            </td>
                            <td className="px-5 py-4 min-w-[180px]">
                              <div className="font-semibold text-gray-900">{pass.attendeeName}</div>
                              <div className="text-gray-500 text-xs truncate max-w-[220px] mt-0.5">{pass.email}</div>
                            </td>
                            <td className="px-5 py-4 text-gray-800 font-medium max-w-[200px]">
                              <span className="line-clamp-2">{pass.event?.title || '—'}</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-gray-700">{pass.confirmationCode}</td>
                            <td className="px-5 py-4">
                              <StatusBadge status={pass.status === 'used' ? 'used' : 'valid'} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="lg:hidden px-4 sm:px-6 pb-6 pt-4 space-y-3">
                {filteredFreePasses.map((pass) => (
                  <div key={pass.id} className="rounded-2xl border border-gray-100 bg-white/90 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{pass.attendeeName}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{pass.email}</p>
                      </div>
                      <StatusBadge status={pass.status === 'used' ? 'used' : 'valid'} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{pass.event?.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1 font-mono">{pass.confirmationCode}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{formatDateTime(pass.issuedAt)}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="lg:hidden px-4 sm:px-6 pb-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onSelect={setDetailOrder}
                    onView={setViewingOrder}
                    onResend={handleResend}
                    resendingId={resendingId}
                  />
                ))}
              </div>

              <div className="hidden lg:block px-4 sm:px-6 pb-6 pt-4">
                <div className="rounded-2xl overflow-hidden border border-gray-100/80">
                  <table className="w-full text-sm text-gray-900 border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest text-gray-500 bg-[#F3F4F6]/80">
                        <th className="px-5 py-3.5 font-bold">Date</th>
                        <th className="px-5 py-3.5 font-bold">Buyer</th>
                        <th className="px-5 py-3.5 font-bold">Event</th>
                        <th className="px-5 py-3.5 font-bold text-center">Qty</th>
                        <th className="px-5 py-3.5 font-bold text-right">Amount</th>
                        <th className="px-5 py-3.5 font-bold">Status</th>
                        <th className="px-5 py-3.5 font-bold">Tickets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => {
                        const canAct = isPaidOrder(order.status) && (order.tickets?.length || 0) > 0;
                        const isEven = index % 2 === 0;
                        return (
                          <tr
                            key={order.id}
                            onClick={() => setDetailOrder(order)}
                            className={`transition-colors duration-150 cursor-pointer ${
                              isEven ? 'bg-white/90' : 'bg-[#F8F9FB]/90'
                            } hover:bg-[#EEF2F7]/90`}
                          >
                            <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-xs">
                              {formatDateTime(order.createdAt)}
                            </td>
                            <td className="px-5 py-4 min-w-[180px]">
                              <div className="font-semibold text-gray-900">{order.user?.name || 'Guest'}</div>
                              <div className="text-gray-500 text-xs truncate max-w-[220px] mt-0.5">
                                {order.buyerEmail}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-800 font-medium max-w-[200px]">
                              <span className="line-clamp-2">{order.event?.title || '—'}</span>
                            </td>
                            <td className="px-5 py-4 text-center font-semibold text-gray-900 tabular-nums">
                              {order.quantity ?? '—'}
                            </td>
                            <td className="px-5 py-4 text-right font-bold text-gray-900 tabular-nums">
                              {isFreePassOrder(order) ? (
                                <span className="text-violet-600 text-xs font-bold uppercase tracking-wide">Free</span>
                              ) : (
                                formatMoney(order.amountCents)
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-5 py-4 min-w-[120px]">
                              <OrderTicketActions
                                order={order}
                                onView={setViewingOrder}
                                onResend={handleResend}
                                resending={resendingId === order.id}
                                canAct={canAct}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onViewTickets={(order) => {
            setDetailOrder(null);
            setViewingOrder(order);
          }}
          onResend={handleResend}
          resending={resendingId === detailOrder.id}
        />
      )}

      {viewingOrder && (
        <OrderTicketsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
