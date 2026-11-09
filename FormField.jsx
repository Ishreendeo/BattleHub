export function TextField({ label, id, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-lg bg-void-soft border text-ink placeholder:text-ink-muted/60 focus-ring transition-colors ${
          error ? 'border-magenta' : 'border-purple/25 focus:border-cyan'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-magenta" role="alert">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, id, error, options, className = '', placeholder, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <select
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-lg bg-void-soft border text-ink focus-ring transition-colors ${
          error ? 'border-magenta' : 'border-purple/25 focus:border-cyan'
        }`}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-magenta" role="alert">{error}</p>}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple to-cyan text-void font-semibold hover:brightness-110 shadow-lg shadow-purple/20',
    ghost: 'bg-white/5 text-ink border border-white/15 hover:bg-white/10',
    danger: 'bg-magenta/15 text-magenta border border-magenta/40 hover:bg-magenta/25',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
