import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { labService } from '../../services/labService.js';
import './Vet.css';

export default function VetLab() {
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    labService.listRequisitions()
      .then((res) => setReqs(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? reqs : reqs.filter((r) => r.status === filter);

  return (
    <DashboardLayout
      title="Laboratory"
      subtitle="Requisitions"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <Card title="Lab requisitions" subtitle={loading ? 'Loading…' : `${filtered.length} of ${reqs.length}`}>
        <div className="tabs">
          {['All', 'Received', 'Processing', 'Completed'].map((t) => (
            <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Patient</th><th>Test</th><th>Priority</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.requisition_id}>
                  <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>{r.requisition_id}</strong></td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={(r.animal_name || '??').slice(0, 2).toUpperCase()} tone="green" size="sm" />
                      <div><strong>{r.animal_name || '—'}</strong><span>{r.owner_name || ''}</span></div>
                    </div>
                  </td>
                  <td>{r.test_type}</td>
                  <td><Badge tone={r.priority === 'STAT' ? 'red' : 'gray'}>{r.priority}</Badge></td>
                  <td><Badge tone={r.status === 'Completed' ? 'green' : r.status === 'Processing' ? 'amber' : 'blue'}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>No lab requisitions yet.</p>
        )}
      </Card>
    </DashboardLayout>
  );
}