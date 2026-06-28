export const STUDIO_EVENT = {
  title: 'Inside the Mind of an Artist',
  venue: 'Dec on Dragon',
  address: '1414 Dragon St, Dallas, TX 75207',
  dateLabel: 'Saturday, July 25, 2026',
  timeLabel: '8:00 PM – 2:00 AM CDT',
  startsAtIso: '2026-07-25T20:00:00-05:00',
  poster: '/assets/Final%20Flyer.jpg',
  headerLogo: '/assets/header.jpg',
  ticketPrice: 49.95,
  regularTicketPrice: 99.95,
  earlyBirdLimit: 55,
  bannerGradient:
    'linear-gradient(135deg, #FFD54F 0%, #FF9800 32%, #FF6D00 68%, #E65100 100%)',
};

/** Display fields for tickets/checkout — matches Event page copy */
export const STUDIO_EVENT_DISPLAY = {
  title: STUDIO_EVENT.title,
  venue: STUDIO_EVENT.venue,
  address: STUDIO_EVENT.address,
  date: STUDIO_EVENT.dateLabel,
  time: STUDIO_EVENT.timeLabel,
  poster: STUDIO_EVENT.poster,
};

export function formatEventListDate() {
  return STUDIO_EVENT.dateLabel;
}

export function getEventVenueLine() {
  return `${STUDIO_EVENT.venue}, ${STUDIO_EVENT.address}`;
}
