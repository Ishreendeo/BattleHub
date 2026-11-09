import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Radio, CheckCircle2, Sparkles, Swords } from 'lucide-react';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import MemberCard from '../components/common/MemberCard';
import { Button } from '../components/common/FormField';

const team = [
  { name: 'Ishreen', role: 'Frontend Developer' },
  { name: 'Sana', role: 'UI/UX Designer' },
  { name: 'Arshit', role: 'Frontend Developer' },
];

export default function Home() {
  const { teams, tournaments, matches } = useData();

  const registeredTeamsCount = new Set(tournaments.flatMap((t) => t.registeredTeamIds)).size;
  const activeMatches = matches.filter((m) => m.status === 'live').length;
  const completedMatches = matches.filter((m) => m.status === 'completed').length;
  const prizePool = tournaments.reduce((sum, t) => sum + t.prizePool, 0);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan/10 text-cyan border border-cyan/30 mb-5"
        >
          <Swords size={14} /> Compete. Conquer. Celebrate.
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-bold tracking-tight"
        >
          <span className="neon-text-purple">BATTLE</span>{' '}
          <span className="neon-text-cyan">HUB</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-lg sm:text-xl text-ink font-medium"
        >
          The Ultimate Esports Tournament Management Platform
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-ink-muted"
        >
          Battle Hub is a modern esports tournament platform designed to simplify tournament registrations,
          live match tracking, team management, leaderboards, and community engagement through an immersive
          gaming experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/tournaments"><Button>Join Tournament</Button></Link>
          <Link to="/tournaments"><Button variant="ghost">Explore Events</Button></Link>
        </motion.div>
      </section>

      {/* Live dashboard stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Registered Teams" value={registeredTeamsCount || teams.length} color="#8b5cf6" />
          <StatCard icon={Radio} label="Active Matches" value={activeMatches} color="#f43f5e" />
          <StatCard icon={CheckCircle2} label="Completed Matches" value={completedMatches} color="#34d399" />
          <StatCard icon={Trophy} label="Total Prize Pool" value={prizePool} prefix="$" color="#fbbf24" />
        </div>
      </section>

      {/* AI Predictor teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass neon-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-purple-soft mb-2">
              <Sparkles size={14} /> ArenaX Match Predictor
            </span>
            <h2 className="font-display text-2xl font-bold">See who wins before the match starts</h2>
            <p className="text-ink-muted mt-1 max-w-md">
              Our AI-inspired predictor compares live team stats, form, and map history to project a winner
              with a confidence score.
            </p>
          </div>
          <Link to="/predictor"><Button>Try AI Predictor</Button></Link>
        </motion.div>
      </section>

      {/* Meet the team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold neon-text-cyan">Meet the Team</h2>
          <p className="text-ink-muted mt-2">The builders behind Battle Hub — Team Front Fusion.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {team.map((m, i) => (
            <MemberCard key={m.name} name={m.name} role={m.role} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
