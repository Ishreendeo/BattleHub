import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { useData } from '../context/DataContext';
import games from '../data/games.json';
import GlassCard from '../components/common/GlassCard';
import PredictorForm from '../components/ai/PredictorForm';
import TeamVsCard from '../components/ai/TeamVsCard';
import PredictionLoader from '../components/ai/PredictionLoader';
import PredictionResult from '../components/ai/PredictionResult';
import { predictMatch } from '../utils/predictionEngine';

export default function AIPredictor() {
  const { teams, matches } = useData();
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [gameId, setGameId] = useState('');
  const [mapName, setMapName] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const teamA = teams.find((t) => t.id === teamAId);
  const teamB = teams.find((t) => t.id === teamBId);
  const game = games.find((g) => g.id === gameId);

  const h2h = useMemo(() => {
    if (!teamAId || !teamBId) return null;
    const relevant = matches.filter(
      (m) =>
        m.status === 'completed' &&
        ((m.teamAId === teamAId && m.teamBId === teamBId) || (m.teamAId === teamBId && m.teamBId === teamAId))
    );
    const aWins = relevant.filter((m) => m.winnerId === teamAId).length;
    const bWins = relevant.filter((m) => m.winnerId === teamBId).length;
    return { total: relevant.length, aWins, bWins };
  }, [matches, teamAId, teamBId]);

  const handleSubmit = () => {
    setError('');
    if (!teamAId || !teamBId) {
      setError('Please select both Team A and Team B.');
      return;
    }
    if (teamAId === teamBId) {
      setError('Team A and Team B must be different teams.');
      return;
    }
    if (!gameId) {
      setError('Please select a game.');
      return;
    }
    setPrediction(null);
    setLoading(true);
    setTimeout(() => {
      const result = predictMatch(teamA, teamB, mapName || null);
      setPrediction(result);
      setLoading(false);
    }, 2400);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <header className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple/15 text-purple-soft border border-purple/30 mb-4">
          <BrainCircuit size={14} /> ArenaX Match Predictor
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple">AI Match Predictor</h1>
        <p className="text-ink-muted mt-2 max-w-xl mx-auto">
          Pick two teams and a game — ArenaX crunches live roster stats, recent form, and map history to
          project a winner, entirely in your browser.
        </p>
      </header>

      <GlassCard glow className="p-5 sm:p-8 relative overflow-hidden">
        <PredictorForm
          teams={teams}
          games={games}
          teamAId={teamAId}
          teamBId={teamBId}
          gameId={gameId}
          mapName={mapName}
          onTeamAChange={setTeamAId}
          onTeamBChange={setTeamBId}
          onGameChange={(id) => { setGameId(id); setMapName(''); }}
          onMapChange={setMapName}
          onSubmit={handleSubmit}
          disabled={loading}
          loading={loading}
          error={error}
        />

        {(teamA || teamB) && !loading && !prediction && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <TeamVsCard teamA={teamA} teamB={teamB} gameLabel={game?.name} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loader" exit={{ opacity: 0 }} className="mt-4">
              <PredictionLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {prediction && !loading && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <TeamVsCard teamA={teamA} teamB={teamB} gameLabel={game?.name} />
            <div className="mt-4">
              <PredictionResult prediction={prediction} h2h={h2h} />
            </div>
          </div>
        )}

        {!teamA && !teamB && !loading && !prediction && (
          <div className="mt-8 flex flex-col items-center text-center text-ink-muted py-8">
            <Sparkles size={28} className="mb-2 text-purple-soft" />
            <p className="text-sm">Select two teams above to run an AI-powered prediction.</p>
          </div>
        )}
      </GlassCard>
    </section>
  );
}
