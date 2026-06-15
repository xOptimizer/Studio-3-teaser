import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import HeroNew from './components/HeroNew';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import Footer from './components/Footer';
import EventPage from './components/EventPage';
import { heroVideo } from './utils';
import { preloadAssets } from './utils/cloudinary';

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Preload critical assets for faster initial load
  useEffect(() => {
    // Preload hero video for instant playback
    preloadAssets([heroVideo]);
  }, []);

  // Listen to browser navigation changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <main style={{ background: '#F7F7F7' }}>
      {currentPath === '/event' ? (
        <>
          <TopBar onNavigate={navigate} currentPath={currentPath} />
          <EventPage onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </>
      ) : (
        <>
          <TopBar onNavigate={navigate} currentPath={currentPath} />
          <HeroNew onNavigate={navigate} />
          <QuoteSection onNavigate={navigate} />
          <MarketplaceSection onNavigate={navigate} />
          <StudioSection onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </>
      )}
    </main>
  );
};

export default App;

