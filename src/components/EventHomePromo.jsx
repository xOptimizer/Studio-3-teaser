import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { STUDIO_EVENT, STUDIO_HOME_STATEMENT } from '../constants/event';

const STORAGE_KEY = 'studio3-event-promo-dismissed';
const BRAND_ACCENT = '#B8C5D6';
const ANIM_DURATION = 420;

const STORY_RING_GRADIENT =
  'conic-gradient(from 180deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #f09433)';

function getFabAnchorRect(fabEl) {
  if (fabEl) {
    return fabEl.getBoundingClientRect();
  }

  const size = window.innerWidth < 640 ? 62 : 70;
  const insetX = window.innerWidth < 640 ? 16 : 24;
  const insetY = 24;

  return {
    left: window.innerWidth - insetX - size,
    top: window.innerHeight - insetY - size,
    width: size,
    height: size,
  };
}

function getModalTransform(fromRect, toRect) {
  const fromCx = fromRect.left + fromRect.width / 2;
  const fromCy = fromRect.top + fromRect.height / 2;
  const toCx = toRect.left + toRect.width / 2;
  const toCy = toRect.top + toRect.height / 2;
  const scale = fromRect.width / toRect.width;

  return {
    translateX: fromCx - toCx,
    translateY: fromCy - toCy,
    scale,
  };
}

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

function EventPromoModal({
  modalCardRef,
  backdropRef,
  contentVisible,
  onClose,
  onJoin,
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-promo-title"
    >
      <button
        ref={backdropRef}
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm opacity-0"
        onClick={onClose}
        aria-label="Close event announcement"
      />

      <div
        ref={modalCardRef}
        className="relative z-10 w-full max-w-[400px] min-h-[min(88vh,620px)] border border-white/30 shadow-2xl overflow-hidden will-change-transform"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)' }}
      >
        <img
          src={STUDIO_EVENT.poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.25) 68%, rgba(0,0,0,0.15) 100%)',
          }}
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 border border-white/25 text-white hover:bg-black/55 flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-opacity duration-300"
          style={{
            background: STUDIO_EVENT.bannerGradient,
            opacity: contentVisible ? 1 : 0,
          }}
        >
          Launch Event
        </span>

        <div
          className="relative z-10 flex flex-col justify-end min-h-[min(88vh,620px)] p-6 sm:p-7 pt-24 transition-opacity duration-300"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-2">Studio 3</p>
          <h2
            id="event-promo-title"
            className="text-white font-extrabold text-xl sm:text-2xl leading-tight mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {STUDIO_EVENT.title}
          </h2>
          <p className="text-white/80 text-sm mb-4">
            {STUDIO_EVENT.dateLabel} · {STUDIO_EVENT.venue}
          </p>

          <blockquote
            className="text-white font-semibold text-base sm:text-lg leading-snug mb-6 border-l-[3px] pl-4"
            style={{ borderColor: BRAND_ACCENT, fontFamily: "'Inter', sans-serif" }}
          >
            {STUDIO_HOME_STATEMENT}
          </blockquote>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onJoin}
              className="w-full py-3.5 px-5 rounded-full text-white font-bold text-sm tracking-wide transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: STUDIO_EVENT.bannerGradient,
                boxShadow: '0 4px 16px rgba(230, 81, 0, 0.3)',
              }}
            >
              Join the event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-white/75 text-sm font-semibold hover:text-white transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const EventStoryFab = ({ fabRef, onClick, visible }) => (
  <button
    ref={fabRef}
    type="button"
    onClick={onClick}
    className={`fixed bottom-6 right-4 sm:right-6 z-[9990] group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 rounded-full transition-all duration-300 ${
      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
    }`}
    aria-label="View launch event"
  >
    <div
      className="rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 event-story-ring"
      style={{ background: STORY_RING_GRADIENT }}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200">
        <img
          src={STUDIO_EVENT.poster}
          alt=""
          className="block w-full h-full object-cover object-center scale-110"
        />
      </div>
    </div>

    <style>{`
      @keyframes storyRingSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .event-story-ring {
        animation: storyRingSpin 8s linear infinite;
      }
      .event-story-ring > div {
        animation: storyRingSpin 8s linear infinite reverse;
      }
    `}</style>
  </button>
);

