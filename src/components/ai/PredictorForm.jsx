import { Sparkles } from 'lucide-react';
import { SelectField, Button } from '../common/FormField';

export default function PredictorForm({
  teams, games, teamAId, teamBId, gameId, mapName,
  onTeamAChange, onTeamBChange, onGameChange, onMapChange,
  onSubmit, disabled, loading, error,
}) {
  const selectedGame = games.find((g) => g.id === gameId);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Match prediction setup"
    >
      <SelectField
        id="teamA"
        label="Team A"
        placeholder="Select Team A"
        value={teamAId}
        onChange={(e) => onTeamAChange(e.target.value)}
        options={teams.map((t) => ({ value: t.id, label: `${t.logo} ${t.name}` }))}
      />
      <SelectField
        id="teamB"
        label="Team B"
        placeholder="Select Team B"
        value={teamBId}
        onChange={(e) => onTeamBChange(e.target.value)}
        options={teams.map((t) => ({ value: t.id, label: `${t.logo} ${t.name}` }))}
      />
      <SelectField
        id="game"
        label="Game"
        placeholder="Select game"
        value={gameId}
        onChange={(e) => onGameChange(e.target.value)}
        options={games.map((g) => ({ value: g.id, label: `${g.icon} ${g.name}` }))}
      />
      <SelectField
        id="map"
        label="Map (optional)"
        placeholder="Any map"
        value={mapName}
        onChange={(e) => onMapChange(e.target.value)}
        options={(selectedGame?.maps || []).map((m) => ({ value: m, label: m }))}
        disabled={!selectedGame}
      />

      {error && (
        <p className="sm:col-span-2 lg:col-span-4 text-sm text-magenta" role="alert">{error}</p>
      )}

      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" disabled={disabled} loading={loading} className="w-full sm:w-auto">
          <Sparkles size={16} />
          {loading ? 'Analyzing Match...' : 'Predict Match'}
        </Button>
      </div>
    </form>
  );
}
