export const PAGE_BG = '#F7F7F7';

export const pageGradientStyle = {
  background: `linear-gradient(180deg, ${PAGE_BG} 0%, #EEF1F5 100%)`,
  color: '#111827',
};

function Shimmer({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/50 rounded-2xl ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function LoadingSpinner({ label, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
      <svg
        className={`${sizeClass} animate-spin text-gray-400`}
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {label && <p className="text-sm font-medium text-gray-500">{label}</p>}
    </div>
  );
}

export function PageShell({ children, className = '' }) {
  return (
    <div
      className={`min-h-screen text-gray-900 ${className}`}
      style={{ ...pageGradientStyle, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-24">
        {children}
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <PageShell>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="space-y-3 flex-1">
            <Shimmer className="h-3 w-28 rounded-full" />
            <Shimmer className="h-10 w-56 max-w-full" />
            <Shimmer className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-12 w-40 rounded-full" />
            <Shimmer className="h-12 w-40 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <Shimmer key={i} className="h-32 rounded-2xl border border-white/80" />
          ))}
        </div>

        <Shimmer className="h-28 rounded-3xl border border-white/80" />
        <Shimmer className="h-48 rounded-3xl border border-white/80" />
        <Shimmer className="h-80 rounded-3xl border border-white/80" />
      </div>
    </PageShell>
  );
}

export function AdminSubpageSkeleton({ rows = 6 }) {
  return (
    <PageShell>
      <div className="space-y-6">
        <Shimmer className="h-4 w-36 rounded-full" />
        <div className="space-y-3">
          <Shimmer className="h-3 w-20 rounded-full" />
          <Shimmer className="h-9 w-64 max-w-full" />
          <Shimmer className="h-4 w-48 max-w-full" />
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/40 overflow-hidden p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Shimmer className="h-4 w-32" />
            <Shimmer className="h-10 w-full sm:w-72 rounded-xl" />
          </div>
          {[...Array(rows)].map((_, i) => (
            <Shimmer key={i} className={`h-14 rounded-xl ${i % 2 === 0 ? 'opacity-90' : 'opacity-70'}`} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function ScannerSkeleton() {
  return (
    <PageShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <Shimmer className="h-4 w-36 rounded-full" />
        <div className="space-y-3 text-center sm:text-left">
          <Shimmer className="h-9 w-48 mx-auto sm:mx-0" />
          <Shimmer className="h-4 w-full max-w-md mx-auto sm:mx-0" />
        </div>
        <Shimmer className="aspect-square max-h-[420px] w-full rounded-3xl border border-white/80" />
        <Shimmer className="h-12 w-full rounded-2xl" />
        <Shimmer className="h-24 w-full rounded-2xl" />
      </div>
    </PageShell>
  );
}

export function TicketsListSkeleton() {
  return (
    <PageShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-9 w-40" />
          <Shimmer className="h-4 w-56" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-sm p-5 sm:p-6"
          >
            <div className="flex gap-4">
              <Shimmer className="w-14 h-14 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-5 w-3/4 max-w-xs" />
                <Shimmer className="h-3 w-1/2 max-w-[200px]" />
                <Shimmer className="h-3 w-2/3 max-w-[240px]" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Shimmer className="h-11 flex-1 rounded-full" />
              <Shimmer className="h-11 flex-1 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function ProfileSkeleton() {
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <Shimmer className="h-9 w-32" />
        <div className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Shimmer className="w-24 h-24 rounded-full shrink-0" />
            <div className="flex-1 w-full space-y-2">
              <Shimmer className="h-6 w-40 mx-auto sm:mx-0" />
              <Shimmer className="h-4 w-52 mx-auto sm:mx-0" />
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-4 py-4">
      <LoadingSpinner label="Loading ticket…" />
      <div className="rounded-3xl border border-white/80 bg-white/60 p-4 space-y-4">
        <Shimmer className="h-24 w-full rounded-2xl" />
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
        <Shimmer className="h-32 w-32 mx-auto rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowsSkeleton({ rows = 5 }) {
  return (
    <div className="p-4 sm:p-6 space-y-2">
      {[...Array(rows)].map((_, i) => (
        <Shimmer
          key={i}
          className={`h-14 rounded-xl border border-white/60 ${i % 2 === 0 ? 'opacity-90' : 'opacity-75'}`}
        />
      ))}
    </div>
  );
}

export function CenteredPageLoader({ label = 'Loading…' }) {
  return (
    <PageShell className="flex items-center">
      <div className="flex min-h-[50vh] items-center justify-center w-full">
        <LoadingSpinner label={label} size="lg" />
      </div>
    </PageShell>
  );
}
