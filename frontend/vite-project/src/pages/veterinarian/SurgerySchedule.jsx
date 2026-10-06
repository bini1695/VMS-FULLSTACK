import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import ScheduleSurgeryModal from '../../components/vet/ScheduleSurgeryModal.jsx';
import { surgeries as initial } from '../../data/vetData.js';
import './Vet.css';

export default function SurgerySchedule() {
  const [surgeries, setSurgeries] = useState(initial);
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  const filtered =
    filter === 'All' ? surgeries : surgeries.filter((s) => s.status === filter);

  const stats = [
    {
      label: 'Scheduled',
      value: surgeries.filter((s) => s.status === 'Scheduled').length,
      hint: 'Upcoming procedures',
      icon: 'fa-calendar-day',
      tone: 'blue',
    },
    {
      label: 'Pre-op',
      value: surgeries.filter((s) => s.status === 'Pre-op').length,
      hint: 'Preparing for surgery',
      icon: 'fa-stethoscope',
      tone: 'amber',
    },
    {
      label: 'Completed',
      value: surgeries.filter((s) => s.status === 'Completed').length,
      hint: 'Finished today',
      icon: 'fa-circle-check',
      tone: 'green',
    },
    {
      label: 'Surgeons on duty',
      value: '3',
      hint: 'Dr. Mensah, Park, Chen',
      icon: 'fa-user-doctor',
      tone: 'teal',
    },
  ];

  const handleSchedule = (surgery) => {
    setSurgeries((prev) => [surgery, ...prev]);
    showToast(`Surgery ${surgery.id} scheduled for ${surgery.patient}`);
  };

  const updateStatus = (id, status) => {
    setSurgeries((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast(`Surgery ${id} → ${status}`);
  };

  return (
    <DashboardLayout
      title="Surgery schedule"
      subtitle="Upcoming and recent procedures"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card
        title="Scheduled procedures"
        subtitle={`${filtered.length} of ${surgeries.length} shown`}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Schedule surgery
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Scheduled', 'Pre-op', 'Completed'].map((t) => (
            <button
              key={t}
              className={`tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Procedure</th>
              <th>Surgeon</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong style={{ color: '#167a68', fontSize: 12.5 }}>{s.id}</strong>
                </td>
                <td>
                  <div className="cell-avatar-group">
                    <Avatar initials={s.initials} tone={s.avatar} size="sm" />
                    <div>
                      <strong>{s.patient}</strong>
                    </div>
                  </div>
                </td>
                <td>{s.procedure}</td>
                <td>{s.surgeon}</td>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td>{s.duration}</td>
                <td>
                  <Badge
                    tone={
                      s.status === 'Completed' ? 'green' :
                      s.status === 'Pre-op'    ? 'amber' : 'blue'
                    }
                  >
                    {s.status}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {s.status === 'Scheduled' && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 12px' }}
                      onClick={() => updateStatus(s.id, 'Pre-op')}
                    >
                      Start pre-op
                    </button>
                  )}
                  {s.status === 'Pre-op' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px' }}
                      onClick={() => updateStatus(s.id, 'Completed')}
                    >
                      Complete
                    </button>
                  )}
                  {s.status === 'Completed' && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', color: '#167a68', borderColor: '#b8e0d9' }}
                    >
                      View report
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No surgeries match your filter.
          </p>
        )}
      </Card>

      <ScheduleSurgeryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSchedule={handleSchedule}
      />

      {toast && (
        <div className="vet-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}