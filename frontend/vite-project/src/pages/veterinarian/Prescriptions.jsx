import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { prescriptionService } from '../../services/prescriptionService.js';
import './Vet.css';

export default function VetPrescriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    prescriptionService.list()
      .then((res) => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? items : items.filter((p) => p.status === filter);

  return (
    <DashboardLayout
      title="Prescriptions"
      subtitle="Written prescriptions"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <Card title="All prescriptions" subtitle={loading ? 'Loading…' : `${filtered.length} of ${items.length}`}>
        <div className="tabs">
          {['All', 'Ready to fill', 'Checking', 'Ready', 'Dispensed'].map((t) => (
            <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr><th>RX</th><th>Patient</th><th>Owner</th><th>Dosage</th><th>Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.prescription_id}>
                  <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>{p.prescription_id}</strong></td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={(p.animal_name || '??').slice(0, 2).toUpperCase()} tone="green" size="sm" />
                      <div><strong>{p.animal_name || '—'}</strong><span>{p.species || ''}</span></div>
                    </div>
                  </td>
                  <td>{p.owner_name || '—'}</td>
                  <td style={{ fontSize: 12.5, color: '#4f6b63' }}>{p.dosage_instructions}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <Badge tone={p.status === 'Dispensed' ? 'green' : p.status === 'Ready' ? 'blue' : 'gray'}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>No prescriptions yet.</p>
        )}
      </Card>
    </DashboardLayout>
  );
}