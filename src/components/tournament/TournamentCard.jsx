import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, CalendarDays } from 'lucide-react';
import Badge from '../common/Badge';
import games from '../../data/games.json';

export default function TournamentCard({ tournament }) {
  const game = games.find((g) => g.id === tournament.game);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl">{game?.icon}</span>
          <div className="min-w-0">
            <h3 className="font-display font-semibold truncate">{tournament.name}</h3>
            <p className="text-xs text-ink-muted">{game?.name}</p>
          </div>
        </div>
        <Badge status={tournament.status}>{tournament.status}</Badge>
      </div>

      <p className="text-sm text-ink-muted line-clamp-2">{tournament.description}</p>

      <div className="flex items-center justify-between text-sm mt-1">
        <span className="flex items-center gap-1.5 text-gold font-semibold">
          <Trophy size={14} /> ${tournament.prizePool.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5 text-ink-muted">
          <Users size={14} /> {tournament.registeredTeamIds.length}/{tournament.maxTeams}
        </span>
      </div>
      <span className="flex items-center gap-1.5 text-xs text-ink-muted">
        <CalendarDays size={13} /> {new Date(tournament.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>

      <Link
        to={`/tournaments/${tournament.id}`}
        className="mt-2 text-center text-sm font-semibold py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan/40 transition-colors focus-ring"
      >
        View Details
      </Link>
    </motion.div>
  );
}
