import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const INDIA_TOPO_JSON = '/india-topo.json';

const THREAT_CITIES = [
  { name: 'Mumbai', level: 'CRITICAL', coordinates: [72.8777, 19.0760], type: 'Deepfake Video' },
  { name: 'New Delhi', level: 'CRITICAL', coordinates: [77.2090, 28.6139], type: 'UPI Scam SMS' },
  { name: 'Bengaluru', level: 'CRITICAL', coordinates: [77.5946, 12.9716], type: 'Fraudulent Domain' },
  { name: 'Hyderabad', level: 'CRITICAL', coordinates: [78.4867, 17.3850], type: 'Identity Theft' },
  { name: 'Kolkata', level: 'CRITICAL', coordinates: [88.3639, 22.5726], type: 'Fake Passport' },
  { name: 'Chennai', level: 'HIGH', coordinates: [80.2707, 13.0827], type: 'Phishing Attack' },
  { name: 'Ahmedabad', level: 'HIGH', coordinates: [72.5714, 23.0225], type: 'Document Forgery' },
  { name: 'Jaipur', level: 'HIGH', coordinates: [75.7873, 26.9124], type: 'Scam Call' },
  { name: 'Pune', level: 'HIGH', coordinates: [73.8567, 18.5204], type: 'Deepfake Audio' },
  { name: 'Lucknow', level: 'HIGH', coordinates: [80.9462, 26.8467], type: 'UPI Fraud' },
  { name: 'Surat', level: 'HIGH', coordinates: [72.8311, 21.1702], type: 'Banking Malware' },
  { name: 'Bhopal', level: 'HIGH', coordinates: [77.4126, 23.2599], type: 'Fake App Link' },
  { name: 'Patna', level: 'MEDIUM', coordinates: [85.1376, 25.5941], type: 'Spam SMS' },
  { name: 'Nagpur', level: 'MEDIUM', coordinates: [79.0882, 21.1458], type: 'Suspicious Email' },
  { name: 'Indore', level: 'MEDIUM', coordinates: [75.8577, 22.7196], type: 'Fake Certificate' },
  { name: 'Visakhapatnam', level: 'MEDIUM', coordinates: [83.2185, 17.6868], type: 'Malicious URL' },
  { name: 'Kochi', level: 'MEDIUM', coordinates: [76.2673, 9.9312], type: 'Botnet Activity' },
];

interface TickerNewsItem {
  id: number;
  city: string;
  level: string;
  threat: string;
  timeStr: string;
}

interface TooltipData {
  name: string;
  level: string;
  type: string;
  threats: number;
  time: number;
  x: number;
  y: number;
}

