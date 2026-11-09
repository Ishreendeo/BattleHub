import { Radio, CalendarClock } from 'lucide-react';
import { useData } from '../context/DataContext';
import MatchCard from '../components/match/MatchCard';
import EmptyState from '../components/common/EmptyState';

export default function LiveMatchCenter() {
  const { matches } = useData();
  const live = matches.filter((m) => m.status === 'live');
  const scheduled = matches.filter((m) => m.status === 'scheduled');

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold neon-text-purple flex items-center justify-center gap-2">
          <Radio className="text-magenta" /> Live Match Center
        </h1>
        <p className="text-ink-muted mt-2">Track timers, update scores, and call the finish live.</p>
      </div>

      <div className="mb-10">
        <h2 className="font-display text-lg font-semibold mb-4">Live Now</h2>
        {live.length === 0 ? (
          <EmptyState icon={Radio} title="No live matches" description="Start a scheduled match below to see it appear here in real time." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Ready to Start</h2>
        {scheduled.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nothing scheduled" description="Add matches from the Schedule page to queue them up here." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {scheduled.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </section>
  );
}
