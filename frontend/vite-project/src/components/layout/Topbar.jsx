import Avatar from '../common/Avatar.jsx';

const DEFAULT_USER = {
  name: 'Dr. Mensah',
  role: 'Veterinarian',
  initials: 'AM',
  tone: 'green',
};

export default function Topbar({ title, subtitle, user }) {
  const currentUser = user || DEFAULT_USER;

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <i className="fas fa-magnifying-glass"></i>
          <input placeholder="Search records, animals..." />
        </div>

        <button className="icon-btn">
          <i className="fas fa-bell"></i>
          <span className="notif-dot"></span>
        </button>

        <div className="topbar-user">
          <div className="topbar-user-text">
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
          <Avatar initials={currentUser.initials} tone={currentUser.tone} />
        </div>
      </div>
    </header>
  );
}