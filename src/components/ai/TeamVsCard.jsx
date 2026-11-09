import { motion } from 'framer-motion';

export default function TeamVsCard({ teamA, teamB, gameLabel }) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 py-4">
      <TeamBlock team={teamA} align="right" />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="relative flex flex-col items-center shrink-0"
      >
        <div className="font-display text-2xl sm:text-3xl font-bold neon-text-purple">VS</div>
        {gameLabel && <span className="text-[10px] uppercase tracking-widest text-ink-muted mt-1">{gameLabel}</span>}
      </motion.div>
      <TeamBlock team={teamB} align="left" />
    </div>
  );
}

function TeamBlock({ team, align }) {
  if (!team) return <div className="flex-1" />;
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'right' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col items-center text-center min-w-0"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass neon-border flex items-center justify-center text-3xl sm:text-4xl mb-2">
        {team.logo}
      </div>
      <p className="font-display font-semibold text-sm sm:text-base truncate max-w-[8rem] sm:max-w-[10rem]">{team.name}</p>
      <p className="text-xs text-ink-muted">{team.tag} · {team.region}</p>
    </motion.div>
  );
}
