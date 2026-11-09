import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', glow = false, as: Component = motion.div, ...props }) {
  return (
    <Component
      className={`glass rounded-2xl ${glow ? 'neon-border' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
