export default function RecentForm({ form = [] }) {
  if (!form.length) return <span className="text-xs text-ink-muted">No recent matches</span>;
  return (
    <div className="flex gap-1.5">
      {form.map((res, i) => (
        <span
          key={i}
          className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold border ${
            res === 'W'
              ? 'bg-success/15 text-success border-success/40'
              : 'bg-magenta/15 text-magenta border-magenta/40'
          }`}
        >
          {res}
        </span>
      ))}
    </div>
  );
}
