import { motion } from 'framer-motion';

export default function WinProbabilityBar({ team, probability, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium flex items-center gap-1.5">
          <span>{team.logo}</span> {team.name}
        </span>
        <span className="font-mono-num font-bold text-lg" style={{ color }}>
          <AnimatedNumber value={probability} />%
        </span>
      </div>
      <div className="h-3 rounded-full bg-void-soft overflow-hidden border border-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 12px ${color}66` }}
          initial={{ width: '0%' }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function AnimatedNumber({ value }) {
  return <span>{value}</span>;
}
