import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', color = '#8b5cf6' }) {
  const animated = useCountUp(value);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 flex items-center gap-4"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-mono-num text-2xl font-bold text-ink truncate">
          {prefix}{animated.toLocaleString()}{suffix}
        </p>
        <p className="text-xs text-ink-muted">{label}</p>
      </div>
    </motion.div>
  );
}
