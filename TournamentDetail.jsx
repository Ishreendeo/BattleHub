import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, CalendarDays, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import games from '../data/games.json';
import Badge from '../components/common/Badge';
import BracketView from '../components/tournament/BracketView';
import { SelectField, Button } from '../components/common/FormField';
import NotFound from './NotFound';

export default function TournamentDetail() {
  const { id } = useParams();
  const { tournaments, teams, registerTeamToTournament, brackets } = useData();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [regError, setRegError] = useState('');

  const tournament = tournaments.find((t) => t.id === id);
  if (!tournament) return <NotFound />;

  const game = games.find((g) => g.id === tournament.game);
  const registeredTeams = tournament.registeredTeamIds.map((tid) => teams.find((t) => t.id === tid)).filter(Boolean);
  const availableTeams = teams.filter((t) => !tournament.registeredTeamIds.includes(t.id));
  const bracket = brackets[tournament.id];

  const handleRegister = () => {
    setRegError('');
    if (!selectedTeam) {
      setRegError('Select a team to register.');
      return;
    }
    const res = registerTeamToTournament(tournament.id, selectedTeam);
    if (!res.ok) setRegError(res.error);
    else setSelectedTeam('');
  };

  const isFull = tournament.registeredTeamIds.length >= tournament.maxTeams;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/tournaments" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan mb-6 focus-ring rounded">
        <ArrowLeft size={15} /> Back to tournaments
      </Link>

      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{game?.icon}</span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{tournament.name}</h1>
              <p className="text-ink-muted text-sm">{game?.name}</p>
            </div>
          </div>
          <Badge status={tournament.status}>{tournament.status}</Badge>
        </div>
        <p className="text-ink-muted mb-4">{tournament.description}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-gold font-semibold"><Trophy size={16} /> ${tournament.prizePool.toLocaleString()} prize pool</span>
          <span className="flex items-center gap-1.5 text-ink-muted"><Users size={16} /> {tournament.registeredTeamIds.length}/{tournament.maxTeams} teams</span>
          <span className="flex items-center gap-1.5 text-ink-muted"><CalendarDays size={16} /> {new Date(tournament.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-5 lg:col-span-1">
          <h2 className="font-display font-semibold mb-3">Register a Team</h2>
          {isFull ? (
            <p className="text-sm text-ink-muted">This tournament is full.</p>
          ) : (
            <div className="space-y-3">
              <SelectField
                id="regTeam" label="Choose your team" placeholder="Select a team" value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                options={availableTeams.map((t) => ({ value: t.id, label: `${t.logo} ${t.name}` }))}
                error={regError}
              />
              <Button onClick={handleRegister} className="w-full">Register Team</Button>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="font-display font-semibold mb-3">Registered Teams</h2>
          {registeredTeams.length === 0 ? (
            <p className="text-sm text-ink-muted">No teams registered yet — be the first!</p>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-2">
              {registeredTeams.map((t) => (
                <li key={t.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm">
                  <span>{t.logo}</span> {t.name} <span className="text-ink-muted text-xs ml-auto">{t.region}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-semibold mb-4">Tournament Bracket</h2>
        <BracketView tournamentId={tournament.id} bracket={bracket} />
      </div>
    </section>
  );
}
