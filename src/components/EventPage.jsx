import React, { useState, useEffect, useMemo } from 'react';

const EVENT_START_ISO = '2026-07-25T20:00:00-05:00';

const getTimeRemaining = (targetDate) => {
  const total = targetDate.getTime() - Date.now();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    isLive: false,
  };
};

const padTime = (value) => String(value).padStart(2, '0');

const EventCountdown = ({ compact = false }) => {
  const eventStart = useMemo(() => new Date(EVENT_START_ISO), []);
  const [remaining, setRemaining] = useState(() => getTimeRemaining(eventStart));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(eventStart));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventStart]);

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Mins', value: remaining.minutes },
    { label: 'Secs', value: remaining.seconds },
  ];

  if (remaining.isLive) {
    return (
      <div
        className={`rounded-2xl border border-orange-100 bg-orange-50 text-center ${
          compact ? 'px-4 py-3' : 'px-5 py-4'
        }`}
      >
        <span className="text-orange-600 text-sm font-bold uppercase tracking-wider">
          Event is live now
        </span>
      </div>
    );
  }

  return (
    <div>
      <p
        className={`uppercase tracking-wider text-gray-400 font-bold ${
          compact ? 'text-[9px] mb-2' : 'text-[10px] sm:text-xs mb-3'
        }`}
      >
        Event starts in
      </p>
      <div className={`grid grid-cols-4 ${compact ? 'gap-1.5' : 'gap-2 sm:gap-3'}`}>
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm ${
              compact ? 'px-2 py-2.5' : 'px-2 sm:px-3 py-3 sm:py-4'
            }`}
          >
            <span
              className={`font-extrabold text-black tabular-nums leading-none ${
                compact ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {padTime(unit.value)}
            </span>
            <span
              className={`uppercase tracking-wider text-gray-400 font-semibold mt-1 ${
                compact ? 'text-[8px]' : 'text-[9px] sm:text-[10px]'
              }`}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const VenueMap = () => {
  return (
    <div className="relative w-full h-[240px] sm:h-[300px] rounded-3xl overflow-hidden shadow-inner border border-gray-200" style={{ background: '#121212' }}>
      {/* Dark map mock SVG */}
      <svg className="w-full h-full opacity-90" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Grid Gridlines / Minor Streets */}
        <line x1="0" y1="50" x2="800" y2="50" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="150" x2="800" y2="150" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="250" x2="800" y2="250" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="0" y1="350" x2="800" y2="350" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="100" y1="0" x2="100" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="500" y1="0" x2="500" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />
        <line x1="700" y1="0" x2="700" y2="400" stroke="#1f1f1f" strokeWidth="1.5" />

        {/* Major Roads / Streets */}
        <path d="M 0 100 L 800 100" stroke="#2a2a2a" strokeWidth="10" />
        <path d="M 0 300 L 800 300" stroke="#2a2a2a" strokeWidth="14" />
        <path d="M 150 0 L 150 400" stroke="#2a2a2a" strokeWidth="8" />
        <path d="M 400 0 L 400 400" stroke="#2d2d2d" strokeWidth="12" />
        <path d="M 600 0 L 600 400" stroke="#2a2a2a" strokeWidth="8" />
        
        {/* Secondary streets */}
        <path d="M 0 180 L 800 180" stroke="#222" strokeWidth="4" />
        <path d="M 280 0 L 280 400" stroke="#222" strokeWidth="4" />
        <path d="M 490 0 L 490 400" stroke="#222" strokeWidth="4" />
        
        {/* Ramps / Curves */}
        <path d="M 150 100 Q 200 120 280 180" stroke="#333" strokeWidth="3" strokeDasharray="6 4" />
        
        {/* Street Labels */}
        <text x="180" y="88" fill="#555" fontSize="10" fontFamily="monospace" fontWeight="500">Dallas North Tollway</text>
        <text x="418" y="60" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 418 60)">Hi Line Dr</text>
        <text x="612" y="160" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 612 160)">Oak Lawn Ave</text>
        <text x="290" y="220" fill="#444" fontSize="9" fontFamily="monospace" fontWeight="500" transform="rotate(90 290 220)">Stemmons Fwy</text>
        <text x="350" y="288" fill="#555" fontSize="10" fontFamily="monospace" fontWeight="500">Dragon St</text>
        
        {/* Area Labels */}
        <text x="40" y="45" fill="#3a3a3a" fontSize="11" fontWeight="bold" letterSpacing="0.05em">DALLAS DESIGN DISTRICT</text>
        <text x="440" y="370" fill="#3a3a3a" fontSize="11" fontWeight="bold" letterSpacing="0.05em">DEC ON DRAGON</text>
      </svg>
      
      {/* Glow Pulse Pin at Kirby Ice House location */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <span className="absolute w-8 h-8 rounded-full bg-orange-500 opacity-40 animate-ping" />
        <span className="absolute w-12 h-12 rounded-full bg-orange-500 opacity-20 animate-pulse" />
        <span className="w-4.5 h-4.5 rounded-full bg-orange-600 border-2 border-white shadow-md relative z-10" />
      </div>
    </div>
  );
};

