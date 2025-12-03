import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg } from "../utils";
import RegistrationModal from "./RegistrationModal";

const VideoCarousel = forwardRef(({ onPlayPauseChange }, ref) => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // video and indicator
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
    });

    // video animation to play the video when it is in the view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => {
          const newState = { ...pre, startPlay: true, isPlaying: true };
          if (onPlayPauseChange) onPlayPauseChange(true);
          return newState;
        });
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animation to move the indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  useEffect(() => {
    if (videoRef.current[videoId]) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        if (startPlay) {
          videoRef.current[videoId].currentTime = 0; // Reset to start
          videoRef.current[videoId].play().catch(err => {
            console.log('Video play error:', err);
          });
        }
      }
    }
  }, [startPlay, videoId, isPlaying]);

  // vd id is the id for every video until id becomes number 3
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        // Pause current video
        if (videoRef.current[i]) {
          videoRef.current[i].pause();
        }
        // Move to next video
        const nextVideoId = i + 1;
        setVideo((pre) => ({ 
          ...pre, 
          isEnd: true, 
          videoId: nextVideoId,
          startPlay: true,
          isPlaying: true
        }));
        break;


      case "pause":
        setVideo((pre) => {
          const newState = { ...pre, isPlaying: !pre.isPlaying };
          if (onPlayPauseChange) onPlayPauseChange(newState.isPlaying);
          return newState;
        });
        break;

      case "play":
        setVideo((pre) => {
          const newState = { ...pre, isPlaying: !pre.isPlaying };
          if (onPlayPauseChange) onPlayPauseChange(newState.isPlaying);
          return newState;
        });
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  useImperativeHandle(ref, () => ({
    handlePlayPause: () => {
      handleProcess(isPlaying ? "pause" : "play");
    }
  }));

  return (
    <>
      <div className="relative flex items-center w-full max-w-full px-2 sm:px-0">
      <div className="flex items-center w-full overflow-hidden">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="flex-shrink-0 w-full sm:pr-20 pr-4 sm:pl-0 pl-4">
            <div 
              className="video-carousel_container"
              onMouseEnter={() => setHoveredVideo(i)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  key={`video-${list.id}-${isMobile ? 'mobile' : 'desktop'}-${isMobile ? list.videoMobile : list.video}`}
                  id="video"
                  playsInline={true}
                  className="pointer-events-none w-full h-full object-contain"
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() => {
                    // Pause current video
                    if (videoRef.current[i]) {
                      videoRef.current[i].pause();
                    }
                    
                    if (i < hightlightsSlides.length - 1) {
                      // Move to next video
                      handleProcess("video-end", i);
                    } else {
                      // Auto-loop: reset to first video and start playing
                      if (videoRef.current[0]) {
                        videoRef.current[0].currentTime = 0;
                      }
                      setVideo((pre) => ({ 
                        ...pre, 
                        videoId: 0, 
                        isLastVideo: false,
                        startPlay: true,
                        isPlaying: true
                      }));
                    }
                  }}
                  onPlay={() => {
                    setVideo((pre) => ({ ...pre, isPlaying: true }));
                    if (onPlayPauseChange) onPlayPauseChange(true);
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={isMobile && list.videoMobile ? list.videoMobile : list.video} type="video/mp4" />
                </video>
              </div>

              {/* Caption at the bottom - shown on hover */}
              <div 
                className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${
                  hoveredVideo === i ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-b-3xl px-4 md:px-6 lg:px-8 py-3 md:py-4 w-full">
                  <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold mb-1.5 md:mb-2 text-left">
                    {list.captionTitle}
                  </h3>
                  <p className="text-gray-100 text-xs sm:text-sm md:text-base text-left leading-relaxed">
                    {list.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="relative flex-center mt-8 md:mt-10 mb-4 md:mb-6">
        <div className="flex-center gap-2 md:gap-3">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Register Button */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 px-5 sm:px-7 md:px-9 py-2 sm:py-2.5 md:py-3 rounded-full bg-gray-300 backdrop-blur-md text-white text-sm sm:text-base md:text-lg font-medium transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        style={{ 
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <span>Register Now</span>
        <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-blue flex-shrink-0">
          <svg 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
});

VideoCarousel.displayName = 'VideoCarousel';

export default VideoCarousel;
