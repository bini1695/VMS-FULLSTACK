import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import { reagents } from '../../data/labData.js';
import './Lab.css';

export default function ReagentStock() {
  const low = reagents.filter((r) => r.status === 'Low').length;
  const critical = reagents.filter((r) => r.status === 'Critical').length;

  const stats = [
    { label: 'Total reagents', value: reagents.length, hint: 'Active stock items',      icon: 'fa-boxes-stacked',       tone: 'blue'  },
    { label: 'Low stock',      value: low,             hint: 'Reorder soon',            icon: 'fa-triangle-exclamation', tone: 'amber' },
    { label: 'Critical',       value: critical,        hint: 'Reorder immediately',     icon: 'fa-circle-exclamation',   tone: 'red'   },
    { label: 'Expiring soon',  value: '2',             hint: 'Within 60 days',          icon: 'fa-clock-rotate-left',    tone: 'amber' },
  ];

  return (
    <DashboardLayout title="Reagent stock" subtitle="Laboratory inventory and expiry tracking"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <div className="stats-grid">{stats.map((s) => <StatCard key={s.label} {...s} />)}</div>

      <Card title="All reagents" subtitle="Inventory across all storage locations">
        <table className="data-table">
          <thead><tr><th>Reagent</th><th>Lot</th><th>Quantity</th><th>Min</th><th>Expires</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {reagents.map((r) => (
              <tr key={r.lot}>
                <td><strong>{r.name}</strong></td>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{r.lot}</span></td>
                <td>{r.qty}</td>
                <td>{r.min}</td>
                <td>{r.expires}</td>
                <td><Badge tone={r.status === 'OK' ? 'green' : r.status === 'Low' ? 'amber' : 'red'}>{r.status}</Badge></td>
                <td style={{ textAlign: 'right' }}><button className="btn btn-outline" style={{ padding: '6px 12px' }}>Reorder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}