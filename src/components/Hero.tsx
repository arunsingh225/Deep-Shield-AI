import { motion } from 'motion/react';
import { Shield, Video, FileText, MessageSquare, Link2, Mic } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export function Hero({ navigate }: { navigate: (path: string) => void }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <Shield className="w-24 h-24 sm:w-32 sm:h-32 text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" strokeWidth={1.5} />
        </motion.div>
        <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full"></div>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center mb-6 tracking-tighter text-white leading-[1.1]">
        {t.protectingIndia}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 glow-text-cyan">
          {t.aiDeception}
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-400 max-w-2xl text-center mb-12 leading-relaxed">
        {t.heroDesc}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {[
          { path: '/deepfake', icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', hoverBorder: 'group-hover:border-rose-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]', title: t.navMediaScan, desc: t.scanMediaDesc },
          { path: '/voice', icon: Mic, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', hoverBorder: 'group-hover:border-fuchsia-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(232,121,249,0.3)]', title: t.scanVoice, desc: t.scanVoiceDesc },
          { path: '/document', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hoverBorder: 'group-hover:border-emerald-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]', title: t.navVerifyDoc, desc: t.verifyDocDesc },
          { path: '/scam', icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hoverBorder: 'group-hover:border-orange-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]', title: t.navCheckScam, desc: t.checkScamDesc },
          { path: '/url', icon: Link2, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', hoverBorder: 'group-hover:border-indigo-500/50', hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]', title: t.navCheckUrl, desc: t.checkUrlDesc },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`group relative flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border ${item.border} ${item.hoverBorder} ${item.hoverGlow} transition-all duration-300 overflow-hidden`}
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
              <item.icon className="w-6 h-6 stroke-2" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
