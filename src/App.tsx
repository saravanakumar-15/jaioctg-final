import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { AboutPage } from './components/pages/AboutPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { QuotePage } from './components/pages/QuotePage';
import { ContactPage } from './components/pages/ContactPage';
import { fetchHealth } from './services/api';
import { BrandLogo } from './components/common/BrandLogo';
import { 
  AppView, 
  getInitialView, 
  initScrollRestoration, 
  navigateTo, 
  restoreScrollPosition 
} from './utils/navigation';

export default function App() {
  const initial = getInitialView();
  const [currentView, setCurrentViewInternal] = useState<AppView>(initial.view);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);
  const [loadingSplash, setLoadingSplash] = useState<boolean>(true);
  
  // Pending scroll target to restore after rendering
  const pendingScrollRef = useRef<{ x: number; y: number; hash?: string } | null>(null);

  // Setup browser history listener & scroll restoration
  useEffect(() => {
    fetchHealth().then(res => {
      setApiHealthy(res.status && res.status.includes('healthy'));
    });

    const timer = setTimeout(() => {
      setLoadingSplash(false);
    }, 500);

    // Initialize scroll restoration and handle popstate (back/forward)
    const cleanup = initScrollRestoration((view, targetScroll) => {
      pendingScrollRef.current = targetScroll || { x: 0, y: 0 };
      setCurrentViewInternal(view);
    });

    // Listen to custom navigation events from navigateTo
    const handleCustomNavigate = (e: any) => {
      const detail = e.detail;
      if (detail && detail.view) {
        if (!detail.noScroll) {
          if (detail.hash) {
            pendingScrollRef.current = { x: 0, y: 0, hash: detail.hash };
          } else {
            pendingScrollRef.current = { x: 0, y: 0 };
          }
        } else {
          pendingScrollRef.current = null;
        }
        setCurrentViewInternal(detail.view);
      }
    };

    window.addEventListener('jai_navigate', handleCustomNavigate);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
      window.removeEventListener('jai_navigate', handleCustomNavigate);
    };
  }, []);

  // Restore scroll position after React has committed the view update to the DOM
  useLayoutEffect(() => {
    if (pendingScrollRef.current) {
      const target = pendingScrollRef.current;
      pendingScrollRef.current = null;
      restoreScrollPosition(target);
    }
  }, [currentView]);

  // Unified navigation function passed down to child components
  const setCurrentView = (view: string) => {
    navigateTo(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage setCurrentView={setCurrentView} />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage setCurrentView={setCurrentView} />;
      case 'quote':
        return <QuotePage setCurrentView={setCurrentView} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  if (loadingSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-[#2154A5] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative animate-pulse">
          <BrandLogo variant="splash" />
        </div>
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Initializing Quality Assurance Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2154A5] text-white flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Subtle Background Glow Orbs in matching #2154A5 shades */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#2E68C8]/30 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#13356A]/50 blur-[150px]" />
        <div className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-[#3B7BE2]/20 blur-[160px]" />
      </div>

      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        apiHealthy={apiHealthy}
      />

      <main className="flex-1 relative z-10">
        {renderView()}
      </main>

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}

