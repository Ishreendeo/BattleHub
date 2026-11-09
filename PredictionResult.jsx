import { motion } from 'framer-motion';
import { Trophy, Star, ShieldCheck, Swords } from 'lucide-react';
import WinProbabilityBar from './WinProbabilityBar';
import RecentForm from './RecentForm';
import RadarComparison from './RadarComparison';
import { keyStrengths } from '../../utils/predictionEngine';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function PredictionResult({ prediction, h2h }) {
  const { teamA, teamB, winner, confidence, mvpA, mvpB, reasons, comparison } = prediction;
  const reasoningText = reasons.map((r) => `• ${r}`).join('\n');
  const { output, done } = useTypewriter(reasoningText, 14);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Winner banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
        className="flex flex-col items-center text-center gap-2 py-4"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          <Trophy size={40} className="text-gold drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
        </motion.div>
        <p className="text-xs uppercase tracking-widest text-ink-muted">Predicted Winner</p>
        <p className="font-display text-2xl sm:text-3xl font-bold neon-text-purple">
          {winner.logo} {winner.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-ink-muted">Confidence Score</span>
          <span className="font-mono-num font-bold text-cyan text-lg">{confidence}%</span>
        </div>
      </motion.div>

      {/* Win probability bars */}
      <div className="grid gap-5 sm:grid-cols-2">
        <WinProbabilityBar team={teamA.team} probability={teamA.probability} color="#8b5cf6" />
        <WinProbabilityBar team={teamB.team} probability={teamB.probability} color="#22d3ee" />
      </div>

      {/* Radar comparison */}
      <div>
        <h3 className="font-display text-sm uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-2">
          <Swords size={14} /> Stat Comparison
        </h3>
        <RadarComparison data={comparison} teamA={teamA.team} teamB={teamB.team} />
      </div>

      {/* Strengths / MVP / Form grid */}
      <div className="grid gap-5 md:grid-cols-2">
        <TeamInsightCard team={teamA.team} mvp={mvpA} color="#8b5cf6" />
        <TeamInsightCard team={teamB.team} mvp={mvpB} color="#22d3ee" />
      </div>

      {/* Head to head */}
      {h2h && (
        <div className="glass rounded-xl p-4">
          <h3 className="font-display text-sm uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-2">
            <ShieldCheck size={14} /> Head-to-Head
          </h3>
          <p className="text-sm">
            {h2h.total > 0 ? (
              <>
                {teamA.team.name} <span className="text-purple-soft font-bold">{h2h.aWins}</span> — <span className="text-cyan font-bold">{h2h.bWins}</span> {teamB.team.name} across {h2h.total} recorded {h2h.total === 1 ? 'match' : 'matches'}.
              </>
            ) : (
              'No recorded matches yet between these two teams — this will be their first meeting on Battle Hub.'
            )}
          </p>
        </div>
      )}

      {/* AI reasoning typewriter */}
      <div className="glass rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none" aria-hidden="true" />
        <h3 className="font-display text-sm uppercase tracking-widest text-cyan mb-2 relative">AI Reasoning</h3>
        <pre className="whitespace-pre-wrap font-body text-sm text-ink leading-relaxed relative min-h-[4rem]">
          {output}
          {!done && <span className="inline-block w-2 h-4 bg-cyan ml-0.5 animate-pulse align-middle" />}
        </pre>
      </div>
    </motion.div>
  );
}

function TeamInsightCard({ team, mvp, color }) {
  const strengths = keyStrengths(team);
  return (
    <div className="glass rounded-xl p-4" style={{ borderColor: `${color}33` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{team.logo}</span>
        <span className="font-display font-semibold">{team.name}</span>
      </div>

      <div className="mb-3">
        <p className="text-xs text-ink-muted mb-1">Recent Form</p>
        <RecentForm form={team.stats.recentForm} />
      </div>

      <div className="mb-3">
        <p className="text-xs text-ink-muted mb-1 flex items-center gap-1"><Star size={12} /> Suggested MVP</p>
        <p className="text-sm font-medium">{mvp.name} <span className="text-ink-muted font-normal">· {mvp.role} · {mvp.kd.toFixed(2)} K/D</span></p>
      </div>

      <div>
        <p className="text-xs text-ink-muted mb-1.5">Key Strengths</p>
        <ul className="space-y-1">
          {strengths.map((s, i) => (
            <li key={i} className="text-sm flex items-start gap-1.5">
              <span style={{ color }}>▸</span> {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
