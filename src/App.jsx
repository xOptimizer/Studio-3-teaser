import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import HeroNew from './components/HeroNew';
import VideoSection from './components/VideoSection';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import StudioTrailerSection from './components/StudioTrailerSection';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import RegistrationModal from './components/RegistrationModal';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="bg-black">
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {!isLoading && (
        <>
          <TopBar currentSlide={currentSlide} totalSlides={3} />
          {/* <Hero /> */}
          <HeroNew />
          <VideoSection />
          <QuoteSection />
          <MarketplaceSection />
          <StudioSection />
          <StudioTrailerSection />
          {/* <Highlights onSlideChange={setCurrentSlide} /> */}
          {/* <Model /> */}
          {/* <Features /> */}
          {/* <HowItWorks /> */}
          {/* <Footer /> */}

          {/* Sticky Register Button */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 px-5 sm:px-7 md:px-9 py-2 sm:py-2.5 md:py-3 rounded-full text-black text-sm sm:text-base md:text-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-black/10 backdrop-blur-md"
            style={{ 
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              letterSpacing: '-0.01em',
              backgroundColor: 'rgba(250, 248, 243, 0.7)',
              backdropFilter: 'blur(12px) saturate(180%)',
              WebkitBackdropFilter: 'blur(12px) saturate(180%)'
            }}
          >
            <span>Join Launch List</span>
          </button>

          <RegistrationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </>
      )}
    </main>
  )
}

export default App;

