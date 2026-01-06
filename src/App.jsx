import { useEffect } from 'react';
import TopBar from './components/TopBar';
import HeroNew from './components/HeroNew';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import { heroVideo } from './utils';
import { preloadAssets } from './utils/cloudinary';

const App = () => {
  // Preload critical assets for faster initial load
  useEffect(() => {
    // Preload hero video for instant playback
    preloadAssets([heroVideo]);
  }, []);

  return (
    <main style={{ background: '#F7F7F7' }}>
      <TopBar />
      <HeroNew />
      <QuoteSection />
      <MarketplaceSection />
      <StudioSection />
    </main>
  )
}

export default App;

