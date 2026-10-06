import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { appointmentService } from '../../services/appointmentService.js';
import './Vet.css';

export default function VetAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const load = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.list();
      const rows = res.data || [];
      setAppts(
        rows.map((r) => {
          const dt = r.appointment_date ? new Date(r.appointment_date) : null;
          const time = dt ? dt.toTimeString().slice(0, 5) : '—';
          const name = r.animal_name || 'Unknown';
          return {
            id: r.appointment_id,
            time,
            patient: name,
            owner: r.owner_name || '—',
            reason: r.reason_for_visit || '—',
            species: r.species || '—',
            status: r.status || 'Scheduled',
            initials: name.split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase(),
          };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = appts.filter((a) => {
    const mf = filter === 'All' || a.status === filter;
    const q = (query || '').toLowerCase();
    const mq = !q || a.patient.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q);
    return mf && mq;
  });

  const stats = [
    { label: 'Total',       value: appts.length, icon: 'fa-calendar-day', tone: 'blue' },
    { label: 'Waiting',     value: appts.filter((a) => a.status === 'Waiting').length, icon: 'fa-clock', tone: 'amber' },
    { label: 'In progress', value: appts.filter((a) => a.status === 'In progress').length, icon: 'fa-stethoscope', tone: 'green' },
    { label: 'Completed',   value: appts.filter((a) => a.status === 'Completed').length, icon: 'fa-circle-check', tone: 'teal' },
  ];

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast(`Appointment → ${status}`);
    } catch (err) { showToast(err.message); }
  };

  return (
    <DashboardLayout
      title="Appointments"
      subtitle="Your schedule"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card title="All appointments" subtitle={loading ? 'Loading…' : `${filtered.length} of ${appts.length}`}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 260, flex: 1 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['All', 'Scheduled', 'Waiting', 'In progress', 'Completed'].map((t) => (
              <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th><th>Patient</th><th>Reason</th><th>Species</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.time}</strong></td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={a.initials} tone="green" size="sm" />
                      <div><strong>{a.patient}</strong><span>{a.owner}</span></div>
                    </div>
                  </td>
                  <td>{a.reason}</td>
                  <td>{a.species}</td>
                  <td>
                    <Badge tone={a.status === 'Completed' ? 'green' : a.status === 'In progress' ? 'amber' : 'blue'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {a.status === 'Waiting' && <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => updateStatus(a.id, 'In progress')}>Start</button>}
                    {a.status === 'In progress' && <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => updateStatus(a.id, 'Completed')}>Complete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {toast && <div className="vet-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}