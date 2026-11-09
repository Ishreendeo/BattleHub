import { useMemo, useState } from 'react';
import { Search, Plus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import games from '../data/games.json';
import TeamCard from '../components/team/TeamCard';
import EmptyState from '../components/common/EmptyState';
import { TextField, SelectField, Button } from '../components/common/FormField';

export default function Teams() {
  const { teams, createTeam } = useData();
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', tag: '', region: '', game: 'valorant' });
  const [errors, setErrors] = useState({});

  const filtered = useMemo(
    () => teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [teams, query]
  );

  const handleCreate = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Team name is required.';
    if (form.tag && form.tag.length > 5) nextErrors.tag = 'Tag must be 5 characters or fewer.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const res = createTeam({ name: form.name, tag: form.tag, region: form.region, games: [form.game] });
    if (res.ok) {
      setForm({ name: '', tag: '', region: '', game: 'valorant' });
      setShowForm(false);
    } else {
      setErrors({ name: res.error });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple">Teams</h1>
          <p className="text-ink-muted mt-2">Browse rosters or register a new team of your own.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Create Team'}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="glass rounded-2xl p-5 sm:p-6 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden"
          >
            <TextField
              id="teamName" label="Team name" placeholder="e.g. Shadow Talons"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <TextField
              id="teamTag" label="Tag" placeholder="e.g. SHT" maxLength={5}
              value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
              error={errors.tag}
            />
            <TextField
              id="teamRegion" label="Region" placeholder="e.g. NA"
              value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
            <SelectField
              id="teamGame" label="Primary game" value={form.game}
              onChange={(e) => setForm({ ...form, game: e.target.value })}
              options={games.map((g) => ({ value: g.id, label: g.name }))}
            />
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit">Create Team</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mb-8 max-w-md">
        <label htmlFor="teamSearch" className="block text-sm font-medium mb-1.5">Search teams</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            id="teamSearch" type="text" placeholder="Search by team name..."
            value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-void-soft border border-purple/25 focus:border-cyan text-ink focus-ring"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No teams found" description="Try a different search term or create a new team." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t) => <TeamCard key={t.id} team={t} />)}
        </div>
      )}
    </section>
  );
}
