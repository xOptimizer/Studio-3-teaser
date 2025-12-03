import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import * as Sentry from '@sentry/react';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      // Wait for images and fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    preloadResources();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="bg-black">
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {!isLoading && (
        <>
          <TopBar />
          <Hero />
          <Highlights />
          {/* <Model /> */}
          {/* <Features /> */}
          {/* <HowItWorks /> */}
          {/* <Footer /> */}
        </>
      )}
    </main>
  )
}

export default Sentry.withProfiler(App);

