export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && <Icon size={40} className="text-ink-muted mb-4" aria-hidden="true" />}
      <h3 className="font-display text-xl font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-ink-muted text-sm max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
