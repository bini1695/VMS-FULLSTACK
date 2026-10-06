import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { consultationService } from '../../services/consultationService.js';
import './Vet.css';

export default function Consultations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    consultationService.list()
      .then((res) => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((c) => {
    const q = query.toLowerCase();
    return !q || (c.animal_name || '').toLowerCase().includes(q) || (c.owner_name || '').toLowerCase().includes(q);
  });

  return (
    <DashboardLayout
      title="Consultations"
      subtitle="History"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <Card title="All consultations" subtitle={loading ? 'Loading…' : `${filtered.length} of ${items.length}`}>
        <div className="search-box" style={{ maxWidth: 380, marginBottom: 16 }}>
          <i className="fas fa-magnifying-glass"></i>
          <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Patient</th><th>Owner</th><th>Vitals</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.consultation_id}>
                  <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>CONS-{c.consultation_id}</strong></td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={(c.animal_name || '??').slice(0, 2).toUpperCase()} tone="green" size="sm" />
                      <div><strong>{c.animal_name || '—'}</strong><span>{c.species || ''}</span></div>
                    </div>
                  </td>
                  <td>{c.owner_name || '—'}</td>
                  <td style={{ fontSize: 12.5, color: '#4f6b63' }}>
                    {c.temperature_c ? `${c.temperature_c}°C · ` : ''}
                    {c.heart_rate_bpm ? `${c.heart_rate_bpm}bpm` : ''}
                  </td>
                  <td>{c.consultation_date ? new Date(c.consultation_date).toLocaleDateString() : '—'}</td>
                  <td><Badge tone="green">Completed</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>No consultations yet.</p>
        )}
      </Card>
    </DashboardLayout>
  );
}