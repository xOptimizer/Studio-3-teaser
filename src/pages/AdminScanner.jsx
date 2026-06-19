import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { adminCheckInTicket, adminVerifyTicket } from '../lib/api';
import { useAuth } from '../context/AuthContext';

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

const AdminScanner = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const scannerRef = useRef(null);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
    }
  }, [user, authLoading, onNavigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        const token = extractQrToken(decodedText);
        if (token) {
          await handleVerify(token);
        }
      },
      () => {}
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => undefined);
    };
  }, [user]);

  const handleVerify = async (qrToken) => {
    setError(null);
    setResult(null);
    try {
      const data = await adminVerifyTicket(qrToken);
      setResult({ ...data, qrToken });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckIn = async () => {
    if (!result?.qrToken) return;
    setCheckingIn(true);
    setError(null);
    try {
      await adminCheckInTicket(result.qrToken);
      await handleVerify(result.qrToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24 px-4" style={{ background: '#F7F7F7' }}>
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => onNavigate('/admin')}
          className="text-sm text-gray-500 mb-4 hover:text-black"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-2xl font-extrabold text-black mb-6">Scan Ticket QR</h1>

        <div id="qr-reader" className="rounded-3xl overflow-hidden bg-white mb-6" />

        <div className="bg-white rounded-3xl p-4 mb-6">
          <label className="text-xs font-bold text-gray-500 uppercase">Manual token</label>
          <input
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste QR token or scan URL"
            className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-200 text-sm"
          />
          <button
            onClick={() => handleVerify(extractQrToken(manualToken) || manualToken)}
            className="mt-3 w-full py-3 rounded-2xl bg-black text-white font-bold text-sm"
          >
            Verify
          </button>
        </div>

        {error && <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm mb-4">{error}</div>}

        {result && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <p
              className={`text-lg font-bold mb-2 ${
                result.valid ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {result.valid ? 'Valid ticket' : result.result === 'already_used' ? 'Already used' : 'Invalid'}
            </p>
            {result.ticket && (
              <>
                <p className="text-sm"><strong>Attendee:</strong> {result.ticket.attendeeName}</p>
                <p className="text-sm"><strong>Event:</strong> {result.ticket.event?.title}</p>
                <p className="text-sm"><strong>Code:</strong> {result.ticket.confirmationCode}</p>
                <p className="text-sm"><strong>Status:</strong> {result.ticket.status}</p>
              </>
            )}
            {result.valid && (
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="mt-4 w-full py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm disabled:opacity-50"
              >
                {checkingIn ? 'Checking in...' : 'Check in guest'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScanner;
