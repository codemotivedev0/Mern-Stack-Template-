const ACCENTS = {
  indigo: 'from-indigo-500 to-indigo-600',
  violet: 'from-violet-500 to-fuchsia-500',
  sky: 'from-sky-500 to-cyan-500',
};

// Numeric values get data-count so the page can animate them counting up
const StatCard = ({ label, value, suffix, hint, accent = 'indigo' }) => (
  <div
    data-card
    className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${ACCENTS[accent]}`} />
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-3 flex items-baseline gap-1.5">
      <span
        {...(typeof value === 'number' && { 'data-count': true })}
        className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums"
      >
        {value}
      </span>
      {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
    </p>
    {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
  </div>
);

export default StatCard;
