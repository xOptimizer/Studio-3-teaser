import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CenteredPageLoader } from '../components/loading/PageLoaders';

const BRAND_ACCENT = '#B8C5D6';
const BRAND_ACCENT_SOFT = 'rgba(184, 197, 214, 0.35)';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

const inputClass =
  'w-full px-3 py-2.5 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black border border-gray-200 bg-white transition-all';

const primaryBtnClass =
  'py-3 px-5 rounded-full text-black font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50';

const primaryBtnStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  backgroundColor: BRAND_ACCENT,
  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
};

const SetPasswordPage = ({ onNavigate }) => {
  const { user, loading: authLoading, setInitialPassword } = useAuth();
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      onNavigate('/');
      return;
    }

    if (!user.mustChangePassword) {
      onNavigate('/tickets');
    }
  }, [user, authLoading, onNavigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await setInitialPassword(form.newPassword);
      onNavigate('/tickets');
    } catch (err) {
      setError(err.message || 'Could not set password');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user?.mustChangePassword) {
    return <CenteredPageLoader label="Loading…" />;
  }

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#F7F7F7', fontFamily: "'Inter', sans-serif" }}>
      <div
        className="absolute top-0 right-0 w-[35vw] h-[35vw] rounded-full blur-[120px] pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${BRAND_ACCENT_SOFT} 0%, rgba(255,255,255,0) 70%)` }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-[120px] pb-24">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Welcome</p>
          <h1 className="text-black font-extrabold text-2xl sm:text-3xl mt-1">Set your password</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Your account was created when you purchased your ticket. Choose a personal password to secure your account before viewing tickets.
          </p>
        </div>

        <div className={`${glassCardClass} p-6 sm:p-8`}>
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-black mb-1.5">
                New password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-black mb-1.5">
                Confirm password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
                placeholder="Re-enter your password"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(event) => setShowPasswords(event.target.checked)}
                className="rounded border-gray-300"
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={`${primaryBtnClass} w-full mt-2`}
              style={primaryBtnStyle}
            >
              {submitting ? 'Saving...' : 'Save password & continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
