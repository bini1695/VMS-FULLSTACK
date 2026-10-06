import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { securityChecks, securityEvents } from '../../data/adminData.js';

export default function Security() {
  return (
    <DashboardLayout
      title="Security & access"
      subtitle="Live platform checks · MFA enforced for 94% of accounts"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <div className="grid-2col">
        <Card title="Security posture" subtitle="Live platform checks">
          <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                margin: '0 auto 14px',
                background: 'conic-gradient(#2ea37b 0deg 353deg, #e6f5ee 353deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>98</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              Strong security posture
            </div>
            <div className="text-sm text-muted">
              3 checks need attention
            </div>
          </div>

          {securityChecks.map((c) => (
            <div key={c.title} className="checklist-item">
              <div
                className="checklist-icon"
                style={{
                  background: c.status === 'pass' ? 'var(--bg-tint-green)' : 'var(--bg-tint-amber)',
                  color: c.status === 'pass' ? 'var(--accent-green)' : 'var(--accent-amber)',
                }}
              >
                <i className={`fas ${c.icon}`}></i>
              </div>
              <div className="checklist-body" style={{ flex: 1 }}>
                <strong>{c.title}</strong>
                <span>{c.meta}</span>
              </div>
              <Badge tone={c.status === 'pass' ? 'green' : 'amber'}>
                {c.status === 'pass' ? 'Pass' : 'Review'}
              </Badge>
            </div>
          ))}
        </Card>

        <Card title="Recent security events" subtitle="Authentication and access changes">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>IP</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.map((e, i) => (
                <tr key={i}>
                  <td><strong>{e.time}</strong></td>
                  <td style={{ fontSize: 12.5 }}>{e.user}</td>
                  <td>{e.action}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{e.ip}</td>
                  <td><Badge tone={e.tone}>{e.result}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              background: 'var(--bg-tint-blue)',
              color: '#2c5c92',
              padding: 14,
              borderRadius: 10,
              marginTop: 16,
              fontSize: 13,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <i className="fas fa-circle-info"></i>
            <span>Enable MFA for the remaining 6% of accounts to reach full compliance.</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}