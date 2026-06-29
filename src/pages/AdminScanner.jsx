import { useCallback, useEffect, useState } from 'react';
import QrCameraScanner from '../components/QrCameraScanner';
import { useAuth } from '../context/AuthContext';
import { buildAdminVerifyPath, extractQrToken } from '../lib/adminVerify';
import { pageGradientStyle, ScannerSkeleton } from '../components/loading/PageLoaders';
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

const AdminScanner = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
    }
  }, [user, authLoading, onNavigate]);

  const goToVerify = useCallback(
    (lookup) => {
      setCameraActive(false);
      onNavigate(buildAdminVerifyPath(lookup));
    },
    [onNavigate]
  );

  const handleQrScan = useCallback(
    (decodedText) => {
      const qrToken = extractQrToken(decodedText);
      if (qrToken) {
        setError(null);
        goToVerify({ qrToken });
        return;
      }
      setError('Could not read a valid ticket QR code. Try again or enter the booking ID.');
    },
    [goToVerify]
  );

  const handleBookingIdVerify = () => {
    const trimmed = bookingId.trim();
    if (!trimmed) {
      setError('Enter a booking ID (e.g. SSC-482917)');
      return;
    }
    setError(null);
    goToVerify({ bookingId: trimmed });
  };

  if (authLoading) {
    return <ScannerSkeleton />;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div
        className="admin-scanner-page min-h-screen text-gray-900"
        style={{ ...pageGradientStyle, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24 flex items-center justify-center min-h-[50vh]">
          <div className={`${glassCardClass} max-w-md w-full p-6 text-left`}>
            <p className="text-gray-900 font-semibold text-lg">Admin login required</p>
            <p className="text-gray-600 text-sm mt-2">
              Sign in with an admin account, then open Admin → Open QR Scanner.
            </p>
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
          onClick={() => onNavigate('/admin')}
          className="text-sm font-semibold text-gray-600 mb-5 hover:text-gray-900 transition-colors"
        >
          ← Back to dashboard
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Door check-in</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
              Scan or verify ticket
            </h1>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              Scan the QR code or enter the booking ID. Guest details open on the next screen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/admin/check-ins')}
            className={`${outlineBtnClass} self-start lg:self-auto`}
          >
            View checked-in guests
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50/90 text-red-700 text-sm border border-red-100 text-left">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-start">
          <section className={`${glassCardClass} p-4 sm:p-6`}>
            <h2 className="text-base font-bold text-gray-900 mb-4">Camera scanner</h2>
            <QrCameraScanner onScan={handleQrScan} active={cameraActive} />
            {!cameraActive && (
              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="mt-4 w-full py-3 rounded-full border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50"
              >
                Restart camera
              </button>
            )}
          </section>

          <section className={`${glassCardClass} p-5 sm:p-6`}>
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
              className="mt-4 w-full py-3.5 rounded-full text-black font-bold text-sm hover:opacity-90 transition-opacity"
              style={primaryBtnStyle}
            >
              Verify by booking ID
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;
