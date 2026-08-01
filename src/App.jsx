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
import AdminCheckInsPage from './pages/AdminCheckInsPage';
import AdminVerifyPage from './pages/AdminVerifyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import EventHomePromo from './components/EventHomePromo';
import { heroVideo } from './utils';
import { preloadAssets } from './utils/cloudinary';

const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [routeKey, setRouteKey] = useState(
    () => `${window.location.pathname}${window.location.search}`
  );
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    preloadAssets([heroVideo]);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setRouteKey(`${window.location.pathname}${window.location.search}`);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [currentPath]);

  const navigate = useCallback((path) => {
    const target = path.startsWith('/') ? path : `/${path}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === target) {
      scrollToTop();
      return;
    }
    window.history.pushState({}, '', target);
    setCurrentPath(window.location.pathname);
    setRouteKey(`${window.location.pathname}${window.location.search}`);
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
  } else if (currentPath === '/admin/check-ins') {
    pageContent = <AdminCheckInsPage onNavigate={navigate} />;
  } else if (currentPath.startsWith('/admin/verify')) {
    pageContent = <AdminVerifyPage key={routeKey} onNavigate={navigate} />;
  /* Disabled temporarily while the event is hidden.
  } else if (currentPath === '/event/checkout') {
    pageContent = <CheckoutPage onNavigate={navigate} />;
  } else if (currentPath === '/event') {
    pageContent = <EventPage onNavigate={navigate} />;
  }
  */
  } else if (currentPath === '/privacy') {
    pageContent = <PrivacyPolicyPage onNavigate={navigate} />;
  } else if (currentPath === '/terms') {
    pageContent = <TermsPage onNavigate={navigate} />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage onNavigate={navigate} />;
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

  const isHomePage = currentPath === '/';

  return (
    <main style={{ background: '#F7F7F7' }}>
      <TopBar onNavigate={navigate} currentPath={currentPath} />
      {pageContent}
      {/* Event promo popup temporarily disabled. */}
      {isHomePage && false && <EventHomePromo onNavigate={navigate} />}
      {currentPath !== '/event/checkout' && <Footer onNavigate={navigate} />}
    </main>
  );
};

export default App;
