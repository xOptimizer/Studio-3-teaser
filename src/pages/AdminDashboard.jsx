import { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  adminFetchOrders,
  adminFetchTicketQrBlob,
  adminResendOrderTickets,
} from '../lib/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';

const BRAND_ACCENT = '#B8C5D6';
const PAGE_BG = '#F7F7F7';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

const actionBtnClass =
  'w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed';

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

      {loading && <p className="text-gray-600 text-sm py-12">Loading ticket...</p>}
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

function StatCard({ label, value, sub }) {
  return (
    <div className={`${glassCardClass} p-4 sm:p-5 text-gray-900`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">{label}</p>
      <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
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
      className={`${glassCardClass} p-4 sm:p-5 space-y-3 text-gray-900 cursor-pointer hover:bg-white/70 transition-colors`}
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

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }

    adminFetchOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, onNavigate]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidOrder(o.status));
    const revenueCents = paidOrders.reduce((sum, o) => sum + (o.amountCents || 0), 0);
    const ticketsSold = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      revenueCents,
      ticketsSold,
    };
  }, [orders]);

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
    return (
      <div className="min-h-screen text-gray-900" style={{ background: PAGE_BG, color: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
          <p className="text-gray-600 text-sm">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{ background: PAGE_BG, fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Orders, revenue, and door check-in</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/admin/scanner')}
            className="self-start lg:self-auto px-5 py-3 rounded-full text-black text-sm font-bold transition-all hover:opacity-90"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              backgroundColor: BRAND_ACCENT,
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            Open QR Scanner
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
            {success}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total orders" value={stats.totalOrders} />
          <StatCard label="Paid orders" value={stats.paidOrders} />
          <StatCard label="Tickets sold" value={stats.ticketsSold} />
          <StatCard label="Revenue" value={formatMoney(stats.revenueCents)} sub="Paid orders only" />
        </div>

        <div className={`${glassCardClass} overflow-hidden text-gray-900`}>
          <div className="p-4 sm:p-6 border-b border-gray-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">Recent orders</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {filteredOrders.length} of {orders.length} shown
              </p>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, event..."
              className="w-full sm:w-64 px-3 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="p-8 sm:p-12 text-center text-gray-600 text-sm">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </p>
          ) : (
            <>
              <div className="lg:hidden p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

              <div className="hidden lg:block overflow-x-auto bg-white/80">
                <table className="w-full text-sm text-gray-900">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-gray-600 border-b border-gray-200 bg-white/90">
                      <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Buyer</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Event</th>
                      <th className="px-6 py-4 font-bold text-center text-gray-700">Qty</th>
                      <th className="px-6 py-4 font-bold text-right text-gray-700">Amount</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                      <th className="px-6 py-4 font-bold text-gray-700">Tickets</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {filteredOrders.map((order) => {
                      const canAct = isPaidOrder(order.status) && (order.tickets?.length || 0) > 0;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => setDetailOrder(order)}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 min-w-[180px]">
                            <div className="font-semibold text-gray-900">{order.user?.name || 'Guest'}</div>
                            <div className="text-gray-600 text-xs truncate max-w-[220px]">
                              {order.buyerEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium max-w-[200px]">
                            <span className="line-clamp-2">{order.event?.title || '—'}</span>
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-gray-900 tabular-nums">
                            {order.quantity ?? '—'}
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-gray-900 tabular-nums">
                            {formatMoney(order.amountCents)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 min-w-[160px]">
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
