import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../common/FormField';

export default function BracketView({ tournamentId, bracket }) {
  const { getTeam, simulateBracketMatch } = useData();

  if (!bracket || !bracket.rounds.length) {
    return <p className="text-ink-muted text-sm">Bracket will generate once at least 2 teams register.</p>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {bracket.rounds.map((round, ri) => (
          <div key={ri} className="flex flex-col justify-around gap-6 min-w-[220px]">
            <p className="text-xs uppercase tracking-widest text-ink-muted text-center">
              {ri === bracket.rounds.length - 1 ? 'Final' : `Round ${ri + 1}`}
            </p>
            {round.map((match, mi) => {
              const teamA = match.teamAId ? getTeam(match.teamAId) : null;
              const teamB = match.teamBId ? getTeam(match.teamBId) : null;
              const canSimulate = teamA && teamB && !match.winnerId;
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-3"
                >
                  <MatchSlot team={teamA} isWinner={match.winnerId === teamA?.id} />
                  <div className="text-center text-[10px] text-ink-muted my-1">vs</div>
                  <MatchSlot team={teamB} isWinner={match.winnerId === teamB?.id} />
                  {canSimulate && (
                    <Button
                      variant="ghost"
                      className="w-full mt-2 !py-1.5 !text-xs"
                      onClick={() => simulateBracketMatch(tournamentId, ri, mi)}
                    >
                      <Zap size={12} /> Simulate Winner
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchSlot({ team, isWinner }) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm ${
        isWinner ? 'bg-success/15 text-success font-semibold' : team ? 'bg-white/5' : 'bg-white/[0.02] text-ink-muted italic'
      }`}
    >
      <span>{team?.logo || '—'}</span>
      <span className="truncate">{team?.name || 'TBD'}</span>
    </div>
  );
}
