import { EVENT_MAPS, STUDIO_EVENT } from '../constants/event';

const BRAND_ACCENT = '#B8C5D6';

function VenueMap() {
  return (
    <a
      href={EVENT_MAPS.openUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${STUDIO_EVENT.venue} in Google Maps`}
      className="group relative block w-full h-[240px] sm:h-[300px] md:h-[360px] rounded-3xl overflow-hidden shadow-inner border border-gray-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      style={{ background: '#121212' }}
    >
      <svg
        className="w-full h-full opacity-90 transition-opacity group-hover:opacity-75"
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <line x1="0" y1="50" x2="800" y2="50" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="150" x2="800" y2="150" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="250" x2="800" y2="250" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="350" x2="800" y2="350" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="100" y1="0" x2="100" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="500" y1="0" x2="500" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="700" y1="0" x2="700" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />

        <path d="M 0 100 L 800 100" stroke="#2a2a2a" strokeWidth="10" />
        <path d="M 0 300 L 800 300" stroke="#2a2a2a" strokeWidth="14" />
        <path d="M 150 0 L 150 400" stroke="#2a2a2a" strokeWidth="8" />
        <path d="M 400 0 L 400 400" stroke="#2d2d2d" strokeWidth="12" />
        <path d="M 600 0 L 600 400" stroke="#2a2a2a" strokeWidth="8" />

        <path d="M 0 180 L 800 180" stroke="#222" strokeWidth="4" />
        <path d="M 280 0 L 280 400" stroke="#222" strokeWidth="4" />
        <path d="M 490 0 L 490 400" stroke="#222" strokeWidth="4" />

        <path d="M 150 100 Q 200 120 280 180" stroke="#333" strokeWidth="3" strokeDasharray="6 4" />

        <text x="180" y="88" fill="#555" fontSize="10" fontFamily="monospace" fontWeight="500">
          Dallas North Tollway
        </text>
        <text x="418" y="60" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 418 60)">
          Hi Line Dr
        </text>
        <text x="612" y="160" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 612 160)">
          Oak Lawn Ave
        </text>
        <text x="290" y="220" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 290 220)">
          Stemmons Fwy
        </text>
        <text x="350" y="288" fill="#555" fontSize="10" fontFamily="monospace" fontWeight="500">
          Dragon St
        </text>

        <text x="40" y="45" fill="#3a3a3a" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
          DALLAS DESIGN DISTRICT
        </text>
        <text x="440" y="370" fill="#3a3a3a" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
          DEC ON DRAGON
        </text>
      </svg>

      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <span className="absolute w-8 h-8 rounded-full opacity-40 animate-ping" style={{ backgroundColor: BRAND_ACCENT }} />
        <span className="absolute w-12 h-12 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: BRAND_ACCENT }} />
        <span
          className="w-4.5 h-4.5 rounded-full border-2 border-white shadow-md relative z-10"
          style={{ backgroundColor: BRAND_ACCENT }}
        />
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
    </a>
  );
}

export default VenueMap;
