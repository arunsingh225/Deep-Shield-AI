import type { LucideIcon } from 'lucide-react';
import {
  Shield, FileText, MessageSquare, LayoutDashboard, Video, Link2, Mic,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useSound } from '../contexts/SoundContext';

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

  const navItems: NavItem[] = [
    { path: '/deepfake', label: t.navMediaScan, icon: Video },
    { path: '/voice', label: t.navVoiceScan, icon: Mic },
    { path: '/document', label: t.navVerifyDoc, icon: FileText },
    { path: '/scam', label: t.navCheckScam, icon: MessageSquare },
    { path: '/url', label: t.navCheckUrl, icon: Link2 },
    { path: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group" aria-label="Go to home page">
          <div className="relative">
            <Shield className="w-8 h-8 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-wider glow-text-cyan">
            DeepShield <span className="text-cyan-500">AI</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0" aria-label="Main navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${active
                    ? 'bg-cyan-950/50 text-cyan-400 glow-cyan border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={toggleSound}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 flex items-center whitespace-nowrap"
            aria-label={isSoundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          >
            {isSoundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 whitespace-nowrap"
            aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            हिंदी | EN
          </button>
        </nav>
      </div>
    </header>
  );
}
