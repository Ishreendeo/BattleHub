import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy } from 'lucide-react';
import { useData } from '../context/DataContext';
import { computeLeaderboard } from '../utils/leaderboard';
import TeamLogo from '../components/team/TeamLogo';
import EmptyState from '../components/common/EmptyState';

const rankColors = ['#fbbf24', '#c0c5d1', '#d97757'];

export default function Leaderboard() {
  const { teams, matches } = useData();
  const rows = useMemo(() => computeLeaderboard(teams, matches), [teams, matches]);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-cyan flex items-center justify-center gap-2">
          <BarChart3 /> Leaderboard
        </h1>
        <p className="text-ink-muted mt-2">Rankings update automatically as matches are completed.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No results yet"
          description="Finish a match in the Live Match Center or simulate a bracket round to populate the leaderboard."
        />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_4rem_4rem_4rem] gap-2 px-4 sm:px-6 py-3 text-xs uppercase tracking-wider text-ink-muted border-b border-white/10">
            <span>Rank</span><span>Team</span><span className="text-center">W</span><span className="text-center">L</span><span className="text-center">Pts</span>
          </div>
          {rows.map((row, i) => (
            <motion.div
              key={row.team.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[3rem_1fr_4rem_4rem_4rem] gap-2 items-center px-4 sm:px-6 py-3 border-b border-white/5 last:border-0 hover:bg-white/5"
            >
              <span className="font-mono-num font-bold text-lg" style={{ color: rankColors[i] || '#8b93ab' }}>
                #{row.rank}
              </span>
              <span className="flex items-center gap-2 min-w-0">
                <TeamLogo logo={row.team.logo} size={28} />
                <span className="truncate text-sm font-medium">{row.team.name}</span>
              </span>
              <span className="text-center font-mono-num text-success">{row.wins}</span>
              <span className="text-center font-mono-num text-magenta">{row.losses}</span>
              <span className="text-center font-mono-num font-bold text-cyan">{row.points}</span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
