import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { reports } from '../../data/labData.js';
import './Lab.css';

export default function Reports() {
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');
  const filtered = filter === 'All' ? reports : reports.filter((r) => r.status === filter);

  return (
    <DashboardLayout title="Diagnostic reports" subtitle="Released and pending lab results"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <Card title="All reports" subtitle={`${filtered.length} of ${reports.length} reports`}
        actions={<button className="btn btn-outline" onClick={() => { setToast('Exported to CSV'); setTimeout(() => setToast(''), 3000); }}><i className="fas fa-download"></i> Export</button>}>
        <div className="tabs">
          {['All', 'Released', 'Awaiting validation'].map((t) => (
            <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        <table className="data-table">
          <thead><tr><th>Report ID</th><th>Patient</th><th>Test</th><th>Date</th><th>Clinician</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>{r.id}</strong></td>
                <td>
                  <div className="cell-avatar-group">
                    <Avatar initials={r.initials} tone={r.avatar} size="sm" />
                    <div><strong>{r.patient}</strong></div>
                  </div>
                </td>
                <td>{r.test}</td>
                <td>{r.date}</td>
                <td>{r.vet}</td>
                <td><Badge tone={r.status === 'Released' ? 'green' : 'amber'}>{r.status}</Badge></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 12px' }}><i className="fas fa-file-lines"></i> View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {toast && <div className="lab-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}