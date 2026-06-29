import React, { useState, useEffect, useMemo } from 'react';
import SocialLinks from './SocialLinks';
import VenueMap from './VenueMap';
import SupportEmailLink from './SupportEmailLink';
import { STUDIO_EVENT } from '../constants/event';
import { fetchCheckoutConfig } from '../lib/api';

const EVENT_START_ISO = STUDIO_EVENT.startsAtIso;
const BRAND_ACCENT = '#B8C5D6';
const BRAND_ACCENT_SOFT = 'rgba(184, 197, 214, 0.35)';
const BRAND_ACCENT_MUTED = '#7A8FA8';

const TICKET_PRICE = STUDIO_EVENT.ticketPrice;

/** Matches the event flyer orange tones */
const EVENT_BANNER_GRADIENT = STUDIO_EVENT.bannerGradient;

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
        className={`rounded-2xl text-center ${
          compact ? 'px-4 py-3' : 'px-5 py-4'
        }`}
        style={{
          border: `1px solid ${BRAND_ACCENT}`,
          backgroundColor: BRAND_ACCENT_SOFT,
        }}
      >
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: BRAND_ACCENT_MUTED }}>
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

const EventPage = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [soldCount, setSoldCount] = useState(null);

  useEffect(() => {
    fetchCheckoutConfig()
      .then((data) => setSoldCount(data.pricing?.soldCount ?? 0))
      .catch(() => setSoldCount(0));
  }, []);

  /*
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
  */

  const faqs = [
    {
      q: 'Is there parking?',
      a: 'Yes. Valet is available at the venue.',
    },
    {
      q: "What's the dress code?",
      a: 'Elevated attire is encouraged. Think of it as a night out, dress the part.',
    },
    {
      q: 'Is this a 21+ event?',
      a: 'Yes. This is a 21+ event. A valid government-issued ID is required at the door.',
    },
    {
      q: 'How do I get in?',
      a: "Your ticket will be sent to the email you used at checkout. Have it ready on your phone and we'll scan it at the door. No need to print.",
    },
    {
      q: 'Are tickets refundable or transferable?',
      a: (
        <>
          All ticket sales are final and non-transferable. If you have an issue, reach out to us at{' '}
          <SupportEmailLink className="text-gray-700 font-semibold underline underline-offset-2 hover:opacity-80" />
          .
        </>
      ),
    },
    {
      q: 'What should I expect at the event?',
      a: "Inside the Mind of an Artist is an immersive installation experience featuring some of the most interesting creative artists in Dallas right now. You'll move through their worlds, hear live music from four DJs, and spend the night inside a space built around art, process, and creative energy.",
    },
    {
      q: 'Will there be art for sale?',
      a: 'Yes. Work from the featured artists will be available to collect at the event.',
    },
    {
      q: 'Will there be food and drinks?',
      a: 'Open bar is included with your ticket. There will not be food served. We recommend eating before you arrive.',
    },
    {
      q: 'Is this a one-time event?',
      a: 'This is the beginning. Inside the Mind of an Artist is the public launch of Studio 3. Expect more to follow.',
    },
    {
      q: 'Still have questions?',
      a: (
        <>
          Reach out at <SupportEmailLink className="text-gray-700 font-semibold underline underline-offset-2 hover:opacity-80" />{' '}
          and we&apos;ll get back to you.
        </>
      ),
    },
  ];

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
          background: `radial-gradient(circle, ${BRAND_ACCENT_SOFT} 0%, rgba(255,255,255,0) 70%)`,
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
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND_ACCENT_SOFT, color: BRAND_ACCENT_MUTED }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-black font-bold text-sm">{STUDIO_EVENT.venue}</span>
                    <span className="text-gray-500 text-xs mt-0.5">{STUDIO_EVENT.address}</span>
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
                    <span className="text-black font-bold text-sm">{STUDIO_EVENT.dateLabel}</span>
                    <span className="text-gray-500 text-xs mt-0.5">{STUDIO_EVENT.timeLabel}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
                <EventCountdown />
              </div>

              {/* Attendance */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-black text-sm font-bold">
                    {soldCount === null
                      ? 'Loading attendance…'
                      : `${soldCount} attending`}
                  </span>
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
                Early bird ${STUDIO_EVENT.ticketPrice.toFixed(2)} for the first {STUDIO_EVENT.earlyBirdLimitDisplay} tickets · then ${STUDIO_EVENT.regularTicketPrice.toFixed(2)}.
              </p>
            </div>

            {/* Event Agenda — temporarily hidden
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 className="text-black font-extrabold text-[16pt] sm:text-[18pt] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Event Agenda
              </h2>
              <div className="flex flex-col gap-6">
                {eventAgenda.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: BRAND_ACCENT, border: `4px solid ${BRAND_ACCENT_SOFT}` }}
                      />
                      {index < eventAgenda.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex flex-col pb-2">
                      <span className="text-xs font-bold tracking-wider uppercase" style={{ color: BRAND_ACCENT_MUTED }}>{item.time}</span>
                      <h4 className="text-black font-bold text-sm sm:text-base mt-0.5">{item.title}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            */}

            {/* NEW: Map Showing Venue Location (added below About This Event) */}
            <div className="bg-white bg-opacity-60 border border-white rounded-3xl p-6 sm:p-8 backdrop-blur shadow-sm">
              <h2 
                className="text-black font-extrabold text-[12pt] sm:text-[14pt] tracking-wide mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Welcome to {STUDIO_EVENT.venue}
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
                  {STUDIO_EVENT.venue} · {STUDIO_EVENT.address}
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
                  src={STUDIO_EVENT.poster} 
                  alt="Inside the Mind of an Artist event poster" 
                  className="w-full h-full object-cover"
                />
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)'
                  }}
                />
              </div>

              {/* Social Medias / Footer links inside the poster just like the posh mockup */}
              <div className="px-5 py-4 bg-black bg-opacity-95 text-white flex justify-center items-center border-t border-gray-800">
                <SocialLinks variant="dark" />
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
          onClick={() => onNavigate && onNavigate('/event/checkout')}
          className="pointer-events-auto w-full max-w-[340px] py-4 px-6 rounded-full text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:opacity-95"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            background: EVENT_BANNER_GRADIENT,
            boxShadow: '0 8px 24px rgba(230, 81, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.12)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Buy tickets · $49.95 early bird
        </button>
      </div>

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
