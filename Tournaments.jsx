import { useMemo, useState } from 'react';
import { Search, ListFilter } from 'lucide-react';
import { useData } from '../context/DataContext';
import games from '../data/games.json';
import TournamentCard from '../components/tournament/TournamentCard';
import EmptyState from '../components/common/EmptyState';
import { SelectField } from '../components/common/FormField';

export default function Tournaments() {
  const { tournaments } = useData();
  const [query, setQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let list = tournaments.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
    if (gameFilter) list = list.filter((t) => t.game === gameFilter);
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    list = [...list].sort((a, b) => {
      if (sortBy === 'prize') return b.prizePool - a.prizePool;
      return new Date(a.date) - new Date(b.date);
    });
    return list;
  }, [tournaments, query, gameFilter, statusFilter, sortBy]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple">Tournaments</h1>
        <p className="text-ink-muted mt-2">Browse, search, and register for upcoming battles.</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 mb-8 grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium mb-1.5">Search tournaments</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input
              id="search"
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-void-soft border border-purple/25 focus:border-cyan text-ink focus-ring"
            />
          </div>
        </div>
        <SelectField
          id="gameFilter" label="Game" placeholder="All games" value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          options={games.map((g) => ({ value: g.id, label: g.name }))}
        />
        <SelectField
          id="statusFilter" label="Status" placeholder="All statuses" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'live', label: 'Live' }, { value: 'completed', label: 'Completed' }]}
        />
        <SelectField
          id="sortBy" label="Sort by" value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[{ value: 'date', label: 'Date' }, { value: 'prize', label: 'Prize Pool' }]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListFilter}
          title="No tournaments match your filters"
          description="Try adjusting your search or filters to see more events."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </section>
  );
}
