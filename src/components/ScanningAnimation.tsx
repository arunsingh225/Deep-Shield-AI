import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export function ScanningAnimation({ type }: { type: 'media' | 'document' | 'voice' }) {
  const label = type === 'media' ? 'PIXELS & MOTION' : type === 'voice' ? 'AUDIO SPECTRUM' : 'PATTERN';
  return (
    <div className="absolute inset-0 bg-slate-900 border border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center glow-cyan overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <motion.div
        animate={{ translateY: ['-100%', '300%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-[6px] bg-cyan-400 shadow-[0_0_20px_#06b6d4] opacity-80"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Shield className="w-20 h-20 text-cyan-400 mb-6" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">DeepShield AI</h3>
      <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">ANALYZING {label}...</p>

      <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'easeInOut' }}
          className="h-full bg-cyan-500"
        />
      </div>
    </div>
  );
}
