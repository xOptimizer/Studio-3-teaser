import { useCallback, useEffect, useState } from 'react';
import QrCameraScanner from '../components/QrCameraScanner';
import { adminCheckInTicket, adminVerifyTicket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './admin-scanner.css';

const BRAND_ACCENT = '#B8C5D6';
const PAGE_BG = '#F7F7F7';

function extractQrToken(value) {
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

function buildCheckInLookup(result) {
  if (result.ticket?.id) return { ticketId: result.ticket.id };
  if (result.lookup?.ticketId) return { ticketId: result.lookup.ticketId };
  if (result.lookup?.qrToken) return { qrToken: result.lookup.qrToken };
  if (result.lookup?.bookingId) return { bookingId: result.lookup.bookingId };
  return null;
}

function StatusBadge({ result }) {
  if (!result) return null;

  const config = result.valid
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

const AdminScanner = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [bookingId, setBookingId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
    }
  }, [user, authLoading, onNavigate]);

  const handleVerify = useCallback(async (lookup) => {
    if (!lookup || (!lookup.qrToken && !lookup.bookingId && !lookup.ticketId)) return;

    setError(null);
    setResult(null);
    setCameraActive(false);

    try {
      const data = await adminVerifyTicket(lookup);
      setResult({ ...data, lookup });
    } catch (err) {
      setError(err.message);
      setCameraActive(true);
    }
  }, []);

  const handleQrScan = useCallback(
    (decodedText) => {
      const qrToken = extractQrToken(decodedText);
      if (qrToken) {
        handleVerify({ qrToken });
      }
    },
    [handleVerify]
  );

  const handleBookingIdVerify = () => {
    const trimmed = bookingId.trim();
    if (!trimmed) {
      setError('Enter a booking ID (e.g. SSC-482917)');
      return;
    }
    handleVerify({ bookingId: trimmed });
  };

  const handleCheckIn = async () => {
    const lookup = buildCheckInLookup(result);
    if (!lookup) return;

    setCheckingIn(true);
    setError(null);
    try {
      await adminCheckInTicket(lookup);
      const data = await adminVerifyTicket(lookup);
      setResult({ ...data, lookup });
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setError(null);
    setBookingId('');
    setCameraActive(true);
  };

  if (authLoading) {
    return (
      <div className="admin-scanner-page min-h-screen pt-[120px] flex items-center justify-center" style={{ background: PAGE_BG }}>
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-scanner-page min-h-screen pt-[120px] flex items-center justify-center px-4" style={{ background: PAGE_BG }}>
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-gray-900 font-semibold text-lg">Admin login required</p>
          <p className="text-gray-600 text-sm mt-2">
            Sign in with an admin account, then open Admin → Open QR Scanner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-scanner-page min-h-screen pt-[120px] pb-24 px-4 sm:px-6" style={{ background: PAGE_BG }}>
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => onNavigate('/admin')}
          className="text-sm font-semibold text-gray-600 mb-5 hover:text-gray-900 transition-colors"
        >
          ← Back to dashboard
        </button>

        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Door check-in</p>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Scan or verify ticket</h1>
          <p className="text-sm text-gray-600 mt-2 max-w-xl">
            Scan the QR code, or enter the booking ID printed on the ticket (e.g. SSC-482917).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => onNavigate('/admin/check-ins')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full border border-gray-300 bg-white"
          >
            View checked-in guests
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">Camera scanner</h2>
            <QrCameraScanner onScan={handleQrScan} active={cameraActive} />
            {!cameraActive && (
              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50"
              >
                Restart camera
              </button>
            )}
          </section>

          <div className="space-y-5">
            <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900">Booking ID</h2>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Enter the code shown on the ticket under &quot;Booking ID&quot;.
              </p>
              <label htmlFor="booking-id" className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Booking ID
              </label>
              <input
                id="booking-id"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBookingIdVerify()}
                placeholder="SSC-482917"
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="button"
                onClick={handleBookingIdVerify}
                className="mt-3 w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Verify by booking ID
              </button>
            </section>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-sm border border-red-200">
                <p className="font-semibold">Verification failed</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {result && (
              <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">Result</h2>
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
                    className="mt-5 w-full py-3.5 rounded-2xl text-black font-bold text-sm disabled:opacity-50 transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: BRAND_ACCENT,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {checkingIn ? 'Checking in…' : 'Check in guest'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetScan}
                  className="mt-3 w-full py-3 rounded-2xl border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Verify another ticket
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;
