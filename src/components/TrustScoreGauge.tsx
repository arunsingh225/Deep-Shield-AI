import { useEffect, useRef, useState } from 'react';
import { useLang } from '../contexts/LangContext';

/** Radial 0-100 trust gauge. 100 = fully trustworthy/safe, 0 = fully malicious. */
export function TrustScoreGauge({ score, band }: { score: number; band?: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const { t } = useLang();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  // Animated count-up
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const duration = 1000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * clamped));
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [clamped]);

  // Color stops for gradient
  const color = clamped >= 70 ? '#22c55e' : clamped >= 40 ? '#eab308' : '#ef4444';
  const gradId = `gauge-grad-${clamped}`;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        {/* Glow behind gauge */}
        <div
          className="absolute inset-2 rounded-full blur-xl opacity-30"
          style={{ background: color }}
          aria-hidden="true"
        />

        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={clamped >= 70 ? '#22d3ee' : clamped >= 40 ? '#f59e0b' : '#f87171'} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />

          {/* Active arc with gradient */}
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />

          {/* Tick mark at score position */}
          {clamped > 0 && clamped < 100 && (
            <circle
              cx="60"
              cy={60 - radius}
              r="4"
              fill={color}
              style={{
                transform: `rotate(${(clamped / 100) * 360}deg)`,
                transformOrigin: '60px 60px',
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: `drop-shadow(0 0 4px ${color})`,
              }}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{displayScore}</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-500">/ 100</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t.trustScore}</p>
        {band && (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
            style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
          >
            {band} CONFIDENCE
          </span>
        )}
      </div>
    </div>
  );
}
