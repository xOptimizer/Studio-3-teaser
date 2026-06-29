function LegalLink({ path, label, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(path)}
      className="font-semibold text-gray-700 underline underline-offset-2 hover:text-black transition-colors"
    >
      {label}
    </button>
  );
}

const checkboxClass =
  'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-black/10 cursor-pointer';

export function AccountMarketingOptIns({
  emailOptIn,
  smsOptIn,
  onEmailOptInChange,
  onSmsOptInChange,
  onNavigate,
}) {
  return (
    <div className="space-y-3 pt-1">
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={emailOptIn}
          onChange={(e) => onEmailOptInChange(e.target.checked)}
          className={checkboxClass}
        />
        <span className="text-sm text-gray-700 leading-snug">
          Keep me updated on Studio 3 — new artists, events, and what&apos;s next.
        </span>
      </label>

      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={smsOptIn}
          onChange={(e) => onSmsOptInChange(e.target.checked)}
          className={checkboxClass}
        />
        <span className="text-sm text-gray-700 leading-snug">
          Send me text reminders and updates from Studio 3.
        </span>
      </label>

      <p className="text-[11px] text-gray-500 leading-relaxed pl-6">
        By checking this box, you consent to receive text messages from Third Place Studios LLC
        (Studio 3) at the number provided. Message frequency varies. Msg &amp; data rates may apply.
        Reply STOP to opt out.{' '}
        <LegalLink path="/privacy" label="Privacy Policy" onNavigate={onNavigate} />
      </p>
    </div>
  );
}

export function CheckoutTransactionalNotice({ onNavigate }) {
  return (
    <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mb-4">
      By completing your purchase, you agree to our{' '}
      <LegalLink path="/terms" label="Terms of Service" onNavigate={onNavigate} /> and{' '}
      <LegalLink path="/privacy" label="Privacy Policy" onNavigate={onNavigate} /> and will receive a
      confirmation at the email provided.
    </p>
  );
}