export function IndiaThreatMap() {
  const [activeThreats, setActiveThreats] = useState(1243);
  const [tickerNews, setTickerNews] = useState<TickerNewsItem[]>([]);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    const int1 = setInterval(() => {
      setActiveThreats(prev => prev + 1);
    }, 4500);
    return () => clearInterval(int1);
  }, []);

  useEffect(() => {
    let nextId = 0;
    const generateNews = () => {
      const city = THREAT_CITIES[Math.floor(Math.random() * THREAT_CITIES.length)];
      return {
        id: ++nextId,
        city: city.name,
        level: city.level,
        threat: city.type + ' flagged',
        timeStr: `${Math.floor(Math.random() * 5) + 1} mins ago`,
      };
    };

    setTickerNews(Array.from({ length: 8 }, generateNews));

    const int2 = setInterval(() => {
      setTickerNews(prev => {
        const next = [...prev, generateNews()];
        if (next.length > 20) next.shift();
        return next;
      });
    }, 30000);
    return () => clearInterval(int2);
  }, []);

  const getLevelColor = (level: string) => {
    if (level === 'CRITICAL') return '#ef4444';
    if (level === 'HIGH') return '#f97316';
    return '#eab308';
  };

  const getBorderClass = (level: string) => {
    if (level === 'CRITICAL') return 'border-red-500 text-red-500';
    if (level === 'HIGH') return 'border-orange-500 text-orange-500';
    return 'border-yellow-500 text-yellow-500';
  };

  return (
    <div className="w-full flex flex-col bg-[#050a18] rounded-2xl border-2 border-slate-800 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(#00d4ff 1px, transparent 1px),
            linear-gradient(90deg, #00d4ff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="relative z-10 flex flex-wrap items-center justify-between p-4 border-b border-slate-800/80 bg-[#0a0f1e]/90 backdrop-blur-md">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 font-mono text-sm tracking-wider font-bold">CRITICAL: 5</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-950/40 px-3 py-1.5 rounded-lg border border-orange-900/60 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-orange-400 font-mono text-sm tracking-wider font-bold">HIGH: 7</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-950/40 px-3 py-1.5 rounded-lg border border-yellow-900/60 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
          <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span className="text-yellow-400 font-mono text-sm tracking-wider font-bold">SIMULATED THREATS: <span className="text-slate-100">{activeThreats}</span></span>
        </div>
      </div>

      <div className="relative w-full h-[500px] flex items-center justify-center pt-8 z-10">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 850, center: [80, 22] }}
          className="w-full h-full"
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="outline-none transition-colors duration-300"
                  style={{
                    default: { outline: 'none', fill: '#0a0f1e', stroke: '#00d4ff', strokeWidth: 0.6, filter: 'drop-shadow(0px 0px 3px rgba(0, 212, 255, 0.4))' },
                    hover: { outline: 'none', fill: '#0f172a', stroke: '#00d4ff', strokeWidth: 1, filter: 'drop-shadow(0px 0px 5px rgba(0, 212, 255, 0.8))' },
                    pressed: { outline: 'none', fill: '#0a0f1e', stroke: '#00d4ff' },
                  }}
                />
              ))
            }
          </Geographies>

          {THREAT_CITIES.map(({ name, level, coordinates, type }) => {
            const size = level === 'CRITICAL' ? 6 : level === 'HIGH' ? 4.5 : 3;
            const getStaticDelay = (str: string) => (str.charCodeAt(0) % 5) * 0.5;
            const delay = getStaticDelay(name);

            return (
              <Marker
                key={name}
                coordinates={coordinates as [number, number]}
                onMouseEnter={(e) => {
                  setTooltip({
                    name, level, type,
                    threats: Math.floor(Math.random() * 89) + 10,
                    time: Math.floor(Math.random() * 15) + 1,
                    x: e.clientX, y: e.clientY,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <g className="cursor-pointer">
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay}s` }} />
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay + 0.6}s` }} />
                  <circle r={size} fill="none" stroke={getLevelColor(level)} strokeWidth="1" className="map-ring" style={{ animationDelay: `${delay + 1.2}s` }} />

                  <circle
                    r={size * 0.8}
                    fill={getLevelColor(level)}
                    className="map-dot-pulse"
                    style={{
                      filter: `drop-shadow(0 0 10px ${getLevelColor(level)})`,
                      animationDelay: `${delay}s`,
                    }}
                  />

                  {level !== 'MEDIUM' && (
                    <text x={10} y={4} fontSize={10} fill="#cbd5e1" fontFamily="monospace" fontWeight="bold" className="pointer-events-none drop-shadow-md">
                      {name}
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* CSS animations are defined in index.css instead of dangerouslySetInnerHTML */}

        <div className="absolute bottom-6 right-6 bg-[#0a0f1e]/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl flex flex-col gap-3 z-10 font-mono text-xs text-slate-300 shadow-xl">
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span> Critical Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span> High Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> Medium Threat</div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-cyan-500 opacity-50"></span> Monitored City</div>
        </div>

        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                left: tooltip.x + 15,
                top: tooltip.y - 40,
                pointerEvents: 'none',
                zIndex: 100,
              }}
              className="theme-card theme-border border border-cyan-500/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,212,255,0.2)] min-w-[220px]"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-slate-100 font-bold text-lg">{tooltip.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBorderClass(tooltip.level)} bg-slate-900`}>
                  {tooltip.level}
                </span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-slate-400">Active Threats: <span className="text-slate-200 font-bold">{tooltip.threats}</span></div>
                <div className="text-slate-400">Last Scan: <span className="text-slate-200">{tooltip.time} mins ago</span></div>
                <div className="text-cyan-400 mt-2 truncate w-full pt-1 border-t border-slate-700">Dominant: {tooltip.type}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-slate-800/80 bg-[#000000] text-sm font-mono py-3 overflow-hidden flex items-center shadow-inner relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>
        <div className="marquee-container space-x-12 px-4 hover:[animation-play-state:paused]">
          {[...tickerNews, ...tickerNews].map((news, i) => (
            <div key={`${news.id}-${i}`} className="flex items-center gap-3">
              <span className="font-bold text-slate-200">
                [{news.level === 'CRITICAL' ? '🔴 CRITICAL' : news.level === 'HIGH' ? '🟠 HIGH' : '🟡 MEDIUM'}] {news.city}
              </span>
              <span className="text-slate-400">— {news.threat}</span>
              <span className="text-slate-500">— {news.timeStr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
