import { useEffect, useMemo, useState } from 'react';
import { adminCheckInTicket, adminVerifyTicket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { TicketVerificationPanel } from '../components/admin/TicketVerificationPanel';
import { buildCheckInLookup, parseAdminVerifySearch } from '../lib/adminVerify';
import { LoadingSpinner, pageGradientStyle, ScannerSkeleton } from '../components/loading/PageLoaders';
import './admin-scanner.css';

const BRAND_ACCENT = '#B8C5D6';

const glassCardClass =
  'bg-white/70 border border-white/80 rounded-3xl backdrop-blur-sm shadow-sm';

const outlineBtnClass =
  'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-gray-900 text-sm font-bold border border-gray-300 bg-white hover:bg-gray-50 transition-all';

const primaryBtnStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

function AdminVerifyPage({ onNavigate }) {
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const { lookup, label } = useMemo(() => parseAdminVerifySearch(window.location.search), []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }
    if (!lookup) {
      setError('No ticket to verify. Scan a QR code or enter a booking ID from the scanner.');
      setVerifying(false);
      return;
    }

    setVerifying(true);
    setError(null);
    setResult(null);

    adminVerifyTicket(lookup)
      .then((data) => setResult({ ...data, lookup }))
      .catch((err) => setError(err.message))
      .finally(() => setVerifying(false));
  }, [user, authLoading, lookup, onNavigate]);

  const handleCheckIn = async () => {
    const checkInLookup = buildCheckInLookup(result, lookup);
    if (!checkInLookup) return;

    setCheckingIn(true);
    setError(null);
    try {
      await adminCheckInTicket(checkInLookup);
      const data = await adminVerifyTicket(checkInLookup);
      setResult({ ...data, lookup: checkInLookup });
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
      <div
        className="admin-scanner-page min-h-screen text-gray-900 text-left"
        style={{ ...pageGradientStyle, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
          <div className={`${glassCardClass} max-w-lg p-8`}>
            <p className="text-gray-900 font-bold text-lg">Admin login required</p>
            <p className="text-gray-600 text-sm mt-2">Log in with an admin account to verify tickets at the door.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-scanner-page min-h-screen text-gray-900 text-left"
      style={{ ...pageGradientStyle, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        <button
          type="button"
          onClick={() => onNavigate('/admin/scanner')}
          className="text-sm font-semibold text-gray-600 mb-5 hover:text-gray-900 transition-colors"
        >
          ← Back to scanner
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Door check-in</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
              Ticket verification
            </h1>
            <p className="text-gray-600 text-sm mt-1 max-w-2xl">
              {label ? `Showing results for ${label}.` : 'Review guest details and check them in when valid.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 self-start lg:self-auto">
            <button type="button" onClick={() => onNavigate('/admin/scanner')} className={outlineBtnClass}>
              Scan another
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/check-ins')}
              className="inline-flex items-center justify-center px-5 py-3 rounded-full text-black text-sm font-bold transition-all hover:opacity-90"
              style={primaryBtnStyle}
            >
              View checked-in guests
            </button>
          </div>
        </div>

        <div className="w-full">
          {verifying && (
            <div className={`${glassCardClass} p-8 sm:p-12 lg:p-14`}>
              <LoadingSpinner label="Verifying ticket…" size="lg" />
            </div>
          )}

          {!verifying && !lookup && (
            <div className={`${glassCardClass} p-8 sm:p-10`}>
              <p className="font-bold text-gray-900 text-lg">No ticket to verify</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
              <button
                type="button"
                onClick={() => onNavigate('/admin/scanner')}
                className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full text-black font-bold text-sm hover:opacity-90 transition-opacity"
                style={primaryBtnStyle}
              >
                Open scanner
              </button>
            </div>
          )}

          {!verifying && lookup && (
            <TicketVerificationPanel
              result={result}
              error={error}
              checkingIn={checkingIn}
              onCheckIn={handleCheckIn}
              onScanAnother={() => onNavigate('/admin/scanner')}
              scanAnotherLabel="Scan another ticket"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminVerifyPage;
