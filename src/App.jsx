import { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import { useAuth } from './context/AuthContext';
import HeroNew from './components/HeroNew';
import QuoteSection from './components/QuoteSection';
import MarketplaceSection from './components/MarketplaceSection';
import StudioSection from './components/StudioSection';
import Footer from './components/Footer';
import EventPage from './components/EventPage';
import CheckoutPage from './pages/CheckoutPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import SetPasswordPage from './pages/SetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminScanner from './pages/AdminScanner';
import AdminVerifyPage from './pages/AdminVerifyPage';
import { heroVideo } from './utils';
import { preloadAssets } from './utils/cloudinary';

const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, loading: authLoading } = useAuth();

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

  useEffect(() => {
    scrollToTop();
  }, [currentPath]);

  const navigate = useCallback((path) => {
    if (window.location.pathname === path) {
      scrollToTop();
      return;
    }
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const isAdminRoute = currentPath.startsWith('/admin');
    const isTicketsRoute = currentPath === '/tickets';
    const isProfileRoute = currentPath === '/profile';
    const isSetPasswordRoute = currentPath === '/set-password';
    const needsPasswordChange = user?.mustChangePassword && user?.role !== 'admin';

    if (needsPasswordChange && !isSetPasswordRoute) {
      navigate('/set-password');
      return;
    }

    if (isSetPasswordRoute && !user) {
      navigate('/');
      return;
    }

    if (isSetPasswordRoute && user && !needsPasswordChange) {
      navigate('/tickets');
      return;
    }

    if ((isTicketsRoute || isProfileRoute) && !user) {
      navigate('/');
      return;
    }

    if (isAdminRoute && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [currentPath, user, authLoading, navigate]);

  let pageContent;

  if (currentPath === '/tickets') {
    pageContent = <MyTicketsPage onNavigate={navigate} />;
  } else if (currentPath === '/set-password') {
    pageContent = <SetPasswordPage onNavigate={navigate} />;
  } else if (currentPath === '/profile') {
    pageContent = <ProfilePage onNavigate={navigate} />;
  } else if (currentPath === '/admin') {
    pageContent = <AdminDashboard onNavigate={navigate} />;
  } else if (currentPath === '/admin/scanner') {
    pageContent = <AdminScanner onNavigate={navigate} />;
  } else if (currentPath.startsWith('/admin/verify')) {
    pageContent = <AdminVerifyPage onNavigate={navigate} />;
  } else if (currentPath === '/event/checkout') {
    pageContent = <CheckoutPage onNavigate={navigate} />;
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
      {currentPath !== '/event/checkout' && <Footer onNavigate={navigate} />}
    </main>
  );
};

export default App;
