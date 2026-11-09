import { useState } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import games from '../data/games.json';
import MatchCard from '../components/match/MatchCard';
import EmptyState from '../components/common/EmptyState';
import { SelectField, TextField, Button } from '../components/common/FormField';

const emptyForm = { teamAId: '', teamBId: '', game: 'valorant', round: '', scheduledDate: '' };

export default function Schedule() {
  const { teams, matches, addMatch } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const upcoming = matches.filter((m) => m.status === 'scheduled');
  const live = matches.filter((m) => m.status === 'live');
  const completed = matches.filter((m) => m.status === 'completed');

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    if (!form.teamAId || !form.teamBId) { setError('Select both teams.'); return; }
    if (form.teamAId === form.teamBId) { setError('Teams must be different.'); return; }
    const res = addMatch(form);
    if (res.ok) {
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple flex items-center gap-2">
            <CalendarDays /> Match Schedule
          </h1>
          <p className="text-ink-muted mt-2">Add, edit, and organize upcoming, live, and completed matches.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Add Match'}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass rounded-2xl p-5 sm:p-6 mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 overflow-hidden"
          >
            <SelectField
              id="mTeamA" label="Team A" placeholder="Select team" value={form.teamAId}
              onChange={(e) => setForm({ ...form, teamAId: e.target.value })}
              options={teams.map((t) => ({ value: t.id, label: t.name }))}
            />
            <SelectField
              id="mTeamB" label="Team B" placeholder="Select team" value={form.teamBId}
              onChange={(e) => setForm({ ...form, teamBId: e.target.value })}
              options={teams.map((t) => ({ value: t.id, label: t.name }))}
            />
            <SelectField
              id="mGame" label="Game" value={form.game}
              onChange={(e) => setForm({ ...form, game: e.target.value })}
              options={games.map((g) => ({ value: g.id, label: g.name }))}
            />
            <TextField
              id="mRound" label="Round / label" placeholder="e.g. Quarterfinal"
              value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })}
            />
            <TextField
              id="mDate" label="Date" type="date"
              value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
            />
            {error && <p className="sm:col-span-2 lg:col-span-5 text-sm text-magenta" role="alert">{error}</p>}
            <div className="sm:col-span-2 lg:col-span-5">
              <Button type="submit">Add to Schedule</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <MatchGroup title="Live" items={live} />
      <MatchGroup title="Upcoming" items={upcoming} />
      <MatchGroup title="Completed" items={completed} />
    </section>
  );
}

function MatchGroup({ title, items }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-lg font-semibold mb-4">{title}</h2>
      {items.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} matches`} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((m) => <MatchCard key={m.id} match={m} showRemove />)}
        </div>
      )}
    </div>
  );
}
