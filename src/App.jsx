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

const App = () => {
  return (
    <main style={{ background: '#F7F7F7' }}>
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
    </main>
  )
}

export default App;

