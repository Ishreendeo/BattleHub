import { motion } from 'framer-motion';
import { Users, Quote } from 'lucide-react';
import MemberCard from '../components/common/MemberCard';

const members = [
  { name: 'Ishreen', role: 'Frontend Developer' },
  { name: 'Sana', role: 'UI/UX Designer' },
  { name: 'Arshit', role: 'Frontend Developer' },
];

export default function OurTeam() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple/15 text-purple-soft border border-purple/30 mb-4">
          <Users size={14} /> Team Profile
        </span>
        <h1 className="font-display text-4xl font-bold neon-text-purple">Front Fusion</h1>
        <p className="text-ink-muted mt-2">The team behind Battle Hub</p>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass neon-border rounded-2xl p-6 sm:p-8 text-center mb-12"
      >
        <Quote className="mx-auto text-cyan mb-3" size={24} />
        <p className="font-display text-xl sm:text-2xl font-semibold italic">
          "Code Together. Play Together. Win Together."
        </p>
        <p className="text-xs text-ink-muted mt-3 uppercase tracking-widest">Team Motto</p>
      </motion.blockquote>

      <h2 className="font-display text-2xl font-bold text-center mb-6">Members</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {members.map((m, i) => (
          <MemberCard key={m.name} name={m.name} role={m.role} index={i} />
        ))}
      </div>
    </section>
  );
}
