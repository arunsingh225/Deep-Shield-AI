import { useEffect, useState } from 'react';

export function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = progress === 1 ? end : end * (1 - Math.pow(2, -10 * progress));
      setCount(Math.floor(current));
      if (progress < 1) rafId = window.requestAnimationFrame(step);
    };
    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [value, duration]);

  return <span>{count}</span>;
}
