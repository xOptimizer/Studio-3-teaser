import { useEffect, useRef, useState } from 'react';
import {
  changePassword,
  fetchProfile,
  resolveProfilePhotoUrl,
  updateProfilePhone,
  uploadProfilePhoto,
} from '../lib/api';
import { formatPhoneDisplay, formatUSPhone, parseUSPhoneForInput, toE164US } from '../lib/phone';
import { useAuth } from '../context/AuthContext';

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

const outlineBtnClass =
  'py-3 px-5 rounded-full text-black font-bold text-sm border border-gray-300 bg-white hover:bg-gray-50 transition-all disabled:opacity-50';

const ProfilePage = ({ onNavigate }) => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    if (user.mustChangePassword) {
      onNavigate('/set-password');
      return;
    }

    setLoading(true);
    fetchProfile()
      .then((data) => {
        setProfile(data.user);
        setPhoneValue(parseUSPhoneForInput(data.user.phone));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, onNavigate]);

  const showMessage = (message) => {
    setSuccess(message);
    setError(null);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleSavePhone = async () => {
    const digits = phoneValue.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }

    setSavingPhone(true);
    setError(null);
    try {
      const data = await updateProfilePhone(toE164US(phoneValue));
      setProfile(data.user);
      setPhoneValue(parseUSPhoneForInput(data.user.phone));
      setEditingPhone(false);
      await refreshUser();
      showMessage('Phone number updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPhone(false);
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);
    try {
      const data = await uploadProfilePhoto(file);
      setProfile(data.user);
      await refreshUser();
      showMessage('Profile photo updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('Password changed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-[120px] px-4 flex items-center justify-center" style={{ background: '#F7F7F7' }}>
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const photoUrl = resolveProfilePhotoUrl(profile.profilePhotoUrl);
  const initial = (profile.name?.trim() || profile.email || '?').charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#F7F7F7', fontFamily: "'Inter', sans-serif" }}>
      <div
        className="absolute top-0 right-0 w-[35vw] h-[35vw] rounded-full blur-[120px] pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${BRAND_ACCENT_SOFT} 0%, rgba(255,255,255,0) 70%)` }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-[120px] pb-24">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Account</p>
          <h1 className="text-black font-extrabold text-2xl sm:text-3xl mt-1">Profile</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your account details and security settings.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">{success}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Identity sidebar */}
          <div className={`${glassCardClass} p-6 sm:p-8 lg:col-span-4 flex flex-col items-center text-center`}>
            <div className="relative mb-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="group relative block rounded-full focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60"
                aria-label="Change profile photo"
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={profile.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-bold text-black border-4 border-white shadow-md"
                    style={{ backgroundColor: BRAND_ACCENT }}
                  >
                    {initial}
                  </div>
                )}
                <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <h2 className="font-extrabold text-black text-lg truncate w-full">{profile.name}</h2>
            <p className="text-gray-500 text-sm mt-1 truncate w-full">{profile.email}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-4">
              {uploadingPhoto ? 'Uploading...' : 'Tap photo to change'}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, or GIF · max 5MB</p>

            <button
              type="button"
              onClick={() => onNavigate('/tickets')}
              className={`w-full mt-6 ${outlineBtnClass}`}
            >
              My Tickets
            </button>
          </div>

          {/* Main settings */}
          <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6">
            {/* Account details */}
            <div className={`${glassCardClass} p-6 sm:p-8`}>
              <h3 className="text-black font-extrabold text-base mb-1">Account details</h3>
              <p className="text-gray-500 text-xs mb-5">Name and email are set at checkout and cannot be changed here.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white/70 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Full name</p>
                  <p className="text-sm font-semibold text-black truncate">{profile.name || '—'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white/70 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Email</p>
                  <p className="text-sm font-semibold text-black truncate">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className={`${glassCardClass} p-6 sm:p-8`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-black font-extrabold text-base">Phone number</h3>
                  <p className="text-gray-500 text-xs mt-1">Used for event updates and ticket confirmations.</p>
                </div>
                {!editingPhone && (
                  <button
                    type="button"
                    onClick={() => setEditingPhone(true)}
                    className="text-xs font-bold shrink-0 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    style={{ color: '#7A8FA8' }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingPhone ? (
                <div className="space-y-3">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold shrink-0 select-none">
                      +1
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(formatUSPhone(e.target.value))}
                      placeholder="(555) 000-0000"
                      className={`${inputClass} rounded-l-none`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSavePhone}
                      disabled={savingPhone}
                      className={primaryBtnClass}
                      style={primaryBtnStyle}
                    >
                      {savingPhone ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhone(false);
                        setPhoneValue(parseUSPhoneForInput(profile.phone));
                        setError(null);
                      }}
                      className={outlineBtnClass}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-black">
                  {formatPhoneDisplay(profile.phone) || 'Not set'}
                </p>
              )}
            </div>

            {/* Password */}
            <div className={`${glassCardClass} p-6 sm:p-8`}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-black font-extrabold text-base">Security</h3>
                  <p className="text-gray-500 text-xs mt-1">Update your password to keep your account secure.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  className="text-xs font-bold text-gray-500 hover:text-black"
                >
                  {showPasswords ? 'Hide' : 'Show'}
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  required
                  className={inputClass}
                  autoComplete="current-password"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="New password (min 8)"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    required
                    minLength={8}
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    required
                    minLength={8}
                    className={inputClass}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className={`w-full sm:w-auto ${primaryBtnClass}`}
                  style={primaryBtnStyle}
                >
                  {changingPassword ? 'Updating...' : 'Update password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
