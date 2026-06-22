import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

const PHASES: Record<string, string[]> = {
  media: ['Uploading file...', 'Analyzing pixels & motion...', 'Checking facial artifacts...', 'Scanning lighting patterns...', 'Generating report...'],
  voice: ['Uploading audio...', 'Analyzing spectral data...', 'Checking prosody patterns...', 'Detecting synthesis markers...', 'Generating report...'],
  document: ['Uploading document...', 'Checking font consistency...', 'Analyzing layout patterns...', 'Verifying watermarks & QR...', 'Generating report...'],
};

export function ScanningAnimation({ type }: { type: 'media' | 'document' | 'voice' }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phases = PHASES[type];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [phases.length]);

  const progress = ((phaseIndex + 1) / phases.length) * 100;

  return (
    <div className="absolute inset-0 glass-cyan rounded-2xl flex flex-col items-center justify-center overflow-hidden">
      {/* Hexagonal grid background */}
      <div className="absolute inset-0 hex-grid opacity-50 pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Scanning line */}
      <motion.div
        animate={{ translateY: ['-100%', '300%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] opacity-80"
      />

      {/* Shield + radar sweep */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Shield className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
        </motion.div>

        {/* Radar sweep overlay */}
        <div className="absolute inset-[-20px] radar-sweep pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="radar-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" fill="url(#radar-grad)" />
          </svg>
        </div>

        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-[-8px] border border-cyan-500/40 rounded-full"
          aria-hidden="true"
        />
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-[-8px] border border-cyan-500/30 rounded-full"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-2xl font-bold text-slate-100 mb-2 tracking-widest uppercase glow-text-cyan">DeepShield AI</h3>

      {/* Phase text with typing effect */}
      <motion.p
        key={phaseIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-cyan-400 font-mono text-sm tracking-wider typing-cursor h-5"
      >
        {phases[phaseIndex]}
      </motion.p>

      {/* Multi-phase progress bar */}
      <div className="w-64 mt-6">
        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full relative"
          >
            <div className="absolute inset-0 gradient-bar-stripe opacity-50" />
          </motion.div>
        </div>

        {/* Phase indicators */}
        <div className="flex justify-between mt-3">
          {phases.map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i <= phaseIndex
                    ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-700'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
