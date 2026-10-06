import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import NewRequisitionModal from '../../components/lab/NewRequisitionModal.jsx';
import { requisitions as initial } from '../../data/labData.js';
import './Lab.css';

export default function Requisitions() {
  const [reqs, setReqs] = useState(initial);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const filtered = reqs.filter((r) => {
    const mf = filter === 'All' || r.priority === filter || r.status === filter;
    const mq = r.patient.toLowerCase().includes(query.toLowerCase()) || r.test.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase());
    return mf && mq;
  });

  const updateStatus = (id, status) => {
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(`Requisition ${id} → ${status}`);
  };

  const handleAdd = (n) => {
    setReqs((prev) => [{
      id: n.id, patient: n.patient, owner: n.owner, vet: n.clinician,
      test: n.test, priority: n.priority, status: 'Received',
      time: n.time, initials: n.initials, avatar: n.avatar,
    }, ...prev]);
    showToast(`Requisition ${n.id} created for ${n.patient}`);
  };

  return (
    <DashboardLayout title="Test requisitions" subtitle="Incoming lab orders from all branches"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <Card title="All requisitions" subtitle={`${filtered.length} of ${reqs.length} orders`}
        actions={<button className="btn btn-primary" onClick={() => setModalOpen(true)}><i className="fas fa-plus"></i> New requisition</button>}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 260, flex: 1 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input placeholder="Search by patient, test or ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['All', 'STAT', 'Routine', 'Received', 'Processing', 'Completed'].map((t) => (
              <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Patient</th><th>Test</th><th>Priority</th><th>Status</th><th>Received</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>{r.id}</strong></td>
                <td>
                  <div className="cell-avatar-group">
                    <Avatar initials={r.initials} tone={r.avatar} size="sm" />
                    <div><strong>{r.patient}</strong><span>{r.owner} · {r.vet}</span></div>
                  </div>
                </td>
                <td>{r.test}</td>
                <td><Badge tone={r.priority === 'STAT' ? 'red' : 'gray'}>{r.priority}</Badge></td>
                <td><Badge tone={r.status === 'Completed' ? 'green' : r.status === 'Processing' ? 'amber' : 'blue'}>{r.status}</Badge></td>
                <td>{r.time}</td>
                <td style={{ textAlign: 'right' }}>
                  {r.status === 'Received' && <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => updateStatus(r.id, 'Processing')}>Start</button>}
                  {r.status === 'Processing' && <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => updateStatus(r.id, 'Completed')}>Complete</button>}
                  {r.status === 'Completed' && <button className="btn btn-outline" style={{ padding: '6px 12px', color: '#167a68', borderColor: '#b8e0d9' }}>View report</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>No requisitions match your filter.</p>}
      </Card>

      <NewRequisitionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      {toast && <div className="lab-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}