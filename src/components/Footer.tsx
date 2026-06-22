import { Shield, Github, ExternalLink, Phone } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-12 relative">
      {/* Animated gradient divider */}
      <div className="gradient-divider" />

      <div className="bg-slate-950/80 backdrop-blur-sm py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* Column 1 — About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cyan-500" />
              <span className="text-lg font-bold gradient-text-cyan">DeepShield AI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              India's first AI-powered platform protecting citizens from deepfakes, voice clones, document forgery, and digital scams.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              <span className="text-xs text-slate-500 font-mono">Powered by Google Gemini 2.5 Flash</span>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Media Scan', href: '/deepfake' },
                { label: 'Voice Check', href: '/voice' },
                { label: 'Verify Document', href: '/document' },
                { label: 'Scam Checker', href: '/scam' },
                { label: 'URL Safety', href: '/url' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Emergency / Report */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Report Cybercrime</h4>
            <div className="space-y-3 text-sm">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                cybercrime.gov.in
              </a>
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>Helpline: <span className="text-red-400 font-bold">1930</span></span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <a
                  href="https://github.com/jaisogani-ai/DeepShield-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-xs font-mono">View on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            {t.builtBy} <span className="font-semibold text-slate-400">Easycoder</span> — Google Build with AI 2026
          </p>
          <p className="text-slate-700 text-[10px] font-mono">
            Digital Asset Protection Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
