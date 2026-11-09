import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const steps = [
  'Pulling recent match history...',
  'Weighing kill/death ratios...',
  'Scanning map win rates...',
  'Cross-referencing head-to-head data...',
  'Finalizing confidence score...',
];

export default function PredictionLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-14 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 scanline" aria-hidden="true" />
      <motion.div
        className="relative w-24 h-24 rounded-full border-2 border-purple/40 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-cyan"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
        <span className="font-display text-xs text-cyan tracking-widest">AI</span>
      </motion.div>
      <p className="mt-6 font-display text-lg neon-text-cyan">Analyzing Match Data</p>
      <motion.p
        key={stepIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-sm text-ink-muted"
      >
        {steps[stepIndex]}
      </motion.p>
    </div>
  );
}
