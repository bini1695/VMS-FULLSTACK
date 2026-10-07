import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
];

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function RescheduleModal({ open, onClose, appointment, onReschedule }) {
  const [form, setForm] = useState({ date: getTomorrow(), time: '09:00' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setForm({ date: getTomorrow(), time: '09:00' });
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
    if (!form.date) next.date = 'Pick a new date';
    if (!form.time) next.time = 'Pick a new time';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const newAppointmentDate = new Date(`${form.date}T${form.time}:00`);
      await onReschedule?.({
        ...appointment,
        appointment_date: newAppointmentDate.toISOString(),
      });
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to reschedule this appointment' });
      setSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Reschedule appointment"
      width={560}
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
            form="reschedule-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving…
              </>
            ) : (
              <>
                <i className="fas fa-calendar-check"></i> Confirm reschedule
              </>
            )}
          </button>
        </>
      }
    >
      <form id="reschedule-form" onSubmit={handleSubmit} noValidate>
        {/* Current appointment summary */}
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: '#f6f9f8',
            border: '1px solid #e6ecea',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 6 }}>
            Current appointment
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0f2922', marginBottom: 4 }}>
            {appointment.patient} · {appointment.owner}
          </div>
          <div style={{ fontSize: 12.5, color: '#4f6b63' }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            {appointment.time}
            {appointment.reason && ` · ${appointment.reason}`}
          </div>
        </div>

        {/* New date + time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>New date</label>
            <input
              type="date"
              min={getToday()}
              value={form.date}
              onChange={handleChange('date')}
              style={I(errors.date)}
            />
            {errors.date && <p style={E}>{errors.date}</p>}
          </div>
          <div>
            <label style={L}>New time</label>
            <select value={form.time} onChange={handleChange('time')} style={I(errors.time)}>
              {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errors.time && <p style={E}>{errors.time}</p>}
          </div>
        </div>

        {errors.submit && <p role="alert" style={E}>{errors.submit}</p>}
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
            The new date and time will be saved to the appointment record.
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
  border: `1px solid ${error ? 'a#d9534f' : '#e6ecea'}`,
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