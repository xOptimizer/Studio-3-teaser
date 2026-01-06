import TopBar from './components/TopBar';
import HeroNew from './components/HeroNew';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';

const App = () => {
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

