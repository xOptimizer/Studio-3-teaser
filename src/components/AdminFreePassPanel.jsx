import { useEffect, useRef, useState } from 'react';
import { adminFetchEvents, adminIssueFreePasses } from '../lib/api';
import { STUDIO_EVENT } from '../constants/event';

const BRAND_ACCENT = '#B8C5D6';

const glassCardClass =
  'bg-white/60 border border-white rounded-3xl backdrop-blur shadow-sm';

const inputClass =
  'w-full px-3 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/10';

const emptyGuest = () => ({ firstName: '', lastName: '', email: '' });

function formatEventDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPrice(cents) {
  if (cents == null) return '';
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

function eventPoster(slug) {
  if (slug === 'inside-the-mind-2026') return STUDIO_EVENT.poster;
  return STUDIO_EVENT.poster;
}

function EventPicker({ events, value, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = events.find((ev) => ev.id === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-sm text-gray-500">No events available</p>;
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="free-pass-event"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 sm:gap-4 rounded-2xl border border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 text-left transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        {selected && (
          <img
            src={eventPoster(selected.slug)}
            alt=""
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 bg-gray-100"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {selected?.title || 'Select an event'}
          </p>
          {selected && (
            <>
              <p className="text-xs text-gray-600 truncate mt-0.5">{selected.venue}</p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {formatEventDate(selected.startsAt)}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {selected && (
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(184, 197, 214, 0.45)', color: '#374151' }}
            >
              {formatPrice(selected.priceCents)}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="free-pass-event"
          className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl py-1.5"
        >
          {events.map((ev) => {
            const isSelected = ev.id === value;
            return (
              <li key={ev.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(ev.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 text-left transition-colors ${
                    isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={eventPoster(ev.slug)}
                    alt=""
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{ev.title}</p>
                    <p className="text-xs text-gray-600 truncate">{ev.venue}</p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {formatEventDate(ev.startsAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-gray-600">
                      {formatPrice(ev.priceCents)}
                    </span>
                    {isSelected && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: BRAND_ACCENT }}
                        aria-hidden
                      >
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AdminFreePassPanel({ onIssued, onError, onSuccess }) {  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventId, setEventId] = useState('');
  const [guests, setGuests] = useState([emptyGuest()]);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    adminFetchEvents()
      .then((data) => {
        const list = data.events || [];
        setEvents(list);
        if (list.length > 0) setEventId(list[0].id);
      })
      .catch((err) => onError?.(err.message))
      .finally(() => setEventsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGuest = (index, field, value) => {
    setGuests((prev) =>
      prev.map((guest, i) => (i === index ? { ...guest, [field]: value } : guest))
    );
  };

  const addGuest = () => {
    if (guests.length >= 50) return;
    setGuests((prev) => [...prev, emptyGuest()]);
  };

  const removeGuest = (index) => {
    if (guests.length <= 1) return;
    setGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      onError?.('Select an event');
      return;
    }

    const payload = guests.map((g) => ({
      firstName: g.firstName.trim(),
      lastName: g.lastName.trim(),
      email: g.email.trim(),
    }));

    if (payload.some((g) => !g.firstName || !g.lastName || !g.email)) {
      onError?.('Fill in first name, last name, and email for every guest');
      return;
    }

    setSubmitting(true);
    onError?.(null);

    try {
      const data = await adminIssueFreePasses({ eventId, guests: payload });
      const msg =
        data.failedCount > 0
          ? `Issued ${data.issuedCount} pass(es). ${data.failedCount} failed.`
          : data.message || `Issued ${data.issuedCount} free pass(es)`;
      onSuccess?.(msg);
      setGuests([emptyGuest()]);
      onIssued?.();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEvent = events.find((ev) => ev.id === eventId);

  return (    <div className={`${glassCardClass} text-gray-900 mb-6 sm:mb-8 overflow-hidden`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left hover:bg-white/40 transition-colors"
      >
        <div>
          <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">Issue free passes</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Send complimentary tickets to one or more guests
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-6 pt-0 border-t border-gray-100/80">
          <div className="pt-4 mb-5">
            <label
              htmlFor="free-pass-event"
              className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2"
            >
              Event
            </label>
            <EventPicker
              events={events}
              value={eventId}
              onChange={setEventId}
              loading={eventsLoading}
            />
            {selectedEvent?.capacity != null && (
              <p className="text-xs text-gray-500 mt-2">
                Capacity: {selectedEvent.capacity} guests
              </p>
            )}
          </div>
          <div className="space-y-3 mb-4">
            <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-3 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">First name</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Last name</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Email</span>
              <span className="w-9" />
            </div>

            {guests.map((guest, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-3 items-start"
              >
                <input
                  type="text"
                  value={guest.firstName}
                  onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                  placeholder="First name"
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  value={guest.lastName}
                  onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                  placeholder="Last name"
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  value={guest.email}
                  onChange={(e) => updateGuest(index, 'email', e.target.value)}
                  placeholder="Email address"
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  disabled={guests.length <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors self-center sm:self-auto mx-auto sm:mx-0"
                  aria-label="Remove guest"
                  title="Remove guest"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addGuest}
              disabled={guests.length >= 50}
              className="px-4 py-2.5 rounded-full text-sm font-bold border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              + Add guest
            </button>
            <button
              type="submit"
              disabled={submitting || eventsLoading || !eventId}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                backgroundColor: BRAND_ACCENT,
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              {submitting ? 'Sending…' : `Send ${guests.length} pass${guests.length === 1 ? '' : 'es'}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminFreePassPanel;