const EventPage = ({ onNavigate }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'success'
  const [buyerInfo, setBuyerInfo] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const totalAttendees = 239;

  const attendees = [
    { name: 'Bree', avatar: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Devon', avatar: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Aaliyah', avatar: 'https://i.pravatar.cc/150?img=44' },
    { name: 'Jordan', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Taylor', avatar: 'https://i.pravatar.cc/150?img=21' },
    { name: 'Elena', avatar: 'https://i.pravatar.cc/150?img=9' },
  ];

  const eventAgenda = [
    {
      time: '8:00 PM – 9:00 PM',
      title: 'Doors Open & First Look',
      desc: 'Arrive at Dec on Dragon, grab a drink from the open bar, and take your first walk through the installations as the night begins.'
    },
    {
      time: '9:00 PM – 11:30 PM',
      title: 'Installations & Artist Encounters',
      desc: 'Explore large-scale work, meet the artists behind it, and browse original pieces available to collect.'
    },
    {
      time: '11:30 PM – 2:00 AM',
      title: 'Open Bar & Afterhours',
      desc: 'The room stays alive — music, conversation, and the installations run all night until close.'
    }
  ];

  // FAQs data
  const faqs = [
    {
      q: 'Is there an age restriction?',
      a: 'Yes, this is a 21+ event.'
    },
    {
      q: 'Is parking available?',
      a: 'Valet parking is available at the venue. If you plan on drinking, please arrange a rideshare or a designated driver.'
    },
    {
      q: 'Are tickets refundable?',
      a: 'All sales are final. Tickets are transferable — if you can\'t make it, you can pass yours along.'
    },
    {
      q: 'Will there be food and drinks?',
      a: 'Every ticket includes an open bar and a dining credit to use at your leisure.'
    }
  ];

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutStep('success');
    }, 1200);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setCheckoutStep('form');
      setTicketQuantity(1);
      setBuyerInfo({ name: '', email: '', phone: '' });
    }, 300);
  };

  return (
    <div 
      className="min-h-screen relative w-full" 
      style={{ 
        background: '#F7F7F7',
        fontFamily: "'Inter', sans-serif" 
      }}
    >
      {/* Decorative ambient glowing backdrops matching the poster vibe, but in light theme */}
      <div 
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(253,186,116,0) 70%)',
          zIndex: 1
        }}
      />
      <div 
        className="absolute top-[40vh] left-[-10vw] w-[35vw] h-[35vw] rounded-full blur-[100px] pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(41,151,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 1
        }}
      />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[120px] pb-[160px] relative z-10">

        {/* Responsive Grid layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Scrollable Content (Header, Title, About, Map, Agenda, FAQs) */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1 flex flex-col gap-8 animate-fadeIn">
            
            {/* Host Metadata & Action controls */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm p-1.5">
                  <img
                    src="/assets/Logo_Without_Text.svg"
                    alt="Studio 3"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10pt] uppercase tracking-wider text-gray-400 font-bold">Host</span>
                  <span className="text-black font-bold text-sm">Studio 3</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-black font-extrabold text-[22pt] sm:text-[28pt] md:text-[34pt] leading-[1.1] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Inside the Mind of an Artist
              </h1>

              {/* Quick Details List */}
              <div className="flex flex-col gap-4 mb-6 border-t border-b border-gray-100 py-6">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-black font-bold text-sm">Dec on Dragon</span>
                    <span className="text-gray-500 text-xs mt-0.5">1414 Dragon St, Dallas, TX 75207</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-black font-bold text-sm">Saturday, July 25, 2026</span>
                    <span className="text-gray-500 text-xs mt-0.5">8:00 PM – 2:00 AM CDT</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
                <EventCountdown />
              </div>

              {/* Attendee Avatars */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex items-center flex-shrink-0">
                    {attendees.slice(0, 6).map((person, index) => (
                      <img
                        key={person.name}
                        src={person.avatar}
                        alt={person.name}
                        title={person.name}
                        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100"
                        style={{ marginLeft: index === 0 ? 0 : '-10px', zIndex: attendees.length - index }}
                      />
                    ))}
                    <div
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-600 shadow-sm flex-shrink-0"
                      style={{ marginLeft: '-10px', zIndex: 0 }}
                      aria-label={`${totalAttendees - 6} more attendees`}
                    >
                      +{totalAttendees - 6}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-black text-sm font-bold">
                      {totalAttendees} people going
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm truncate">
                      Bree, Marcus, Sarah, and {totalAttendees - 3} others
                    </span>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 flex items-center justify-center self-start sm:self-auto flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Spots Available
                </div>
              </div>
            </div>

            {/* About this event Section */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 className="text-black font-extrabold text-[16pt] sm:text-[18pt] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                About this event
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                This isn't a gallery walk.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Inside the Mind of an Artist is an immersive, one-night experience built around Dallas's most compelling artists. Large scale installations. Original work available to collect. An open bar, a curated environment, and a room full of people who actually care about creative culture.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Come to see the work. Stay for the night.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold text-black">
                Early bird tickets start at $49.95 · first 50 only.
              </p>
            </div>

            {/* Event Agenda */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 className="text-black font-extrabold text-[16pt] sm:text-[18pt] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Event Agenda
              </h2>
              <div className="flex flex-col gap-6">
                {eventAgenda.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-orange-100 flex-shrink-0" />
                      {index < eventAgenda.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex flex-col pb-2">
                      <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">{item.time}</span>
                      <h4 className="text-black font-bold text-sm sm:text-base mt-0.5">{item.title}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW: Map Showing Venue Location (added below About This Event) */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 
                className="text-black font-extrabold text-[12pt] sm:text-[14pt] tracking-wide mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Welcome to Dec on Dragon
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
                Dec on Dragon is one of Dallas's most iconic creative venues — a raw, expansive space that transforms with every event it hosts. Doors open at 8. The installations are live all night.
              </p>
              
              <hr className="border-gray-200 border-opacity-60 my-6" />

              {/* Dark Styled Map component showing location of the venue */}
              <div className="mb-6">
                <VenueMap />
              </div>

              {/* Location Detail */}
              <div className="flex flex-col gap-1">
                <h4 className="text-black font-extrabold text-sm sm:text-base">Location</h4>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Dec on Dragon · 1414 Dragon St, Dallas, TX 75207
                </p>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 className="text-black font-extrabold text-[16pt] sm:text-[18pt] mb-6">
                FAQ
              </h2>
              <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div 
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                      >
                        <span className="text-black font-bold text-sm sm:text-base">
                          {faq.q}
                        </span>
                        <span className="text-xl text-gray-400 ml-4 font-normal">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed animate-fadeIn">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Desktop Sticky Event Poster (fixed while scrolling) */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 lg:sticky lg:top-[120px] z-20 flex flex-col gap-6 items-center">
            
            {/* Poster Card */}
            <div 
              className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white border-opacity-40 transition-transform duration-300 hover:scale-[1.01]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Event Poster Image */}
              <div className="relative aspect-[4/5] bg-gray-200">
                <img 
                  src="/assets/images/art_gallery_poster.png" 
                  alt="Inside the Mind of an Artist event poster" 
                  className="w-full h-full object-cover"
                />
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)'
                  }}
                />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 backdrop-blur text-white text-[9pt] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow">
                  $49.95 Ticket
                </div>
              </div>

              {/* Social Medias / Footer links inside the poster just like the posh mockup */}
              <div className="px-5 py-4 bg-black bg-opacity-95 text-white flex justify-between items-center text-[8pt] uppercase tracking-widest font-semibold border-t border-gray-800">
                <div className="flex gap-3">
                  <span>TikTok</span>
                  <span>Insta</span>
                </div>
                <span>studio3.dallas</span>
                <span>Connection</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM FIXED CTA BUTTON */}
      <div 
        className="fixed bottom-6 left-0 right-0 z-[1000] flex justify-center px-4 pointer-events-none"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="pointer-events-auto w-full max-w-[340px] py-4 px-6 rounded-full text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            backgroundColor: '#C25910', // Posh style dark-bronze color
            boxShadow: '0 20px 40px rgba(194, 89, 16, 0.4)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Buy tickets from $49.95
        </button>
      </div>

      {/* TICKET CHECKOUT / BOOKING MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={closeCheckout}
            className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-lg transition-opacity duration-300"
            style={{ 
              boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.15), 0 0 200px rgba(0, 0, 0, 0.1)'
            }}
          />
          
          {/* Checkout Card Container */}
          <div 
            className="relative z-10 w-full max-w-[500px] bg-white bg-opacity-75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white border-opacity-30 shadow-2xl overflow-y-auto max-h-[90vh] transition-all duration-300 scale-100"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.4)'
            }}
          >
            {/* Close Cross */}
            <button
              onClick={closeCheckout}
              className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
              aria-label="Close checkout"
            >
              ×
            </button>

            {checkoutStep === 'form' ? (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <span className="text-[10pt] uppercase tracking-wider text-orange-600 font-extrabold">Checkout</span>
                  <h3 className="text-black font-extrabold text-2xl mt-1">Get Tickets</h3>
                  <p className="text-gray-500 text-xs mt-1">Inside the Mind of an Artist · Dec on Dragon</p>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                  {/* Select Tickets Quantity */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-black font-bold text-sm">General Admission</span>
                      <span className="text-gray-500 text-xs mt-0.5">$49.95 each</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1.5">
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-black font-bold text-sm w-4 text-center">
                        {ticketQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Buyer Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-name" className="text-black font-bold text-xs">Full Name</label>
                    <input
                      type="text"
                      id="checkout-name"
                      required
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-xs border border-gray-300 bg-white bg-opacity-50"
                    />
                  </div>

                  {/* Buyer Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-email" className="text-black font-bold text-xs">Email Address</label>
                    <input
                      type="email"
                      id="checkout-email"
                      required
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-xs border border-gray-300 bg-white bg-opacity-50"
                    />
                  </div>

                  {/* Buyer Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-phone" className="text-black font-bold text-xs">Phone Number</label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      required
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      placeholder="(123) 456-7890"
                      className="w-full px-4 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-xs border border-gray-300 bg-white bg-opacity-50"
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center text-black font-bold text-sm">
                    <span>Total Amount</span>
                    <span className="text-lg text-emerald-600">${(49.95 * ticketQuantity).toFixed(2)}</span>
                  </div>

                  {/* Submit checkout */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 mt-4 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center bg-[#2997FF] hover:bg-[#2563EB] disabled:opacity-50 transition-all shadow-md active:scale-98"
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              </div>
            ) : (
              // SUCCESS STEP
              <div className="text-center py-6 animate-fadeIn flex flex-col items-center">
                {/* Success Checkmark Ring */}
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-inner animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-black font-extrabold text-2xl">You're Going!</h3>
                <p className="text-gray-500 text-xs mt-2 max-w-[300px] mx-auto leading-relaxed">
                  A confirmation email with your digital {ticketQuantity > 1 ? `${ticketQuantity} tickets` : 'ticket'} and order receipt of ${(49.95 * ticketQuantity).toFixed(2)} USD has been sent to <strong className="text-gray-700">{buyerInfo.email}</strong>.
                </p>

                {/* Simulated Ticket Details Box */}
                <div className="w-full border border-dashed border-gray-200 bg-gray-50 rounded-2xl p-4 my-6 flex flex-col gap-2 items-center text-left">
                  <div className="flex justify-between w-full text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <span>Ticket Type</span>
                    <span>Quantity</span>
                  </div>
                  <div className="flex justify-between w-full text-sm font-bold text-black border-b border-gray-100 pb-2">
                    <span>General Admission</span>
                    <span>{ticketQuantity}x</span>
                  </div>
                  <div className="flex justify-between w-full text-xs text-gray-500 mt-2">
                    <span>Confirmation</span>
                    <span className="font-mono text-black font-bold uppercase">SSC-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between w-full text-xs text-gray-500">
                    <span>Attendee</span>
                    <span className="text-black font-bold">{buyerInfo.name}</span>
                  </div>
                </div>

                <button
                  onClick={closeCheckout}
                  className="w-full py-3.5 px-6 rounded-2xl text-black border border-gray-300 bg-white hover:bg-gray-50 font-bold text-sm transition-all"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Styled scrollbar & details */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default EventPage;
