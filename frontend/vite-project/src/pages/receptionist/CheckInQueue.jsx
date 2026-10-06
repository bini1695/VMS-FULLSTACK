import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { checkinQueue as initial } from '../../data/receptionistData.js';
import './FrontDesk.css';

export default function CheckInQueue() {
  const [queue, setQueue] = useState(initial);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const filtered = filter === 'All' ? queue : queue.filter((q) => q.status === filter);

  const stats = [
    { label: 'In queue',      value: queue.length, hint: 'Current patients',      icon: 'fa-list-check',     tone: 'blue'  },
    { label: 'Waiting',       value: queue.filter((q) => q.status === 'Arrived' || q.status === 'Waiting').length, hint: 'Not checked in yet', icon: 'fa-clock', tone: 'amber' },
    { label: 'Checked in',    value: queue.filter((q) => q.status === 'Checked in').length, hint: 'With clinician', icon: 'fa-circle-check', tone: 'green' },
    { label: 'Urgent',        value: queue.filter((q) => q.status === 'Triage now').length, hint: 'Priority patients', icon: 'fa-triangle-exclamation', tone: 'red' },
  ];

  const advance = (id) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: q.status === 'Arrived' ? 'Checked in' : 'With clinician', tone: 'green', wait: '0 min' }
          : q
      )
    );
    showToast('Patient advanced in queue');
  };

  return (
    <DashboardLayout
      title="Check-in queue"
      subtitle="Live arrivals and waiting patients"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="Current queue"
        subtitle={`${filtered.length} of ${queue.length} patients`}
        actions={
          <button className="btn btn-primary" onClick={() => showToast('Bulk check-in opened')}>
            <i className="fas fa-check"></i> Bulk check-in
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Arrived', 'Checked in', 'Triage now'].map((t) => (
            <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        <table className="data-table">
          <thead>
            <tr><th>Patient &amp; owner</th><th>Time</th><th>Status</th><th>Wait</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id}>
                <td>
                  <div className="cell-avatar-group">
                    <Avatar initials={q.initials} tone={q.avatar} />
                    <div><strong>{q.patient}</strong><span>{q.owner}</span></div>
                  </div>
                </td>
                <td>{q.time}</td>
                <td><Badge tone={q.tone}>{q.status}</Badge></td>
                <td>{q.wait}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => advance(q.id)}>
                    Advance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {toast && <div className="fd-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}