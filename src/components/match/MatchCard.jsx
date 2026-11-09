import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus, Flag, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Badge from '../common/Badge';
import TeamLogo from '../team/TeamLogo';
import games from '../../data/games.json';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MatchCard({ match, showControls = true, showRemove = false }) {
  const { getTeam, startMatch, pauseMatch, resetMatch, adjustScore, finishMatch, removeMatch } = useData();
  const teamA = getTeam(match.teamAId);
  const teamB = getTeam(match.teamBId);
  const game = games.find((g) => g.id === match.game);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-5 ${match.status === 'live' ? 'neon-border' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-muted flex items-center gap-1.5">
          {game?.icon} {game?.name} · {match.round}
        </span>
        <div className="flex items-center gap-2">
          <Badge status={match.status}>{match.status}</Badge>
          {showRemove && (
            <button onClick={() => removeMatch(match.id)} className="text-ink-muted hover:text-magenta focus-ring rounded p-1" aria-label="Remove match">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <TeamSide team={teamA} score={match.scoreA} isWinner={match.winnerId === teamA?.id} />
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="font-display text-lg text-ink-muted">VS</span>
          {match.status === 'live' && (
            <span className="font-mono-num text-sm text-cyan flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse" /> {formatTime(match.elapsedSeconds)}
            </span>
          )}
        </div>
        <TeamSide team={teamB} score={match.scoreB} isWinner={match.winnerId === teamB?.id} reverse />
      </div>

      {showControls && match.status !== 'completed' && (
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 justify-center">
          {match.status === 'scheduled' && (
            <button onClick={() => startMatch(match.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/15 text-success border border-success/30 hover:bg-success/25 focus-ring">
              <Play size={13} /> Start
            </button>
          )}
          {match.status === 'live' && (
            <>
              <ScoreButtons label={teamA?.tag} onAdd={() => adjustScore(match.id, 'A', 1)} onSub={() => adjustScore(match.id, 'A', -1)} />
              <button
                onClick={() => (match.isRunning ? pauseMatch(match.id) : startMatch(match.id))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple/15 text-purple-soft border border-purple/30 hover:bg-purple/25 focus-ring"
              >
                {match.isRunning ? <Pause size={13} /> : <Play size={13} />} {match.isRunning ? 'Pause' : 'Resume'}
              </button>
              <ScoreButtons label={teamB?.tag} onAdd={() => adjustScore(match.id, 'B', 1)} onSub={() => adjustScore(match.id, 'B', -1)} />
              <button onClick={() => finishMatch(match.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 focus-ring">
                <Flag size={13} /> Finish
              </button>
            </>
          )}
          <button onClick={() => resetMatch(match.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-ink-muted border border-white/10 hover:bg-white/10 focus-ring">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      )}
    </motion.div>
  );
}

function TeamSide({ team, score, isWinner, reverse }) {
  if (!team) return <div className="flex-1" />;
  return (
    <div className={`flex-1 flex items-center gap-2 min-w-0 ${reverse ? 'flex-row-reverse text-right' : ''}`}>
      <TeamLogo logo={team.logo} size={40} />
      <div className="min-w-0">
        <p className={`text-sm font-medium truncate ${isWinner ? 'text-success' : ''}`}>{team.name}</p>
        <p className="font-mono-num text-xl font-bold">{score}</p>
      </div>
    </div>
  );
}

function ScoreButtons({ label, onAdd, onSub }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg px-1.5 py-1">
      <span className="text-[10px] text-ink-muted px-1">{label}</span>
      <button onClick={onSub} className="p-1 rounded hover:bg-white/10 focus-ring" aria-label={`Decrease ${label} score`}><Minus size={12} /></button>
      <button onClick={onAdd} className="p-1 rounded hover:bg-white/10 focus-ring" aria-label={`Increase ${label} score`}><Plus size={12} /></button>
    </div>
  );
}
