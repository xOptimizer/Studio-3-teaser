import { useEffect, useState } from 'react';
import { adminCheckInTicket, adminVerifyTicket } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const AdminVerifyPage = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const qrToken = new URLSearchParams(window.location.search).get('t');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }
    if (!qrToken) {
      setError('No ticket token in URL');
      return;
    }

    adminVerifyTicket(qrToken)
      .then((data) => setResult({ ...data, qrToken }))
      .catch((err) => setError(err.message));
  }, [user, authLoading, qrToken, onNavigate]);

  const handleCheckIn = async () => {
    if (!qrToken) return;
    setCheckingIn(true);
    try {
      await adminCheckInTicket(qrToken);
      const data = await adminVerifyTicket(qrToken);
      setResult({ ...data, qrToken });
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
        <h1 className="text-2xl font-extrabold text-black mb-6">Ticket Verification</h1>

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
              </>
            )}
            {result.valid && (
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="mt-4 w-full py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm"
              >
                {checkingIn ? 'Checking in...' : 'Check in guest'}
              </button>
            )}
            <button
              onClick={() => onNavigate('/admin/scanner')}
              className="mt-3 w-full py-3 rounded-2xl border border-gray-300 font-bold text-sm"
            >
              Open scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifyPage;
