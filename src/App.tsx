import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LangContext } from './contexts/LangContext';
import { SoundContext } from './contexts/SoundContext';
import { translations } from './i18n/translations';
import { isFirebaseConfigured, watchAuthUser, saveScanToCloud, subscribeToScanHistory } from './lib/firebase';
import { isDangerVerdict } from './types';
import type { LangType, ScanResult } from './types';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FeedbackWidget } from './components/FeedbackWidget';
import { ThemeProvider } from './contexts/ThemeContext';
import { Shield } from 'lucide-react';

// Lazy-loaded page components — each gets its own bundle chunk
const Hero = lazy(() => import('./components/Hero').then((m) => ({ default: m.Hero })));
const DeepfakeScanner = lazy(() => import('./components/DeepfakeScanner').then((m) => ({ default: m.DeepfakeScanner })));
const VoiceCloneChecker = lazy(() => import('./components/VoiceCloneChecker').then((m) => ({ default: m.VoiceCloneChecker })));
const DocumentVerifier = lazy(() => import('./components/DocumentVerifier').then((m) => ({ default: m.DocumentVerifier })));
const ScamChecker = lazy(() => import('./components/ScamChecker').then((m) => ({ default: m.ScamChecker })));
const UrlChecker = lazy(() => import('./components/UrlChecker').then((m) => ({ default: m.UrlChecker })));
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));

const LOCAL_HISTORY_KEY = 'deepshield_history';

/** Branded loading screen shown while lazy chunks are fetched. */
function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6" role="status" aria-label="Loading page">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shield className="w-14 h-14 text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
        </motion.div>
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-[-6px] border-2 border-cyan-500/30 rounded-full"
        />
      </div>
      {/* Shimmer skeleton bar */}
      <div className="w-48 h-2 rounded-full shimmer" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Inner app — must be inside <BrowserRouter> to use hooks. */
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [lang, setLang] = useState<LangType>('en');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Auth + history source
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = watchAuthUser((user) => setUserId(user?.uid ?? null));
      return unsubscribe;
    }
    const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch { /* ignore corrupt data */ }
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !userId) return;
    const unsubscribe = subscribeToScanHistory(userId, setHistory);
    return unsubscribe;
  }, [userId]);

  const toggleSound = () => setIsSoundEnabled((prev) => !prev);

  const playSound = (type: 'SAFE' | 'FAKE') => {
    if (!isSoundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'SAFE') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  const addToHistory = async (result: ScanResult) => {
    if (isFirebaseConfigured && userId) {
      try {
        await saveScanToCloud(result, userId);
      } catch (e) {
        console.warn('[Firebase] failed to save scan, falling back to in-memory only:', e);
        setHistory((prev) => [result, ...prev]);
      }
    } else {
      setHistory((prev) => {
        const next = [result, ...prev];
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    }

    playSound(isDangerVerdict(result.verdict) ? 'FAKE' : 'SAFE');
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
        <div className="min-h-screen flex flex-col font-sans">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-cyan-600 focus:text-white focus:px-4 focus:py-2">
            Skip to main content
          </a>
          <Navbar navigate={navigate} currentPath={location.pathname} />

          <main id="main-content" className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Hero navigate={navigate} />} />
                  <Route path="/deepfake" element={<DeepfakeScanner onScanComplete={addToHistory} />} />
                  <Route path="/voice" element={<VoiceCloneChecker onScanComplete={addToHistory} />} />
                  <Route path="/document" element={<DocumentVerifier onScanComplete={addToHistory} />} />
                  <Route path="/scam" element={<ScamChecker onScanComplete={addToHistory} />} />
                  <Route path="/url" element={<UrlChecker onScanComplete={addToHistory} />} />
                  <Route path="/dashboard" element={
                    <Dashboard history={history} isCloudSynced={isFirebaseConfigured && !!userId} />
                  } />
                  {/* Fallback — redirect unknown routes to home */}
                  <Route path="*" element={<Hero navigate={navigate} />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>

          <Footer />
          <FeedbackWidget />
        </div>
      </SoundContext.Provider>
    </LangContext.Provider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
