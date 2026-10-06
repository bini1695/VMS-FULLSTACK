export default function Badge({ children, tone = 'gray', icon }) {
  return (
    <span className={`badge ${tone}`}>
      {icon && <i className={`fas ${icon}`}></i>}
      {children}
    </span>
  );
}