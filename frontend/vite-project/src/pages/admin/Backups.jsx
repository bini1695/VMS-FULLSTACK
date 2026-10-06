import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { backups as initialBackups, backupSchedule } from '../../data/adminData.js';

export default function Backups() {
  const [backups, setBackups] = useState(initialBackups);
  const [running, setRunning] = useState(false);

  const runBackup = () => {
    setRunning(true);
    const newBackup = {
      id: `BK-${new Date().toISOString().slice(0, 10)}`,
      type: 'Full',
      size: '—',
      started: new Date().toLocaleString(),
      duration: 'running…',
      status: 'Running',
      tone: 'blue',
    };
    setBackups((prev) => [newBackup, ...prev]);

    setTimeout(() => {
      setBackups((prev) =>
        prev.map((b) =>
          b.status === 'Running'
            ? { ...b, size: '4.3 GB', duration: '11 min', status: 'Completed', tone: 'green' }
            : b
        )
      );
      setRunning(false);
    }, 2000);
  };

  return (
    <DashboardLayout
      title="Backups"
      subtitle="Automated nightly backups · Off-site replication active"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <div className="grid-2col">
        <Card
          title="Backup history"
          subtitle="Most recent 6 runs"
          actions={
            <button
              className="btn btn-primary"
              onClick={runBackup}
              disabled={running}
            >
              <i className="fas fa-play"></i>
              {running ? 'Backup running…' : 'Run backup now'}
            </button>
          }
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>Backup ID</th>
                <th>Type</th>
                <th>Size</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id}>
                  <td><strong style={{ fontSize: 12.5 }}>{b.id}</strong></td>
                  <td>{b.type}</td>
                  <td>{b.size}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{b.started}</td>
                  <td>{b.duration}</td>
                  <td><Badge tone={b.tone}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Backup schedule" subtitle="Recurring jobs">
            {backupSchedule.map((s) => (
              <div key={s.label} className="checklist-item">
                <div
                  className="checklist-icon"
                  style={{ background: 'var(--bg-tint-green)', color: 'var(--accent-green)' }}
                >
                  <i className="fas fa-clock"></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>{s.label}</strong>
                  <span>{s.meta}</span>
                </div>
                <strong style={{ fontSize: 12.5 }}>{s.value}</strong>
              </div>
            ))}
          </Card>

          <Card title="Storage">
            <div style={{ marginBottom: 12 }}>
              <div className="flex-between" style={{ marginBottom: 6, fontSize: 13 }}>
                <span>Used</span>
                <strong>2.4 TB / 3.0 TB</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#eef2f1', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: 'var(--primary)' }}></div>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              80% of backup vault used · retention policies active
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}