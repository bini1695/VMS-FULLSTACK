import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import { equipment } from '../../data/labData.js';
import './Lab.css';

export default function Equipment() {
  const online = equipment.filter((e) => e.status === 'Online').length;

  const stats = [
    { label: 'Analyzers online', value: `${online} / ${equipment.length}`, hint: 'All systems operational', icon: 'fa-microscope',         tone: 'green' },
    { label: 'Maintenance due',  value: equipment.filter((e) => e.status === 'Maintenance').length, hint: 'Scheduled tasks',       icon: 'fa-wrench',            tone: 'amber' },
    { label: 'Last sync',        value: '2 min',                          hint: 'Across all analyzers',   icon: 'fa-rotate',            tone: 'blue'  },
    { label: 'QC status',        value: 'Pass',                           hint: 'All runs successful',    icon: 'fa-circle-check',      tone: 'green' },
  ];

  return (
    <DashboardLayout title="Equipment" subtitle="Analyzer interface and device status"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <div className="stats-grid">{stats.map((s) => <StatCard key={s.label} {...s} />)}</div>

      <Card title="Connected analyzers" subtitle="Live device status">
        <table className="data-table">
          <thead><tr><th>Device</th><th>Type</th><th>Status</th><th>Last sync</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {equipment.map((e) => (
              <tr key={e.name}>
                <td><strong>{e.name}</strong></td>
                <td>{e.type}</td>
                <td><Badge tone={e.tone}>{e.status}</Badge></td>
                <td>{e.lastSync}</td>
                <td style={{ textAlign: 'right' }}><button className="btn btn-outline" style={{ padding: '6px 12px' }}><i className="fas fa-rotate"></i> Sync</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}