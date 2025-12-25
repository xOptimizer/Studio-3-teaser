import { useState } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import HeroNew from './components/HeroNew';
import VideoSection from './components/VideoSection';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main style={{ background: '#F7F7F7' }}>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {!isLoading && (
        <>
          <TopBar />
          {/* <Hero /> */}
          <HeroNew />
          {/* <VideoSection /> */}
          <QuoteSection />
          <MarketplaceSection />
          <StudioSection />
          {/* <Highlights onSlideChange={setCurrentSlide} /> */}
          {/* <Model /> */}
          {/* <Features /> */}
          {/* <HowItWorks /> */}
          {/* <Footer /> */}
        </>
      )}
    </main>
  )
}

export default App;

