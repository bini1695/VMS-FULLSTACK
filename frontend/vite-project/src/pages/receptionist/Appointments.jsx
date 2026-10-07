import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { appointmentService } from '../../services/appointmentService.js';
import './FrontDesk.css';

export default function Appointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  /* ---------- LOAD FROM DB ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await appointmentService.list();
        const rows = res.data || [];

        /* Map DB rows → table rows with safe defaults */
        setAppts(
          rows.map((r) => {
            const dt = r.appointment_date ? new Date(r.appointment_date) : null;
            const time = dt ? dt.toTimeString().slice(0, 5) : '—';
            const animalName = r.animal_name || 'Unknown';
            const ownerName = r.owner_name || 'Unknown owner';
            const reason = r.reason_for_visit || '—';

            return {
              id: r.appointment_id,
              time,
              patient: animalName,
              owner: ownerName,
              reason,
              species: r.species || '—',
              status: r.status || 'Scheduled',
              initials: animalName
                .split(/\s+/)
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase(),
              avatar: 'blue',
            };
          })
        );
      } catch (err) {
        setError(err.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- SAFE FILTER (handles undefined fields) ---------- */
  const filtered = appts.filter((a) => {
    const matchesFilter = filter === 'All' || a.status === filter;

    const q = (query || '').toLowerCase();
    const matchesQuery =
      !q ||
      (a.patient || '').toLowerCase().includes(q) ||
      (a.owner || '').toLowerCase().includes(q) ||
      (a.reason || '').toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  const stats = [
    {
      label: 'Total appointments',
      value: appts.length,
      hint: 'All records',
      icon: 'fa-calendar-day',
      tone: 'blue',
    },
    {
      label: 'Waiting',
      value: appts.filter((a) => a.status === 'Waiting').length,
      hint: 'In queue',
      icon: 'fa-clock',
      tone: 'amber',
    },
    {
      label: 'In progress',
      value: appts.filter((a) => a.status === 'In progress').length,
      hint: 'With clinician',
      icon: 'fa-stethoscope',
      tone: 'green',
    },
    {
      label: 'Completed',
      value: appts.filter((a) => a.status === 'Completed').length,
      hint: 'Done',
      icon: 'fa-circle-check',
      tone: 'teal',
    },
  ];

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      setAppts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      showToast(`Appointment → ${status}`);
    } catch (err) {
      showToast(err.message || 'Update failed');
    }
  };

  return (
    <DashboardLayout
      title="Appointments"
      subtitle="All clinic appointments"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card
        title="All appointments"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${appts.length} shown`}
      >
        {/* Search + filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 260, flex: 1 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input
              placeholder="Search by patient, owner or reason..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['All', 'Scheduled', 'Waiting', 'In progress', 'Completed'].map((t) => (
              <button
                key={t}
                className={`tab ${filter === t ? 'active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading appointments…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Species</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.time}</strong></td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={a.initials} tone={a.avatar} size="sm" />
                      <div>
                        <strong>{a.patient}</strong>
                        <span>{a.owner}</span>
                      </div>
                    </div>
                  </td>
                  <td>{a.reason}</td>
                  <td>{a.species}</td>
                  <td>
                    <Badge
                      tone={
                        a.status === 'Completed'   ? 'green' :
                        a.status === 'In progress' ? 'amber' :
                        a.status === 'Waiting'     ? 'blue'  : 'gray'
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {a.status === 'Scheduled' && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px' }}
                        onClick={() => updateStatus(a.id, 'Waiting')}
                      >
                        Check in
                      </button>
                    )}
                    {a.status === 'Waiting' && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px' }}
                        onClick={() => updateStatus(a.id, 'In progress')}
                      >
                        Start
                      </button>
                    )}
                    {a.status === 'In progress' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px' }}
                        onClick={() => updateStatus(a.id, 'Completed')}
                      >
                        Complete
                      </button>
                    )}
                    {a.status === 'Completed' && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', color: '#167a68', borderColor: '#b8e0d9' }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No appointments match your filter.
          </p>
        )}
      </Card>

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}