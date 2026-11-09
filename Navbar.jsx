import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Trophy, Users, Radio, CalendarDays, BarChart3, Sparkles, Home } from 'lucide-react';
import Logo from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/tournaments', label: 'Tournaments', icon: Trophy },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/live', label: 'Live Matches', icon: Radio },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { to: '/predictor', label: 'AI Predictor', icon: Sparkles },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b border-purple/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 focus-ring rounded-lg" aria-label="Battle Hub home">
          <Logo size={34} />
          <span className="font-display text-xl font-bold tracking-wide neon-text-purple">BATTLE HUB</span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
                  isActive ? 'text-cyan bg-cyan/10' : 'text-ink-muted hover:text-ink hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-ink-muted hover:text-cyan hover:bg-white/5 transition-colors focus-ring"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="lg:hidden p-2 rounded-lg text-ink-muted hover:text-ink focus-ring"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-purple/20"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium focus-ring ${
                      isActive ? 'text-cyan bg-cyan/10' : 'text-ink-muted hover:text-ink hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
