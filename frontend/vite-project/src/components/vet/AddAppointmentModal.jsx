import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const REASONS = [
  'Wellness exam',
  'Vaccination',
  'Dermatology follow-up',
  'Lameness assessment',
  'Ultrasound review',
  'Dental cleaning',
  'Post-op check',
  'Behavior consult',
  'Emergency consult',
  'Other',
];

const SPECIES = ['Canine', 'Feline', 'Rabbit', 'Avian', 'Reptile', 'Equine'];

const DURATIONS = ['15 min', '30 min', '45 min', '60 min', '90 min'];

const CLINICIANS = [
  'Dr. Amara Mensah',
  'Dr. Lena Park',
  'Dr. Priya Kapoor',
  'Dr. Daniel Kim',
  'Dr. Sofia Reyes',
  'Dr. Marcus Chen',
];

const EMPTY = {
  patient: '',
  owner: '',
  species: 'Canine',
  reason: 'Wellness exam',
  clinician: 'Dr. Amara Mensah',
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  duration: '30 min',
  notes: '',
};

export default function AddAppointmentModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitting(false);
    onClose?.();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.patient.trim()) next.patient = 'Patient name is required';
    if (!form.owner.trim()) next.owner = 'Owner name is required';
    if (!form.date) next.date = 'Date is required';
    if (!form.time) next.time = 'Time is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const pickTone = () =>
    ['green', 'blue', 'purple', 'amber', 'teal', 'pink'][Math.floor(Math.random() * 6)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const appointment = {
      id: Date.now(),
      patient: form.patient.trim(),
      owner: form.owner.trim(),
      species: form.species,
      reason: form.reason,
      clinician: form.clinician,
      date: form.date,
      time: form.time,
      duration: form.duration,
      notes: form.notes.trim(),
      status: 'Scheduled',
      initials: buildInitials(form.patient),
      avatar: pickTone(),
    };

    onAdd?.(appointment);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New appointment"
      width={620}
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline btn-lg"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-appointment-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Scheduling…
              </>
            ) : (
              <>
                <i className="fas fa-calendar-plus"></i> Schedule appointment
              </>
            )}
          </button>
        </>
      }
    >
      <form id="add-appointment-form" onSubmit={handleSubmit} noValidate>
        {/* Patient + Species */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Patient name</label>
            <input
              type="text"
              value={form.patient}
              onChange={handleChange('patient')}
              placeholder="Cooper Davis"
              style={I(errors.patient)}
            />
            {errors.patient && <p style={E}>{errors.patient}</p>}
          </div>
          <div>
            <label style={L}>Species</label>
            <select value={form.species} onChange={handleChange('species')} style={I()}>
              {SPECIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Owner */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Owner name</label>
          <input
            type="text"
            value={form.owner}
            onChange={handleChange('owner')}
            placeholder="Taylor Davis"
            style={I(errors.owner)}
          />
          {errors.owner && <p style={E}>{errors.owner}</p>}
        </div>

        {/* Reason + Clinician */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Reason for visit</label>
            <select value={form.reason} onChange={handleChange('reason')} style={I()}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Clinician</label>
            <select value={form.clinician} onChange={handleChange('clinician')} style={I()}>
              {CLINICIANS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Date + Time + Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange('date')}
              style={I(errors.date)}
            />
            {errors.date && <p style={E}>{errors.date}</p>}
          </div>
          <div>
            <label style={L}>Time</label>
            <input
              type="time"
              value={form.time}
              onChange={handleChange('time')}
              style={I(errors.time)}
            />
            {errors.time && <p style={E}>{errors.time}</p>}
          </div>
          <div>
            <label style={L}>Duration</label>
            <select value={form.duration} onChange={handleChange('duration')} style={I()}>
              {DURATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={L}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Reason details, owner concerns, prep instructions..."
            rows={3}
            style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Info box */}
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            background: '#e6f0fa',
            color: '#2c5c92',
            fontSize: 12.5,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <i className="fas fa-circle-info" style={{ marginTop: 2 }}></i>
          <span>
            The appointment will appear in <strong>Today's schedule</strong> on the
            scheduled date, and in the <strong>Appointments</strong> list immediately.
          </span>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- styles ---------- */
const L = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#8fa39d',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const I = (error) => ({
  width: '100%',
  padding: '11px 14px',
  border: `1px solid ${error ? '#d9534f' : '#e6ecea'}`,
  borderRadius: 10,
  fontSize: 13.5,
  background: '#fff',
  color: '#0f2922',
  outline: 'none',
  fontFamily: 'inherit',
});

const E = {
  color: '#a83b3b',
  fontSize: 12,
  marginTop: 5,
  fontWeight: 500,
};