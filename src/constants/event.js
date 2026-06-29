/** Hero / studio tagline — used on home event promo */
export const STUDIO_HOME_STATEMENT = 'A creative home, not just a workspace.';

export const STUDIO_EVENT = {
  title: 'Inside the Mind of an Artist',
  venue: 'Dec on Dragon',
  address: '1414 Dragon St, Dallas, TX 75207',
  dateLabel: 'Saturday, July 25, 2026',
  timeLabel: '8:00 PM – 2:00 AM CDT',
  startsAtIso: '2026-07-25T20:00:00-05:00',
  poster: '/assets/flyer.jpg',
  ticketBanner: '/assets/Ticket%20Banner.jpg',
  logoWithText: '/assets/Logo_With_Text.svg',
  headerLogo: '/assets/S3_Horizontal.png',
  ticketPrice: 49.95,
  regularTicketPrice: 99.95,
  earlyBirdLimit: 55,
  /** Marketing copy on the event page only — actual early bird capacity stays at earlyBirdLimit */
  earlyBirdLimitDisplay: 50,
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
  ticketBanner: STUDIO_EVENT.ticketBanner,
  logoWithText: STUDIO_EVENT.logoWithText,
};

export function formatEventListDate() {
  return STUDIO_EVENT.dateLabel;
}

export function getEventVenueLine() {
  return `${STUDIO_EVENT.venue}, ${STUDIO_EVENT.address}`;
}

const mapsQuery = encodeURIComponent(STUDIO_EVENT.address);

export const EVENT_MAPS = {
  embedUrl: `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  openUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
};
