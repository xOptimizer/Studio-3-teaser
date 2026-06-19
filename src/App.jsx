import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import HeroNew from './components/HeroNew';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import Footer from './components/Footer';
import EventPage from './components/EventPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminScanner from './pages/AdminScanner';
import AdminVerifyPage from './pages/AdminVerifyPage';
import { heroVideo } from './utils';
import { preloadAssets } from './utils/cloudinary';

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    preloadAssets([heroVideo]);
  }, []);

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

  let pageContent;

  if (currentPath === '/tickets') {
    pageContent = <MyTicketsPage onNavigate={navigate} />;
  } else if (currentPath === '/admin') {
    pageContent = <AdminDashboard onNavigate={navigate} />;
  } else if (currentPath === '/admin/scanner') {
    pageContent = <AdminScanner onNavigate={navigate} />;
  } else if (currentPath.startsWith('/admin/verify')) {
    pageContent = <AdminVerifyPage onNavigate={navigate} />;
  } else if (currentPath === '/event') {
    pageContent = <EventPage onNavigate={navigate} />;
  } else {
    pageContent = (
      <>
        <HeroNew onNavigate={navigate} />
        <QuoteSection onNavigate={navigate} />
        <MarketplaceSection onNavigate={navigate} />
        <StudioSection onNavigate={navigate} />
      </>
    );
  }

  return (
    <main style={{ background: '#F7F7F7' }}>
      <TopBar onNavigate={navigate} currentPath={currentPath} />
      {pageContent}
      <Footer onNavigate={navigate} />
    </main>
  );
};

export default App;
