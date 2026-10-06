import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import CheckInModal from '../../components/receptionist/CheckInModal.jsx';
import BulkCheckInModal from '../../components/receptionist/BulkCheckInModal.jsx';
import AddAppointmentModal from '../../components/receptionist/AddAppointmentModal.jsx';
import RegistrationWizard from '../../components/receptionist/RegistrationWizard.jsx';
import { appointmentService } from '../../services/appointmentService.js';
import { frontDeskStats } from '../../data/receptionistData.js';
import './FrontDesk.css';

export default function FrontDesk() {
  const [activeTab, setActiveTab] = useState('All');
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [checkInTarget, setCheckInTarget] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const [registration, setRegistration] = useState({
    owner: '',
    animalName: '',
  });

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  /* ---------- LOAD APPOINTMENTS FROM DB ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await appointmentService.list();
        const rows = res.data || [];

        setQueue(
          rows.map((r) => {
            const dt = r.appointment_date ? new Date(r.appointment_date) : null;
            const time = dt ? dt.toTimeString().slice(0, 5) : '—';
            return {
              id: r.appointment_id,
              patient: r.animal_name || 'Unknown',
              owner: `${r.owner_name || ''} · ${r.reason_for_visit || ''}`,
              time,
              status: r.status,
              tone:
                r.status === 'Completed'   ? 'green' :
                r.status === 'In progress' ? 'amber' :
                r.status === 'Checked in'  ? 'green' :
                r.status === 'Waiting'     ? 'blue'  : 'gray',
              initials: (r.animal_name || '??').slice(0, 2).toUpperCase(),
              avatar: 'blue',
              wait: r.wait_time_minutes ? `${r.wait_time_minutes} min` : '—',
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

  const tabs = ['All', 'Waiting', 'With clinician', 'Expected'];
  const tabCounts = {
    All: queue.length,
    Waiting: queue.filter((q) => q.status === 'Waiting' || q.status === 'Triage now').length,
    'With clinician': queue.filter((q) => q.status === 'Checked in' || q.status === 'In progress').length,
    Expected: queue.filter((q) => q.status === 'Scheduled').length,
  };

  const filteredQueue =
    activeTab === 'All'
      ? queue
      : queue.filter((q) => {
          if (activeTab === 'Waiting') return q.status === 'Waiting' || q.status === 'Triage now';
          if (activeTab === 'With clinician') return q.status === 'Checked in' || q.status === 'In progress';
          if (activeTab === 'Expected') return q.status === 'Scheduled';
          return true;
        });

  /* ---------- ADD NEW APPOINTMENT ---------- */
  const handleNewAppointment = async (payload) => {
    try {
      const res = await appointmentService.create(payload);
      const saved = res.data;

      const dt = saved.appointment_date ? new Date(saved.appointment_date) : null;
      const time = dt ? dt.toTimeString().slice(0, 5) : '—';

      setQueue((prev) => [
        {
          id: saved.appointment_id,
          patient: saved.animal_name || 'Unknown animal',
          owner: `${saved.owner_name || 'Unknown owner'} · ${saved.reason_for_visit || ''}`,
          time,
          status: saved.status,
          tone: 'gray',
          initials: (saved.animal_name || '??').slice(0, 2).toUpperCase(),
          avatar: 'blue',
          wait: '—',
        },
        ...prev,
      ]);

      showToast(`Appointment ${saved.appointment_id} created for ${saved.animal_name}`);
    } catch (err) {
      showToast(err.message || 'Failed to create appointment');
    }
  };

  /* ---------- SINGLE CHECK-IN ---------- */
  const handleCheckIn = async (updated) => {
    try {
      await appointmentService.update(updated.id, { status: 'Checked in' });
      setQueue((prev) =>
        prev.map((q) =>
          q.id === updated.id
            ? { ...q, status: 'Checked in', tone: 'green', wait: '0 min' }
            : q
        )
      );
      showToast(`${updated.patient} checked in`);
    } catch (err) {
      showToast(err.message || 'Check-in failed');
    }
  };

  /* ---------- BULK CHECK-IN ---------- */
  const handleBulkCheckIn = async ({ ids, clinician, room }) => {
    try {
      await Promise.all(
        ids.map((id) =>
          appointmentService.update(id, { status: 'Checked in' })
        )
      );

      setQueue((prev) =>
        prev.map((q) =>
          ids.includes(q.id)
            ? { ...q, status: 'Checked in', tone: 'green', wait: '0 min' }
            : q
        )
      );

      showToast(
        `${ids.length} patient${ids.length > 1 ? 's' : ''} checked in with ${clinician}`
      );
    } catch (err) {
      showToast(err.message || 'Bulk check-in failed');
    }
  };

/* ---------- REGISTRATION (saves to DB via wizard) ---------- */
const handleCompleteRegistration = (client) => {
  /* The wizard already saved owner + animal to the database.
     Here we just add the newly registered pet to the local queue
     so the receptionist can see them as "Arrived". */

  setQueue((prev) => [
    {
      id: client.animal_id || Date.now(),
      patient: client.patient,
      owner: `${client.owner} · New registration`,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Arrived',
      tone: 'blue',
      initials: client.initials || (client.patient || '??').slice(0, 2).toUpperCase(),
      avatar: 'blue',
      wait: '0 min',
    },
    ...prev,
  ]);

  setRegistration({ owner: '', animalName: '' });
  showToast(
    `${client.patient} registered for ${client.owner} (saved to database)`
  );
};

  return (
    <DashboardLayout
      title="Front desk operations"
      subtitle="Riverside Clinic · Thursday, 1 October"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {frontDeskStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid-2col">
        {/* LEFT — Check-in queue */}
        <Card
          title="Check-in queue"
          subtitle={loading ? 'Loading…' : `${queue.length} appointments`}
          actions={
            <>
              <button className="btn btn-outline" onClick={() => setBulkOpen(true)}>
                <i className="fas fa-check-double"></i> Bulk check-in
              </button>
              <button className="btn btn-primary" onClick={() => setApptOpen(true)}>
                <i className="fas fa-plus"></i> New appointment
              </button>
            </>
          }
        >
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t} {tabCounts[t] ?? ''}
              </button>
            ))}
          </div>

          {loading && (
            <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
              Loading appointments…
            </p>
          )}

          {!loading && error && (
            <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b', fontSize: 13 }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient &amp; owner</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Wait</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div className="cell-avatar-group">
                        <Avatar initials={q.initials} tone={q.avatar} />
                        <div>
                          <strong>{q.patient}</strong>
                          <span>{q.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td>{q.time}</td>
                    <td>
                      <Badge tone={q.tone}>{q.status}</Badge>
                    </td>
                    <td>{q.wait}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setCheckInTarget(q)}
                        title="Check in this patient"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && filteredQueue.length === 0 && (
            <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
              No appointments yet. Click <strong>New appointment</strong> to create one.
            </p>
          )}
        </Card>

        {/* RIGHT — Registration + Invoice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Owner & animal registration" subtitle="Create a linked client record">
            <div className="form-group">
              <label className="fd-label">Owner</label>
              <input
                className="fd-input"
                value={registration.owner}
                onChange={(e) =>
                  setRegistration({ ...registration, owner: e.target.value })
                }
                placeholder="Owner name and phone"
              />
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="fd-label">Animal name</label>
              <input
                className="fd-input"
                value={registration.animalName}
                onChange={(e) =>
                  setRegistration({ ...registration, animalName: e.target.value })
                }
                placeholder="e.g. Olive"
              />
            </div>

            <div className="fd-progress-row">
              <div className="fd-progress-item">
                <span className="fd-progress-label">Owner</span>
                <span className="fd-progress-bar" />
              </div>
              <div className="fd-progress-item">
                <span className="fd-progress-label">Animal</span>
                <span className="fd-progress-bar" />
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={() => setWizardOpen(true)}
            >
              <i className="fas fa-arrow-right"></i> Continue registration
            </button>
          </Card>

          <Card title="Invoice & payment" subtitle="INV-10984 · Cooper Davis">
            <div className="fd-invoice-row">
              <div className="fd-invoice-left">
                <div className="fd-invoice-icon green">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div>
                  <strong>Consultation</strong>
                  <span>Dr. Mensah · Today</span>
                </div>
              </div>
              <strong>$85.00</strong>
            </div>

            <div className="fd-invoice-total">
              <span>Total</span>
              <span>$85.00</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CheckInModal
        open={!!checkInTarget}
        appointment={checkInTarget}
        onClose={() => setCheckInTarget(null)}
        onCheckIn={handleCheckIn}
      />

      <BulkCheckInModal
        open={bulkOpen}
        queue={filteredQueue}
        onClose={() => setBulkOpen(false)}
        onBulkCheckIn={handleBulkCheckIn}
      />

      <AddAppointmentModal
        open={apptOpen}
        onClose={() => setApptOpen(false)}
        onAdd={handleNewAppointment}
      />

      <RegistrationWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleCompleteRegistration}
        defaultOwner={{
          ownerName: registration.owner,
          animalName: registration.animalName,
        }}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}