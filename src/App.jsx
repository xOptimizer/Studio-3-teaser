import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import HeroNew from './components/HeroNew';
import VideoSection from './components/VideoSection';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import * as Sentry from '@sentry/react';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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
          <Highlights onSlideChange={setCurrentSlide} />
          {/* <Model /> */}
          {/* <Features /> */}
          <HowItWorks />
          {/* <Footer /> */}
        </>
      )}
    </main>
  )
}

export default Sentry.withProfiler(App);

