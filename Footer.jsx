import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-purple/20 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Logo size={30} />
            <span className="font-display text-lg font-bold neon-text-purple">BATTLE HUB</span>
          </div>
          <p className="text-sm text-ink-muted max-w-xs">
            Compete. Conquer. Celebrate. The ultimate esports tournament management platform.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-cyan mb-3">Created By</h3>
          <p className="text-ink font-semibold">Team Front Fusion</p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            <li>Ishreen</li>
            <li>Sana</li>
            <li>Arshit</li>
          </ul>
          <Link to="/our-team" className="inline-block mt-3 text-sm text-purple-soft hover:text-cyan focus-ring rounded">
            Meet the team →
          </Link>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-cyan mb-3">Hackathon Project</h3>
          <p className="text-sm text-ink-muted">Esports Tournament Management Platform</p>
          <p className="text-sm text-ink-muted mt-2">
            <span className="text-ink font-medium">Problem statement:</span> Develop a front-end solution for
            tournament registrations, brackets, live scores, team profiles, and event engagement.
          </p>
        </div>
      </div>

      <div className="border-t border-purple/10 px-4 sm:px-6 py-5 text-center text-xs text-ink-muted">
        © 2026 Battle Hub. Built with React, Tailwind CSS, and Framer Motion.
      </div>
    </footer>
  );
}
