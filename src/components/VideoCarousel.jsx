import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg } from "../utils";
import RegistrationModal from "./RegistrationModal";

const VideoCarousel = forwardRef(({ onPlayPauseChange, onSlideChange }, ref) => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const carouselRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  // Swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);

  // video and indicator
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    // Optimize animation for mobile/iPad - faster and smoother
    const isMobileDevice = window.innerWidth < 1024;
    const animationDuration = isMobileDevice ? 0.6 : 1.2; // Faster on mobile
    const easingFunction = isMobileDevice ? "power1.out" : "power2.inOut"; // Smoother easing for mobile
    
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      x: `${-100 * videoId}%`, // Use 'x' instead of 'transform' for better performance
      duration: animationDuration,
      ease: easingFunction,
      force3D: true, // Enable hardware acceleration
      immediateRender: false,
    });
    
    // Notify parent of slide change
    if (onSlideChange) onSlideChange(videoId);

    // Get the current video element
    const currentVideo = videoRef.current[videoId];
    
    if (currentVideo) {
      // Check if video is in viewport or start playing immediately for carousel
      const rect = currentVideo.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView || videoId === 0) {
        // Video is in view or it's the first video - start playing
        setVideo((pre) => {
          const newState = { ...pre, startPlay: true, isPlaying: true };
          if (onPlayPauseChange) onPlayPauseChange(true);
          return newState;
        });
      } else {
        // Use ScrollTrigger as fallback for videos that scroll into view
        const scrollTrigger = ScrollTrigger.create({
          trigger: currentVideo,
          start: "top 80%",
          once: true,
          onEnter: () => {
        setVideo((pre) => {
          const newState = { ...pre, startPlay: true, isPlaying: true };
          if (onPlayPauseChange) onPlayPauseChange(true);
          return newState;
        });
      },
    });

        // Cleanup ScrollTrigger on unmount or video change
        return () => {
          scrollTrigger.kill();
        };
      }
    }
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
              backgroundColor: "black",
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
              backgroundColor: "black",
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
      const currentVideo = videoRef.current[videoId];
      
      // Force load video if it hasn't loaded yet
      if (currentVideo.readyState === 0) {
        currentVideo.load();
      }
      
      if (!isPlaying) {
        currentVideo.pause();
      } else {
        if (startPlay) {
          // Reset to start when switching to a new video
          if (currentVideo.ended || (currentVideo.currentTime > 0.1 && currentVideo.currentTime < currentVideo.duration - 0.5)) {
            currentVideo.currentTime = 0;
          }
          
          // Function to attempt playing the video
          const attemptPlay = () => {
            const playPromise = currentVideo.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log(`Video ${videoId} playing successfully`);
                })
                .catch(err => {
                  console.log(`Video ${videoId} play error:`, err);
                  // If autoplay fails, try again after user interaction
                  if (err.name === 'NotAllowedError') {
                    console.log('Autoplay prevented, waiting for user interaction');
                  }
                });
            }
          };
          
          // Ensure video is loaded before playing
          if (currentVideo.readyState >= 2) { // HAVE_CURRENT_DATA
            attemptPlay();
          } else if (currentVideo.readyState >= 1) { // HAVE_METADATA
            // Video has metadata, try to play
            attemptPlay();
          } else {
            // Wait for video to be ready
            const handleCanPlay = () => {
              attemptPlay();
            };
            currentVideo.addEventListener('canplay', handleCanPlay, { once: true });
            currentVideo.addEventListener('loadeddata', handleCanPlay, { once: true });
            
            // Fallback: try after a delay
            const timeout = setTimeout(() => {
              if (currentVideo.readyState >= 1) {
                attemptPlay();
              }
            }, 1000);
            
            return () => {
              clearTimeout(timeout);
              currentVideo.removeEventListener('canplay', handleCanPlay);
              currentVideo.removeEventListener('loadeddata', handleCanPlay);
            };
          }
        }
      }
    }
  }, [startPlay, videoId, isPlaying]);

  // Auto-start first video when component mounts
  useEffect(() => {
    // Small delay to ensure video element is ready
    const timer = setTimeout(() => {
      if (videoRef.current[0] && !startPlay && videoId === 0) {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true
        }));
        if (onPlayPauseChange) onPlayPauseChange(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // Only run once on mount


  // Preload next video metadata when current video is playing
  useEffect(() => {
    if (videoId < hightlightsSlides.length - 1 && videoRef.current[videoId + 1]) {
      const nextVideo = videoRef.current[videoId + 1];
      nextVideo.preload = "metadata";
      // Force load if it hasn't loaded yet
      if (nextVideo.readyState === 0) {
        nextVideo.load();
      }
    }
  }, [videoId]);

  // Handle user interaction to enable video playback on mobile
  const handleUserInteraction = () => {
    // After user interaction, try to play current video if it's not playing
    if (videoRef.current[videoId] && !isPlaying && startPlay) {
      videoRef.current[videoId].play().catch(err => {
        console.log('Video play after interaction error:', err);
      });
    }
  };

  // Swipe handlers
  const handleSwipeStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    // User interaction detected - enable video playback
    handleUserInteraction();
  };

  const handleSwipeMove = (e) => {
    // Prevent default scrolling while swiping horizontally
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = Math.abs(touchX - touchStartX.current);
    const deltaY = Math.abs(touchY - touchStartY.current);
    
    // If horizontal swipe is more dominant, prevent vertical scroll
    // Check if event is cancelable before preventing default
    if (deltaX > deltaY && deltaX > 5 && e.cancelable) {
      e.preventDefault();
    }
  };

  const handleSwipeEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  // Add touch event listeners manually to control passive option
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleTouchMove = (e) => {
      // Only prevent default if we have a valid touch start
      if (touchStartX.current === 0 && touchStartY.current === 0) return;
      
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = Math.abs(touchX - touchStartX.current);
      const deltaY = Math.abs(touchY - touchStartY.current);
      
      // If horizontal swipe is more dominant, prevent vertical scroll
      if (deltaX > deltaY && deltaX > 5) {
        e.preventDefault();
      }
    };

    // Add non-passive touchmove listener to allow preventDefault
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      carousel.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30; // Reduced threshold for easier swiping on mobile

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe left - go to next slide
        goToNextSlide();
      } else {
        // Swipe right - go to previous slide
        goToPreviousSlide();
      }
    }
  };

  const goToNextSlide = () => {
    if (videoId < hightlightsSlides.length - 1) {
      // Pause current video
      if (videoRef.current[videoId]) {
        videoRef.current[videoId].pause();
      }
      // Move to next video
      const nextVideoId = videoId + 1;
      setVideo((pre) => ({ 
        ...pre, 
        isEnd: true, 
        videoId: nextVideoId,
        startPlay: true,
        isPlaying: true
      }));
      if (onSlideChange) onSlideChange(nextVideoId);
    } else {
      // Loop to first slide
      if (videoRef.current[videoId]) {
        videoRef.current[videoId].pause();
      }
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
      if (onSlideChange) onSlideChange(0);
    }
  };

  const goToPreviousSlide = () => {
    if (videoId > 0) {
      // Pause current video
      if (videoRef.current[videoId]) {
        videoRef.current[videoId].pause();
      }
      const prevVideoId = videoId - 1;
      setVideo((pre) => ({ 
        ...pre, 
        isEnd: true, 
        videoId: prevVideoId,
        startPlay: true,
        isPlaying: true
      }));
      if (onSlideChange) onSlideChange(prevVideoId);
    }
  };

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
        if (onSlideChange) onSlideChange(nextVideoId);
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
      <div 
        ref={carouselRef}
        className="relative flex items-center w-full max-w-full px-2 sm:px-0"
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
        onClick={handleUserInteraction}
        style={{ touchAction: 'pan-y' }}
      >
      <div className="flex items-center w-full overflow-hidden" style={{ willChange: 'transform' }}>
        {hightlightsSlides.map((list, i) => (
          <div 
            key={list.id} 
            id="slider" 
            className="flex-shrink-0 w-full sm:pr-20 pr-4 sm:pl-0 pl-4"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div 
              className="video-carousel_container"
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-black">
                <video
                  key={`video-${list.id}-${isMobile ? 'mobile' : 'desktop'}-${isMobile ? list.videoMobile : list.video}`}
                  id={`video-${list.id}`}
                  playsInline={true}
                  className="pointer-events-none w-full h-full object-cover"
                  preload={i === videoId ? "metadata" : i === videoId + 1 ? "metadata" : "none"}
                  muted
                  autoPlay={i === videoId && startPlay}
                  ref={(el) => {
                    videoRef.current[i] = el;
                    // When video element is mounted and it's the current video, ensure it loads
                    if (el && i === videoId && startPlay) {
                      // Force load the video source
                      if (el.readyState === 0) {
                        el.load();
                      }
                    }
                  }}
                  onError={(e) => {
                    console.error(`Video ${i} error:`, e.target.error, {
                      src: isMobile && list.videoMobile ? list.videoMobile : list.video,
                      readyState: e.target.readyState,
                      networkState: e.target.networkState
                    });
                  }}
                  onLoadStart={() => {
                    console.log(`Video ${i} load started`);
                  }}
                  onLoadedData={() => {
                    console.log(`Video ${i} loaded data`);
                  }}
                  onEnded={() => {
                    // Only auto-advance if this is the currently active video
                    if (i === videoId) {
                      // Pause current video
                      if (videoRef.current[i]) {
                        videoRef.current[i].pause();
                      }
                      
                      if (i < hightlightsSlides.length - 1) {
                        // Auto-advance to next video
                        const nextVideoId = i + 1;
                        setVideo((pre) => ({ 
                          ...pre, 
                          isEnd: true, 
                          videoId: nextVideoId,
                          startPlay: true,
                          isPlaying: true
                        }));
                        if (onSlideChange) onSlideChange(nextVideoId);
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
                        if (onSlideChange) onSlideChange(0);
                      }
                    }
                  }}
                  onPlay={() => {
                    setVideo((pre) => ({ ...pre, isPlaying: true }));
                    if (onPlayPauseChange) onPlayPauseChange(true);
                  }}
                  onLoadedMetadata={(e) => {
                    handleLoadedMetaData(i, e);
                    // If this is the current video and should be playing, start it
                    if (i === videoId && startPlay && isPlaying) {
                      e.target.play().catch(err => {
                        console.log('Video play on load error:', err);
                      });
                    }
                  }}
                  onCanPlay={() => {
                    // Video is ready to play - if it's the current video and should be playing
                    if (videoRef.current[i] && i === videoId && startPlay && isPlaying) {
                      // Ensure video source is set
                      const videoSrc = isMobile && list.videoMobile ? list.videoMobile : list.video;
                      if (videoRef.current[i].src !== videoSrc && videoRef.current[i].currentSrc !== videoSrc) {
                        console.warn(`Video ${i} source mismatch. Expected: ${videoSrc}, Got: ${videoRef.current[i].currentSrc}`);
                      }
                      // Small delay to ensure smooth transition
                      setTimeout(() => {
                        if (videoRef.current[i] && i === videoId) {
                          videoRef.current[i].play().catch(err => {
                            console.log('Video play on canplay error:', err);
                          });
                        }
                      }, 100);
                    }
                  }}
                  onWaiting={() => {
                    // Video is buffering
                    if (i === videoId) {
                      console.log(`Video ${i} is buffering...`);
                    }
                  }}
                  onStalled={() => {
                    // Video loading stalled
                    if (i === videoId) {
                      console.warn(`Video ${i} loading stalled`);
                    }
                  }}
                  onPause={() => {
                    // Update state if video is paused (but don't interfere with auto-advance)
                    if (i === videoId && !videoRef.current[i]?.ended) {
                      setVideo((pre) => ({ ...pre, isPlaying: false }));
                      if (onPlayPauseChange) onPlayPauseChange(false);
                    }
                  }}
                >
                  <source src={isMobile && list.videoMobile ? list.videoMobile : list.video} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="relative flex-center mt-2 md:mt-4 mb-1 md:mb-2">
        <div className="flex-center gap-2 md:gap-3">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-200 border border-gray-400 rounded-full relative cursor-pointer"
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
        <span>Join Launch List</span>
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
