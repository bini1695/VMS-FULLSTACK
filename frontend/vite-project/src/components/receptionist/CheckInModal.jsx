import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const ROOMS = [
  'Consultation room 1',
  'Consultation room 2',
  'Consultation room 3',
  'Examination room A',
  'Examination room B',
];

const CLINICIANS = [
  'Dr. Amara Mensah',
  'Dr. Lena Park',
  'Dr. Priya Kapoor',
  'Dr. Daniel Kim',
  'Dr. Sofia Reyes',
  'Dr. Marcus Chen',
];

const REASONS = [
  'Scheduled visit',
  'Walk-in',
  'Urgent walk-in',
  'Follow-up',
  'Emergency',
];

const EMPTY = {
  clinician: 'Dr. Amara Mensah',
  room: 'Consultation room 1',
  reason: 'Scheduled visit',
  weight: '',
  notes: '',
};

export default function CheckInModal({ open, onClose, appointment, onCheckIn }) {
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
    if (!form.clinician) next.clinician = 'Assign a clinician';
    if (!form.room) next.room = 'Assign a room';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    onCheckIn?.({
      ...appointment,
      clinician: form.clinician,
      room: form.room,
      visitReason: form.reason,
      weight: form.weight,
      checkInNotes: form.notes,
      status: 'Checked in',
      checkedInAt: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    setSubmitting(false);
    handleClose();
  };

  if (!appointment) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Check in patient"
      width={580}
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
            form="checkin-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Checking in…
              </>
            ) : (
              <>
                <i className="fas fa-check"></i> Confirm check-in
              </>
            )}
          </button>
        </>
      }
    >
      <form id="checkin-form" onSubmit={handleSubmit} noValidate>
        {/* Patient summary */}
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: '#e6f5ee',
            border: '1px solid #b8e0d9',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#b6dfd0',
              color: '#0f5b4d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {appointment.initials || 'PT'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2922', marginBottom: 2 }}>
              {appointment.patient}
            </div>
            <div style={{ fontSize: 12.5, color: '#4f6b63' }}>
              {appointment.owner}
              {appointment.reason && ` · ${appointment.reason}`}
            </div>
          </div>
        </div>

        {/* Clinician + Room */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Assign clinician</label>
            <select
              value={form.clinician}
              onChange={handleChange('clinician')}
              style={I(errors.clinician)}
            >
              {CLINICIANS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errors.clinician && <p style={E}>{errors.clinician}</p>}
          </div>
          <div>
            <label style={L}>Assign room</label>
            <select
              value={form.room}
              onChange={handleChange('room')}
              style={I(errors.room)}
            >
              {ROOMS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            {errors.room && <p style={E}>{errors.room}</p>}
          </div>
        </div>

        {/* Reason + Weight */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Visit reason</label>
            <select value={form.reason} onChange={handleChange('reason')} style={I()}>
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={L}>Weight (optional)</label>
            <input
              type="text"
              value={form.weight}
              onChange={handleChange('weight')}
              placeholder="31.2 kg"
              style={I()}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={L}>Check-in notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Anything the clinician should know before the visit..."
            rows={3}
            style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

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
            The clinician will be notified that the patient is ready. Wait time
            starts counting from now.
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