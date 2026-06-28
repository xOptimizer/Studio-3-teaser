import { useEffect, useState } from 'react';
import { adminCheckInTicket, adminVerifyTicket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, pageGradientStyle, ScannerSkeleton } from '../components/loading/PageLoaders';
import './admin-scanner.css';

const BRAND_ACCENT = '#B8C5D6';

function StatusBadge({ result }) {
  if (!result) return null;

  const config =
    result.valid
      ? {
          label: 'Valid ticket',
          hint: 'Ready for check-in',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          dot: 'bg-emerald-500',
        }
      : result.result === 'already_used'
        ? {
            label: 'Already used',
            hint: 'This ticket was checked in before',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-900',
            dot: 'bg-amber-500',
          }
        : {
            label: 'Invalid ticket',
            hint: 'Not found, unpaid, or cancelled',
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            dot: 'bg-red-500',
          };

  return (
    <div className={`rounded-2xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${config.dot}`} />
        <div>
          <p className={`text-lg font-bold ${config.text}`}>{config.label}</p>
          <p className={`text-sm mt-0.5 ${config.text} opacity-80`}>{config.hint}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900 mt-1 break-words">{value}</p>
    </div>
  );
}

const AdminVerifyPage = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const qrToken = new URLSearchParams(window.location.search).get('t');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }
    if (!qrToken) {
      setError('No ticket token in URL');
      setVerifying(false);
      return;
    }

    adminVerifyTicket({ qrToken })
      .then((data) => setResult({ ...data, qrToken }))
      .catch((err) => setError(err.message))
      .finally(() => setVerifying(false));
  }, [user, authLoading, qrToken, onNavigate]);

  const handleCheckIn = async () => {
    if (!qrToken && !result?.ticket?.id) return;
    setCheckingIn(true);
    setError(null);
    try {
      const lookup = result?.ticket?.id ? { ticketId: result.ticket.id } : { qrToken };
      await adminCheckInTicket(lookup);
      const data = await adminVerifyTicket(lookup);
      setResult({ ...data, qrToken });
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  if (authLoading) {
    return <ScannerSkeleton />;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-scanner-page min-h-screen pt-[120px] flex items-center justify-center px-4" style={pageGradientStyle}>
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-gray-900 font-semibold text-lg">Admin login required</p>
          <p className="text-gray-600 text-sm mt-2">Log in as admin to verify this ticket.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-scanner-page min-h-screen pt-[120px] pb-24 px-4 sm:px-6" style={pageGradientStyle}>
      <div className="max-w-lg mx-auto">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Door check-in</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-6">Ticket verification</h1>

        {verifying && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/80 p-10 shadow-sm">
            <LoadingSpinner label="Verifying ticket…" size="lg" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-sm border border-red-200 mb-4">
            <p className="font-semibold">Verification failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {result && !verifying && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
            <StatusBadge result={result} />

            {result.ticket && (
              <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 px-4">
                <DetailRow label="Attendee" value={result.ticket.attendeeName} />
                <DetailRow label="Event" value={result.ticket.event?.title} />
                <DetailRow label="Venue" value={result.ticket.event?.venue} />
                <DetailRow label="Booking code" value={result.ticket.confirmationCode} />
                <DetailRow label="Status" value={result.ticket.status} />
              </div>
            )}

            {result.valid && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="mt-5 w-full py-3.5 rounded-2xl text-black font-bold text-sm disabled:opacity-50"
                style={{ backgroundColor: BRAND_ACCENT, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
              >
                {checkingIn ? 'Checking in…' : 'Check in guest'}
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('/admin/scanner')}
              className="mt-3 w-full py-3 rounded-2xl border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50"
            >
              Open scanner
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminVerifyPage;
