import { useLang } from '../contexts/LangContext';

/** Radial 0-100 trust gauge. 100 = fully trustworthy/safe, 0 = fully malicious. */
export function TrustScoreGauge({ score, band }: { score: number; band?: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const { t } = useLang();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = clamped >= 70 ? '#22c55e' : clamped >= 40 ? '#eab308' : '#ef4444';

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{clamped}</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-500">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t.trustScore}</p>
        {band && (
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wider"
            style={{ color, backgroundColor: `${color}22`, border: `1px solid ${color}55` }}
          >
            {band} CONFIDENCE
          </span>
        )}
      </div>
    </div>
  );
}