function EventHomePromo({ onNavigate }) {
  const fabRef = useRef(null);
  const modalCardRef = useRef(null);
  const backdropRef = useRef(null);
  const isClosingRef = useRef(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);

  const runOpenAnimation = useCallback(() => {
    const card = modalCardRef.current;
    const backdrop = backdropRef.current;
    if (!card) return;

    const fromRect = getFabAnchorRect(fabRef.current);
    const toRect = card.getBoundingClientRect();
    const { translateX, translateY, scale } = getModalTransform(fromRect, toRect);

    card.style.transition = 'none';
    card.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.style.borderRadius = '9999px';

    if (backdrop) {
      backdrop.style.transition = 'none';
      backdrop.style.opacity = '0';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = `transform ${ANIM_DURATION}ms ${EASE}, border-radius ${ANIM_DURATION}ms ${EASE}`;
        card.style.transform = 'translate(0, 0) scale(1)';
        card.style.borderRadius = '1.5rem';

        if (backdrop) {
          backdrop.style.transition = `opacity ${ANIM_DURATION}ms ease`;
          backdrop.style.opacity = '1';
        }

        window.setTimeout(() => setContentVisible(true), ANIM_DURATION * 0.55);
      });
    });
  }, []);

  const runCloseAnimation = useCallback((onComplete) => {
    const card = modalCardRef.current;
    const backdrop = backdropRef.current;

    if (!card) {
      onComplete();
      return;
    }

    setContentVisible(false);
    setFabVisible(true);

    const fromRect = getFabAnchorRect(fabRef.current);
    const toRect = card.getBoundingClientRect();
    const { translateX, translateY, scale } = getModalTransform(fromRect, toRect);

    card.style.transition = `transform ${ANIM_DURATION}ms ${EASE}, border-radius ${ANIM_DURATION}ms ${EASE}`;
    card.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.style.borderRadius = '9999px';

    if (backdrop) {
      backdrop.style.transition = `opacity ${ANIM_DURATION}ms ease`;
      backdrop.style.opacity = '0';
    }

    const handleEnd = (event) => {
      if (event.propertyName !== 'transform') return;
      card.removeEventListener('transitionend', handleEnd);
      isClosingRef.current = false;
      onComplete();
    };

    card.addEventListener('transitionend', handleEnd);
  }, []);

  const openModal = useCallback(() => {
    setFabVisible(false);
    setShowFab(true);
    setContentVisible(false);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(
    (afterClose) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      runCloseAnimation(() => {
        setModalVisible(false);
        setFabVisible(true);
        afterClose?.();
      });
    },
    [runCloseAnimation]
  );

  useLayoutEffect(() => {
    if (!modalVisible) return undefined;
    runOpenAnimation();
    return undefined;
  }, [modalVisible, runOpenAnimation]);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    if (dismissed) {
      setShowFab(true);
      setFabVisible(true);
      return undefined;
    }

    const timer = window.setTimeout(() => openModal(), 5000);
    return () => window.clearTimeout(timer);
  }, [openModal]);

  const dismiss = () => {
    closeModal(() => {
      localStorage.setItem(STORAGE_KEY, '1');
    });
  };

  const joinEvent = () => {
    closeModal(() => {
      localStorage.setItem(STORAGE_KEY, '1');
      onNavigate?.('/event');
    });
  };

  return (
    <>
      {modalVisible && (
        <EventPromoModal
          modalCardRef={modalCardRef}
          backdropRef={backdropRef}
          contentVisible={contentVisible}
          onClose={dismiss}
          onJoin={joinEvent}
        />
      )}
      {showFab && (
        <EventStoryFab
          fabRef={fabRef}
          onClick={openModal}
          visible={fabVisible}
        />
      )}
    </>
  );
}

export default EventHomePromo;
