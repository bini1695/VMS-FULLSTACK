import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function DashboardLayout({
  title = '',
  subtitle = '',
  user = null,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar title={title} subtitle={subtitle} user={user} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}