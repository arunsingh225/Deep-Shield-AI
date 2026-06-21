import { useLang } from '../contexts/LangContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-center text-slate-500 text-sm">
      <p>{t.builtBy} <span className="font-semibold text-slate-300">Neuro Galaxy</span></p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-2 h-2 rounded-full animate-pulse bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
        <span>Powered by Google Gemini 2.5 Flash</span>
      </div>
    </footer>
  );
}
