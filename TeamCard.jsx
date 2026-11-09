import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TeamLogo from './TeamLogo';

export default function TeamCard({ team }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 flex flex-col items-center text-center gap-2"
    >
      <TeamLogo logo={team.logo} size={56} />
      <h3 className="font-display font-semibold">{team.name}</h3>
      <p className="text-xs text-ink-muted">{team.tag} · {team.region}</p>
      <p className="text-xs flex items-center gap-1 text-ink-muted"><Users size={12} /> {team.players.length} players</p>
      <div className="flex items-center gap-3 text-xs mt-1">
        <span className="text-purple-soft font-semibold">{team.stats.winRate}% WR</span>
        <span className="text-cyan font-semibold">{team.stats.avgKD.toFixed(2)} K/D</span>
      </div>
      <Link
        to={`/teams/${team.id}`}
        className="mt-2 w-full text-center text-sm font-semibold py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan/40 transition-colors focus-ring"
      >
        Manage Team
      </Link>
    </motion.div>
  );
}
