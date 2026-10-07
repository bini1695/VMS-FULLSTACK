import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import AddFollowUpModal from '../../components/vet/AddFollowUpModal.jsx';
import { followUpService } from '../../services/followUpService.js';
import './Vet.css';

export default function FollowUps() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  /* ---------- LOAD ---------- */
  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await followUpService.list();
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'All' ? items : items.filter((f) => f.status === filter);

  const stats = [
    { label: 'Total follow-ups', value: items.length, icon: 'fa-clipboard-check', tone: 'green' },
    { label: 'Scheduled',        value: items.filter((f) => f.status === 'Scheduled').length, icon: 'fa-calendar-check', tone: 'blue' },
    { label: 'Pending',          value: items.filter((f) => f.status === 'Pending').length, icon: 'fa-clock', tone: 'amber' },
    { label: 'Overdue',          value: items.filter((f) => f.due_date && new Date(f.due_date) < new Date() && f.status !== 'Completed').length, icon: 'fa-circle-exclamation', tone: 'red' },
  ];

  /* ---------- CREATE ---------- */
  const handleAdd = async (payload) => {
    try {
      const res = await followUpService.create(payload);
      setItems((prev) => [res.data, ...prev]);
      showToast(`Follow-up FU-${res.data.follow_up_id} created`);
    } catch (err) {
      showToast(err.message);
      throw err;
    }
  };

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (id, status) => {
    try {
      await followUpService.update(id, { status });
      setItems((prev) => prev.map((f) => (f.follow_up_id === id ? { ...f, status } : f)));
      showToast(`Follow-up → ${status}`);
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <DashboardLayout
      title="Follow-ups"
      subtitle="Patients needing a follow-up visit"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="All follow-ups"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${items.length} shown`}
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <i className="fas fa-plus"></i> Add follow-up
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Pending', 'Scheduled', 'Completed'].map((t) => (
            <button
              key={t}
              className={`tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading follow-ups…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.follow_up_id}>
                  <td>
                    <strong style={{ color: '#167a68', fontSize: 12.5 }}>
                      FU-{String(f.follow_up_id).padStart(4, '0')}
                    </strong>
                  </td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar
                        initials={(f.animal_name || '??').slice(0, 2).toUpperCase()}
                        tone="green"
                        size="sm"
                      />
                      <div>
                        <strong>{f.animal_name || `Animal #${f.animal_id}`}</strong>
                        <span>{f.owner_name || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>{f.reason}</td>
                  <td>{f.due_date ? new Date(f.due_date).toLocaleDateString() : '—'}</td>
                  <td>
                    <Badge tone={
                      f.priority === 'Urgent'    ? 'red' :
                      f.priority === 'Important' ? 'amber' : 'gray'
                    }>
                      {f.priority}
                    </Badge>
                  </td>
                  <td>
                    <Badge tone={
                      f.status === 'Completed' ? 'green' :
                      f.status === 'Scheduled' ? 'blue'  : 'amber'
                    }>
                      {f.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {f.status === 'Pending' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px' }}
                        onClick={() => updateStatus(f.follow_up_id, 'Scheduled')}
                      >
                        Schedule
                      </button>
                    )}
                    {f.status === 'Scheduled' && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px' }}
                        onClick={() => updateStatus(f.follow_up_id, 'Completed')}
                      >
                        Complete
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
            No follow-ups yet. Click <strong>Add follow-up</strong> to create one.
          </p>
        )}
      </Card>

      <AddFollowUpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleAdd}
      />

      {toast && (
        <div className="vet-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}