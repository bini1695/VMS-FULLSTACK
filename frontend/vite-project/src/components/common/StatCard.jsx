export default function StatCard({ icon, tone, label, value, hint, hintTone = '' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className={`stat-hint ${hintTone ? `accent-${hintTone}` : ''}`}>{hint}</div>}
      </div>
    </div>
  );
}