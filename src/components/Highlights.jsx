import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useState, useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger);

import VideoCarousel from './VideoCarousel';

const Highlights = () => {
  const titleRef = useRef(null);
  const typeIntervalRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullText = "What We Offer.";
  const typingSpeed = 120; // milliseconds per character

  useEffect(() => {
    if (!titleRef.current) return;

    const startTyping = () => {
      // Clear any existing interval
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
      }
      
      // Reset state
      setDisplayedText('');
      setIsTyping(true);
      let currentIndex = 0;
      
      typeIntervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
          setIsTyping(false);
        }
      }, typingSpeed);
    };

    const resetTyping = () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      setDisplayedText('');
      setIsTyping(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTyping();
          } else {
            resetTyping();
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(titleRef.current);

    return () => {
      observer.disconnect();
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
      }
    };
  }, [fullText, typingSpeed]);

  return (
    <>
      <section id="highlights" className="w-screen overflow-hidden h-full common-padding bg-zinc">
        <div className="screen-max-width">
          <div className="mb-12 w-full flex justify-center">
            <h1 
              ref={titleRef}
              className="section-heading text-center"
              style={{ 
                minHeight: '1.2em',
                opacity: displayedText ? 1 : 0,
                transform: displayedText ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                letterSpacing: '0.05em'
              }}
            >
              {displayedText}
              {isTyping && (
                <span 
                  className="inline-block w-[2px] bg-gray align-middle"
                  style={{
                    height: '0.9em',
                    animation: 'blink 1s infinite',
                    marginLeft: '4px',
                    verticalAlign: 'middle'
                  }}
                >
                  |
                </span>
              )}
            </h1>
          </div>

          <div className="mb-8 md:mb-12">
            <VideoCarousel />
          </div>
        </div>
      </section>
    </>
  )
}

export default Highlights