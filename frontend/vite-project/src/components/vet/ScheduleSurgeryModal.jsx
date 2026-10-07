import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const PROCEDURES = [
  'Spay (feline)',
  'Spay (canine)',
  'Neuter (feline)',
  'Neuter (canine)',
  'Dental cleaning',
  'Mass removal',
  'Orthopedic surgery',
  'Exploratory laparotomy',
  'Cystotomy',
  'Joint fluid tap',
  'Abscess drainage',
  'Wound repair',
];

const SPECIES = ['Canine', 'Feline', 'Rabbit', 'Avian', 'Reptile', 'Equine'];
const SURGEONS = [
  'Dr. Amara Mensah',
  'Dr. Lena Park',
  'Dr. Priya Kapoor',
  'Dr. Daniel Kim',
  'Dr. Sofia Reyes',
  'Dr. Marcus Chen',
];
const DURATIONS = ['30 min', '45 min', '60 min', '90 min', '120 min', '180 min'];
const ANESTHESIA = ['General (gas)', 'General (injectable)', 'Local', 'Sedation', 'Epidural'];
const RISK_LEVELS = ['Low', 'Moderate', 'High'];

const EMPTY = {
  patient: '',
  species: 'Canine',
  owner: '',
  procedure: 'Spay (feline)',
  surgeon: 'Dr. Amara Mensah',
  date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  time: '09:00',
  duration: '60 min',
  anesthesia: 'General (gas)',
  risk: 'Low',
  preOpNotes: '',
  specialInstructions: '',
};

export default function ScheduleSurgeryModal({ open, onClose, onSchedule, defaultPatient }) {
  const [form, setForm] = useState(
    defaultPatient ? { ...EMPTY, ...defaultPatient } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setForm(defaultPatient ? { ...EMPTY, ...defaultPatient } : EMPTY);
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

    const surgery = {
      id: `SRG-${Math.floor(300 + Math.random() * 99)}`,
      patient: form.patient.trim(),
      species: form.species,
      owner: form.owner.trim(),
      procedure: form.procedure,
      surgeon: form.surgeon,
      date: form.date,
      time: form.time,
      duration: form.duration,
      anesthesia: form.anesthesia,
      risk: form.risk,
      preOpNotes: form.preOpNotes.trim(),
      specialInstructions: form.specialInstructions.trim(),
      status: 'Scheduled',
      initials: buildInitials(form.patient),
      avatar: pickTone(),
    };

    onSchedule?.(surgery);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule surgery"
      width={680}
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
            form="schedule-surgery-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Scheduling…
              </>
            ) : (
              <>
                <i className="fas fa-heart-pulse"></i> Schedule surgery
              </>
            )}
          </button>
        </>
      }
    >
      <form id="schedule-surgery-form" onSubmit={handleSubmit} noValidate>
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

        {/* Procedure + Surgeon */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Procedure</label>
            <select value={form.procedure} onChange={handleChange('procedure')} style={I()}>
              {PROCEDURES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Surgeon</label>
            <select value={form.surgeon} onChange={handleChange('surgeon')} style={I()}>
              {SURGEONS.map((s) => <option key={s}>{s}</option>)}
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

        {/* Anesthesia + Risk */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Anesthesia</label>
            <select value={form.anesthesia} onChange={handleChange('anesthesia')} style={I()}>
              {ANESTHESIA.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Risk level</label>
            <select value={form.risk} onChange={handleChange('risk')} style={I()}>
              {RISK_LEVELS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Pre-op notes */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Pre-op notes (optional)</label>
          <textarea
            value={form.preOpNotes}
            onChange={handleChange('preOpNotes')}
            placeholder="Pre-anesthetic blood work, fasting instructions, medication to withhold..."
            rows={2}
            style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Special instructions */}
        <div>
          <label style={L}>Special instructions (optional)</label>
          <textarea
            value={form.specialInstructions}
            onChange={handleChange('specialInstructions')}
            placeholder="Owner communication, additional monitoring, post-op care..."
            rows={2}
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
            The surgery will appear on your <strong>Surgery schedule</strong> with
            status <strong>Scheduled</strong>. Confirm pre-op checks 24h before.
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