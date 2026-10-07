import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import RegistrationWizard from '../../components/receptionist/RegistrationWizard.jsx';
import './FrontDesk.css';

export default function Registration() {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  const stats = [
    { label: 'Registered today', value: recent.length, hint: 'New clients',  icon: 'fa-user-plus',      tone: 'green' },
    { label: 'Pending consent',  value: '2',           hint: 'Awaiting docs', icon: 'fa-file-signature', tone: 'amber' },
    { label: 'Awaiting vet',     value: '1',           hint: 'Assignments',   icon: 'fa-user-doctor',    tone: 'blue' },
    { label: 'Total this week',  value: 5,             hint: 'All branches',  icon: 'fa-calendar-week',  tone: 'purple' },
  ];

  const handleComplete = (client) => {
    setRecent((prev) => [client, ...prev]);
    showToast(`${client.patient} registered for ${client.owner}`);
  };

  return (
    <DashboardLayout
      title="Registration"
      subtitle="Register new clients and their pets"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card
        title="New registration"
        subtitle="Start a multi-step registration wizard"
        actions={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <i className="fas fa-plus"></i> Start registration
          </button>
        }
      >
        {recent.length === 0 ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No registrations yet. Click <strong>Start registration</strong> to add a new client.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Animal</th>
                <th>Species</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.owner}</strong></td>
                  <td>{c.patient}</td>
                  <td>{c.species}</td>
                  <td>{c.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <RegistrationWizard
        open={open}
        onClose={() => setOpen(false)}
        onComplete={handleComplete}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}