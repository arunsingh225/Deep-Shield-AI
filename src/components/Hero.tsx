import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, Video, FileText, MessageSquare, Link2, Mic, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

/** Floating particle field behind the hero */
function ParticleField() {
  const count = 18;
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      color: ['#06b6d4', '#6366f1', '#a855f7', '#22d3ee'][i % 4],
    })),
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Animated stat counter */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const end = value;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = Math.floor(eased * end);
      el.textContent = start.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, suffix]);

  return (
    <div className="text-center">
      <span ref={ref} className="text-2xl sm:text-3xl font-black text-slate-100">
        0{suffix}
      </span>
      <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">{label}</p>
    </div>
  );
}

const FEATURES = [
  { path: '/deepfake', icon: Video, color: 'text-rose-400', gradient: 'from-rose-500/20 to-rose-900/10', border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-500/50', glowColor: 'rgba(244,63,94,0.3)', titleKey: 'navMediaScan' as const, descKey: 'scanMediaDesc' as const },
  { path: '/voice', icon: Mic, color: 'text-fuchsia-400', gradient: 'from-fuchsia-500/20 to-fuchsia-900/10', border: 'border-fuchsia-500/20', hoverBorder: 'hover:border-fuchsia-500/50', glowColor: 'rgba(232,121,249,0.3)', titleKey: 'scanVoice' as const, descKey: 'scanVoiceDesc' as const },
  { path: '/document', icon: FileText, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-900/10', border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/50', glowColor: 'rgba(16,185,129,0.3)', titleKey: 'navVerifyDoc' as const, descKey: 'verifyDocDesc' as const },
  { path: '/scam', icon: MessageSquare, color: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-900/10', border: 'border-orange-500/20', hoverBorder: 'hover:border-orange-500/50', glowColor: 'rgba(249,115,22,0.3)', titleKey: 'navCheckScam' as const, descKey: 'checkScamDesc' as const },
  { path: '/url', icon: Link2, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-indigo-900/10', border: 'border-indigo-500/20', hoverBorder: 'hover:border-indigo-500/50', glowColor: 'rgba(99,102,241,0.3)', titleKey: 'navCheckUrl' as const, descKey: 'checkUrlDesc' as const },
];

export function Hero({ navigate }: { navigate: (path: string) => void }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20 relative"
    >
      <ParticleField />

      {/* Shield icon with dual-ring orbit */}
      <div className="relative mb-8 z-10">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <Shield className="w-24 h-24 sm:w-32 sm:h-32 text-cyan-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]" strokeWidth={1.5} />
        </motion.div>
        {/* Outer orbit ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-16px] border-2 border-dashed border-cyan-500/20 rounded-full"
          aria-hidden="true"
        />
        {/* Inner orbit ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-32px] border border-dashed border-indigo-500/15 rounded-full"
          aria-hidden="true"
        />
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-cyan-500/15 blur-[60px] rounded-full" />
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center mb-6 tracking-tighter text-slate-100 leading-[1.1] z-10">
        {t.protectingIndia}
        <br />
        <span className="gradient-text-cyan">
          {t.aiDeception}
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-400 max-w-2xl text-center mb-8 leading-relaxed z-10">
        {t.heroDesc}
      </p>

      {/* Animated stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-6 sm:gap-10 mb-12 z-10 glass rounded-2xl px-6 sm:px-10 py-4"
      >
        <StatCounter value={12400} suffix="+" label={t.scansAnalyzed} />
        <div className="w-px h-10 bg-slate-700" />
        <StatCounter value={99} suffix=".2%" label={t.accuracy} />
        <div className="w-px h-10 bg-slate-700" />
        <StatCounter value={2} suffix="s" label={t.speed} />
      </motion.div>

      {/* Feature cards — staggered entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl z-10">
        {FEATURES.map((item, i) => (
          <motion.button
            key={item.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i + 0.5, duration: 0.5 }}
            onClick={() => navigate(item.path)}
            className={`group relative flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl glass border ${item.border} ${item.hoverBorder} transition-all duration-300 overflow-hidden card-hover`}
            style={{ ['--glow-color' as string]: item.glowColor }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className={`relative z-10 p-3 rounded-xl bg-slate-800/50 ${item.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
              <item.icon className="w-6 h-6 stroke-2" />
            </div>
            <h3 className="relative z-10 text-slate-100 font-bold text-lg mb-2">{t[item.titleKey]}</h3>
            <p className="relative z-10 text-slate-400 text-sm">{t[item.descKey]}</p>

            {/* Arrow that slides in */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className={`w-5 h-5 ${item.color}`} />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
