const styles = {
  live: 'bg-magenta/15 text-magenta border-magenta/40',
  upcoming: 'bg-cyan/15 text-cyan border-cyan/40',
  completed: 'bg-white/10 text-ink-muted border-white/20',
  scheduled: 'bg-purple/15 text-purple-soft border-purple/40',
  win: 'bg-success/15 text-success border-success/40',
  loss: 'bg-magenta/15 text-magenta border-magenta/40',
};

export default function Badge({ status = 'upcoming', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.upcoming} ${className}`}>
      {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse" />}
      {children}
    </span>
  );
}
