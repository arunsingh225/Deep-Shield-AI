import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Shield, FileText, MessageSquare, LayoutDashboard, Video, Link2, Mic, Menu, X, Sun, Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '../contexts/LangContext';
import { useSound } from '../contexts/SoundContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface NavbarProps {
  navigate: (path: string) => void;
  currentPath: string;
}

export function Navbar({ navigate, currentPath }: NavbarProps) {
  const { lang, setLang, t } = useLang();
  const { isSoundEnabled, toggleSound } = useSound();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: '/deepfake', label: t.navMediaScan, icon: Video },
    { path: '/voice', label: t.navVoiceScan, icon: Mic },
    { path: '/document', label: t.navVerifyDoc, icon: FileText },
    { path: '/scam', label: t.navCheckScam, icon: MessageSquare },
    { path: '/url', label: t.navCheckUrl, icon: Link2 },
    { path: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-cyan px-4 py-3">
        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-0 right-0 gradient-divider" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <button onClick={() => handleNav('/')} className="flex items-center gap-3 group" aria-label="Go to home page">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
              <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-wider">
              <span className="gradient-text-cyan">DeepShield</span>{' '}
              <span className="text-cyan-500">AI</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${active
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {/* Animated underline indicator */}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 rounded-full"
                      style={{ boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Pill toggles */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-700/50">
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-full text-xs glass-light text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={toggleSound}
                className="px-3 py-1.5 rounded-full text-xs glass-light text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                aria-label={isSoundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              >
                {isSoundEnabled ? '🔊' : '🔇'}
                <span className="hidden xl:inline">{isSoundEnabled ? 'On' : 'Off'}</span>
              </button>

              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="px-3 py-1.5 rounded-full text-xs font-bold glass-light text-slate-300 hover:text-white transition-all"
                aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-72 glass z-50 lg:hidden flex flex-col p-6 overflow-y-auto"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold gradient-text-cyan">DeepShield AI</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-white" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${active
                          ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-700/50 flex flex-col gap-3">
                <button
                  onClick={toggleTheme}
                  className="w-full px-3 py-2.5 rounded-xl text-sm glass-light text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={toggleSound}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm glass-light text-slate-300 hover:text-white transition-all text-center"
                  >
                    {isSoundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
                  </button>
                  <button
                    onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold glass-light text-slate-300 hover:text-white transition-all text-center"
                  >
                    {lang === 'en' ? 'हिंदी' : 'English'}
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
