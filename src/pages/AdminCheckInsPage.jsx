import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetchCheckIns } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const BRAND_ACCENT = '#B8C5D6';
const PAGE_BG = '#F7F7F7';

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

const AdminCheckInsPage = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      onNavigate('/');
    }
  }, [user, authLoading, onNavigate]);

  const loadCheckIns = useCallback(() => {
    setLoading(true);
    setError(null);
    return adminFetchCheckIns()
      .then((data) => setCheckIns(data.checkIns || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'admin') return;
    loadCheckIns();
  }, [authLoading, user, loadCheckIns]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return checkIns;

    return checkIns.filter((row) => {
      const haystack = [
        row.attendeeName,
        row.confirmationCode,
        row.buyerEmail,
        row.buyerName,
        row.event?.title,
        row.checkedInBy,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [checkIns, query]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center" style={{ background: PAGE_BG }}>
        <p className="text-gray-700 font-medium">Loading...</p>
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
        <button
          type="button"
          onClick={() => onNavigate('/admin')}
          className="text-sm font-semibold text-gray-600 mb-5 hover:text-gray-900 transition-colors"
        >
          ← Back to dashboard
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Checked-in guests</h1>
            <p className="text-gray-600 text-sm mt-1">
              {loading
                ? 'Loading guest list…'
                : `${checkIns.length} guest${checkIns.length === 1 ? '' : 's'} checked in at the door`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('/admin/scanner')}
              className="px-5 py-3 rounded-full text-black text-sm font-bold transition-all hover:opacity-90 border border-gray-300 bg-white"
            >
              Open QR Scanner
            </button>
            <button
              type="button"
              onClick={loadCheckIns}
              disabled={loading}
              className="px-5 py-3 rounded-full text-black text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                backgroundColor: BRAND_ACCENT,
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-600">
              {filtered.length} of {checkIns.length} shown
            </p>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guest, booking ID, email…"
              className="w-full sm:w-72 px-3 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {error && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <p className="p-12 text-center text-gray-600 text-sm">Loading checked-in guests…</p>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-900 font-semibold">
                {checkIns.length === 0 ? 'No guests checked in yet' : 'No matches found'}
              </p>
              <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
                {checkIns.length === 0
                  ? 'Use the QR scanner to verify and check in attendees at the door.'
                  : 'Try a different search term.'}
              </p>
              {checkIns.length === 0 && (
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/scanner')}
                  className="mt-6 px-5 py-3 rounded-full text-black text-sm font-bold"
                  style={{ backgroundColor: BRAND_ACCENT }}
                >
                  Go to QR Scanner
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="lg:hidden p-4 sm:p-6 space-y-3">
                {filtered.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900">{row.attendeeName}</p>
                        <p className="text-xs font-mono text-gray-600 mt-0.5">{row.confirmationCode}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full shrink-0">
                        In
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{row.event?.title}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDateTime(row.checkedInAt)}</p>
                    <p className="text-xs text-gray-500 mt-1">{row.buyerEmail}</p>
                    {row.checkedInBy && (
                      <p className="text-xs text-gray-500 mt-1">Staff: {row.checkedInBy}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-gray-600 border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 font-bold">Checked in</th>
                      <th className="px-6 py-4 font-bold">Guest</th>
                      <th className="px-6 py-4 font-bold">Booking ID</th>
                      <th className="px-6 py-4 font-bold">Event</th>
                      <th className="px-6 py-4 font-bold">Buyer email</th>
                      <th className="px-6 py-4 font-bold">Staff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {formatDateTime(row.checkedInAt)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{row.attendeeName}</td>
                        <td className="px-6 py-4 font-mono text-gray-700">{row.confirmationCode}</td>
                        <td className="px-6 py-4 text-gray-900 max-w-[220px]">
                          <span className="line-clamp-2">{row.event?.title || '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{row.buyerEmail}</td>
                        <td className="px-6 py-4 text-gray-600">{row.checkedInBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCheckInsPage;
