export default function Avatar({ initials, tone = 'green', size = 'md' }) {
  return (
    <div className={`avatar tone-${tone} ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''}`}>
      {initials}
    </div>
  );
}