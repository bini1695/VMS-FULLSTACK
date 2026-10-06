import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { adminStats, teamMembers } from '../../data/mockData.js';

export default function AdminOverview() {
  return (
    <DashboardLayout
      title="Platform overview"
      subtitle="Thursday, 1 October 2026 · Northstar Animal Health network"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <div className="stats-grid">
        {adminStats.map((s) => (
          <StatCard key={s.label} {...s} hintTone={s.hintTone} />
        ))}
      </div>

      <div className="grid-2col">
        <Card
          title="User account management"
          subtitle="Vets, reception, pharmacy and laboratory teams"
          actions={
            <button className="btn btn-primary">
              <i className="fas fa-user-plus"></i> Add team member
            </button>
          }
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>Team member</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={m.initials} tone={m.tone} />
                      <div>
                        <strong>{m.name}</strong>
                        <span>{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{m.role}</td>
                  <td>{m.branch}</td>
                  <td>
                    <Badge tone={m.status === 'Active' ? 'green' : 'amber'}>
                      {m.status}
                    </Badge>
                  </td>
                  <td>
                    <button className="btn btn-ghost">
                      <i className="fas fa-ellipsis"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-between mt-16 text-sm text-muted">
            <span>Showing 4 of 48 accounts</span>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              View all users <i className="fas fa-arrow-right" style={{ fontSize: 10 }}></i>
            </a>
          </div>
        </Card>

        <Card title="Security & continuity" subtitle="Live platform checks">
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                margin: '0 auto 12px',
                background: 'conic-gradient(#2ea37b 0deg 353deg, #e6f5ee 353deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                98
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Strong security posture</div>
            <div className="text-sm text-muted">MFA enforced for 94% of accounts</div>
          </div>

          <div className="checklist-item">
            <div className="checklist-icon" style={{ background: 'var(--bg-tint-green)', color: 'var(--accent-green)' }}>
              <i className="fas fa-shield-halved"></i>
            </div>
            <div className="checklist-body">
              <strong>Access review</strong>
              <span>Completed 2 days ago</span>
            </div>
          </div>
          <div className="checklist-item">
            <div className="checklist-icon" style={{ background: 'var(--bg-tint-blue)', color: 'var(--accent-blue)' }}>
              <i className="fas fa-database"></i>
            </div>
            <div className="checklist-body">
              <strong>Nightly backup</strong>
              <span>Last run 02:00 · 4.2 GB</span>
            </div>
          </div>
          <div className="checklist-item">
            <div className="checklist-icon" style={{ background: 'var(--bg-tint-amber)', color: 'var(--accent-amber)' }}>
              <i className="fas fa-key"></i>
            </div>
            <div className="checklist-body">
              <strong>Credentials expiring</strong>
              <span>3 service accounts in 14 days</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}