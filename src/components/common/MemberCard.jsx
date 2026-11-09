import { motion } from 'framer-motion';

const initialsColor = ['#8b5cf6', '#22d3ee', '#f43f5e'];

export default function MemberCard({ name, role, team = 'Front Fusion', index = 0 }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 12px 40px -12px rgba(139,92,246,0.4)' }}
      className="glass rounded-2xl p-6 text-center transition-shadow"
    >
      <div
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-display text-2xl font-bold mb-4"
        style={{
          background: `linear-gradient(135deg, ${initialsColor[index % 3]}33, transparent)`,
          border: `2px solid ${initialsColor[index % 3]}66`,
          color: initialsColor[index % 3],
        }}
      >
        {initials}
      </div>
      <h3 className="font-display font-bold text-lg">{name}</h3>
      <p className="text-sm text-ink-muted mt-0.5">{role}</p>
      <p className="text-xs text-purple-soft mt-2 tracking-wide">{team}</p>
    </motion.div>
  );
}
