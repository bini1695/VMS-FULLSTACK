import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import OrderLabModal from '../../components/vet/OrderLabModal.jsx';
import AddPrescriptionModal from '../../components/vet/AddPrescriptionModal.jsx';
import { appointmentService } from '../../services/appointmentService.js';
import { labService } from '../../services/labService.js';
import { prescriptionService } from '../../services/prescriptionService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './Vet.css';

export default function VetToday() {
  const { user } = useAuth();
  const [appts, setAppts] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labOpen, setLabOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [aRes, lRes, rRes] = await Promise.all([
        appointmentService.list().catch(() => ({ data: [] })),
        labService.listRequisitions().catch(() => ({ data: [] })),
        prescriptionService.list().catch(() => ({ data: [] })),
      ]);
      setAppts(aRes.data || []);
      setLabOrders((lRes.data || []).slice(0, 4));
      setPrescriptions((rRes.data || []).slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleOrderLab = async (payload) => {
    try {
      const res = await labService.createRequisition(payload);
      showToast(`Lab order ${res.data.requisition_id} created`);
      await loadAll();
    } catch (err) {
      showToast(`Failed: ${err.message}`);
      throw err;
    }
  };

  const handleWriteRx = async (payload) => {
    try {
      const res = await prescriptionService.create(payload);
      showToast(`Prescription ${res.data.prescription_id} created`);
      await loadAll();
    } catch (err) {
      showToast(`Failed: ${err.message}`);
      throw err;
    }
  };

  const schedule = appts.map((r) => {
    const dt = r.appointment_date ? new Date(r.appointment_date) : null;
    const time = dt ? dt.toTimeString().slice(0, 5) : '—';
    return {
      id: r.appointment_id,
      time,
      name: r.animal_name || 'Unknown',
      reason: r.reason_for_visit || '—',
      meta: r.species || '',
      status: r.status || 'Scheduled',
      initials: (r.animal_name || '??').split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase(),
      avatar: 'green',
    };
  });

  const activePatient = schedule[0] || null;

  const stats = [
    { label: "Today's appointments", value: String(appts.length), hint: `${appts.filter((a) => a.status === 'Completed').length} completed`, icon: 'fa-calendar-day', tone: 'green' },
    { label: 'Waiting now', value: String(appts.filter((a) => a.status === 'Waiting').length), hint: 'In queue', icon: 'fa-clock', tone: 'amber', hintTone: 'amber' },
    { label: 'Lab orders', value: String(labOrders.length), hint: `${labOrders.filter((l) => l.is_abnormal).length} abnormal`, icon: 'fa-flask', tone: 'red', hintTone: labOrders.some((l) => l.is_abnormal) ? 'red' : '' },
    { label: 'Prescriptions', value: String(prescriptions.length), hint: `${prescriptions.filter((p) => p.priority === 'Priority').length} priority`, icon: 'fa-prescription', tone: 'blue' },
  ];

  return (
    <DashboardLayout
      title={`Good morning, ${user?.name || 'Dr. Mensah'}`}
      subtitle="Riverside Clinic · Consultation room 3"
      user={{ name: user?.name || 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid-2col">
        <Card title="Today's schedule" subtitle={loading ? 'Loading…' : `${schedule.length} appointments`}>
          {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}
          {!loading && schedule.length === 0 && (
            <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>No appointments today.</p>
          )}
          {!loading && schedule.map((item) => (
            <div key={item.id} className="schedule-item" onClick={() => showToast(`Viewing ${item.name}`)}>
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-info">
                <strong>{item.name}</strong>
                <span>{item.reason} · {item.meta}</span>
              </div>
              <Badge tone={item.status === 'Completed' ? 'green' : item.status === 'In progress' ? 'amber' : 'blue'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            {activePatient ? (
              <div className="patient-header">
                <div className="patient-header-left">
                  <Avatar initials={activePatient.initials} tone="green" size="lg" />
                  <div>
                    <h3>{activePatient.name}</h3>
                    <p>{activePatient.meta} · {activePatient.reason}</p>
                  </div>
                </div>
                <Badge tone="green">{activePatient.status}</Badge>
              </div>
            ) : (
              <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>No patient selected.</p>
            )}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card
            title="Laboratory"
            subtitle={loading ? 'Loading…' : `${labOrders.length} recent`}
            actions={
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setLabOpen(true)}>
                <i className="fas fa-plus"></i> Order
              </button>
            }
          >
            {!loading && labOrders.length === 0 && (
              <p style={{ padding: 20, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
                No lab orders yet.
              </p>
            )}
            {labOrders.map((lab) => (
              <div key={lab.requisition_id} className={`report-item ${lab.is_abnormal ? 'abnormal' : ''}`}>
                <div className="stat-icon" style={{
                  width: 36, height: 36, flexShrink: 0,
                  background: lab.is_abnormal ? '#fdecec' : '#e6f5ee',
                  color:      lab.is_abnormal ? '#d9534f' : '#167a68',
                }}>
                  <i className="fas fa-flask"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{lab.test_type}</strong>
                  <span>{lab.animal_name || `Animal #${lab.animal_id}`} · {lab.status}</span>
                </div>
                <Badge tone={lab.status === 'Completed' ? 'green' : 'blue'}>
                  {lab.priority === 'STAT' ? 'STAT' : lab.status}
                </Badge>
              </div>
            ))}
          </Card>

          <Card
            title="Prescription"
            subtitle={loading ? 'Loading…' : `${prescriptions.length} recent`}
            actions={
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setRxOpen(true)}>
                <i className="fas fa-plus"></i> Write
              </button>
            }
          >
            {!loading && prescriptions.length === 0 && (
              <p style={{ padding: 20, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
                No prescriptions yet.
              </p>
            )}
            {prescriptions.map((rx) => (
              <div key={rx.prescription_id} className="report-item">
                <div className="stat-icon" style={{
                  width: 36, height: 36, flexShrink: 0,
                  background: rx.priority === 'Priority' ? '#fbeed8' : '#e6f5ea',
                  color:      rx.priority === 'Priority' ? '#e8a340' : '#167a68',
                }}>
                  <i className="fas fa-pills"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{rx.prescription_id}</strong>
                  <span>{rx.animal_name || `Animal #${rx.animal_id}`} · {rx.dosage_instructions}</span>
                </div>
                <Badge tone={rx.priority === 'Priority' ? 'amber' : 'gray'}>
                  {rx.priority === 'Priority' ? 'Priority' : rx.status}
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <OrderLabModal open={labOpen} onClose={() => setLabOpen(false)} onOrder={handleOrderLab} />
      <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} onCreate={handleWriteRx} />

      {toast && <div className="vet-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}