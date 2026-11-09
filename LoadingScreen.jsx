import { motion } from 'framer-motion';
import Logo from '../common/Logo';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      >
        <Logo size={72} />
      </motion.div>
      <motion.h1
        className="font-display text-4xl font-bold mt-6 neon-text-purple tracking-widest"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        BATTLE HUB
      </motion.h1>
      <motion.p
        className="text-ink-muted mt-2 tracking-[0.3em] text-sm uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading the Arena...
      </motion.p>
      <div className="w-56 h-1 mt-6 rounded-full bg-panel-light overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple to-cyan"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
