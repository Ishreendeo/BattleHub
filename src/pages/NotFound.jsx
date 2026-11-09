import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
import { Button } from '../components/common/FormField';

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto px-4 py-24 text-center">
      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="inline-flex mb-6"
      >
        <Skull size={56} className="text-magenta drop-shadow-[0_0_16px_rgba(244,63,94,0.5)]" />
      </motion.div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple mb-3">Eliminated</h1>
      <p className="text-ink-muted mb-8">Looks like you've been eliminated from this round.</p>
      <Link to="/"><Button>Return to Battle Hub</Button></Link>
    </section>
  );
}
