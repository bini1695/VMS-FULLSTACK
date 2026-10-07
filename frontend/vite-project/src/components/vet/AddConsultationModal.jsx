import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const CONSULT_TYPES = [
  'Wellness exam',
  'Dermatology follow-up',
  'Vaccination',
  'Lameness assessment',
  'Ultrasound review',
  'Dental cleaning',
  'Post-op check',
  'Behavior consult',
  'Emergency consult',
  'Chronic disease management',
];

const SPECIES = ['Canine', 'Feline', 'Rabbit', 'Avian', 'Reptile', 'Equine'];
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
  species: 'Canine',
  owner: '',
  type: 'Wellness exam',
  clinician: 'Dr. Amara Mensah',
  chiefComplaint: '',
  temperature: '',
  heartRate: '',
  respiration: '',
  bcs: '',
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
};

export default function AddConsultationModal({ open, onClose, onAdd, defaultPatient }) {
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
    if (!form.chiefComplaint.trim())
      next.chiefComplaint = 'Chief complaint is required';
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

    const consultation = {
      id: `CONS-${Math.floor(2850 + Math.random() * 99)}`,
      patient: form.patient.trim(),
      species: form.species,
      owner: form.owner.trim(),
      type: form.type,
      clinician: form.clinician,
      chiefComplaint: form.chiefComplaint.trim(),
      vitals: {
        temperature: form.temperature.trim(),
        heartRate: form.heartRate.trim(),
        respiration: form.respiration.trim(),
        bcs: form.bcs.trim(),
      },
      soap: {
        subjective: form.subjective.trim(),
        objective: form.objective.trim(),
        assessment: form.assessment.trim(),
        plan: form.plan.trim(),
      },
      status: 'In progress',
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      initials: buildInitials(form.patient),
      avatar: pickTone(),
    };

    onAdd?.(consultation);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New consultation"
      width={720}
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
            form="add-consultation-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Starting…
              </>
            ) : (
              <>
                <i className="fas fa-stethoscope"></i> Start consultation
              </>
            )}
          </button>
        </>
      }
    >
      <form id="add-consultation-form" onSubmit={handleSubmit} noValidate>
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

        {/* Type + Clinician */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Consultation type</label>
            <select value={form.type} onChange={handleChange('type')} style={I()}>
              {CONSULT_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Clinician</label>
            <select value={form.clinician} onChange={handleChange('clinician')} style={I()}>
              {CLINICIANS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Chief complaint */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Chief complaint</label>
          <input
            type="text"
            value={form.chiefComplaint}
            onChange={handleChange('chiefComplaint')}
            placeholder="Increased paw licking, 5 days"
            style={I(errors.chiefComplaint)}
          />
          {errors.chiefComplaint && <p style={E}>{errors.chiefComplaint}</p>}
        </div>

        {/* Vitals */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...L, marginBottom: 10 }}>Vitals (optional)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div>
              <label style={miniL}>Temp (°C)</label>
              <input
                type="text"
                value={form.temperature}
                onChange={handleChange('temperature')}
                placeholder="38.7"
                style={I()}
              />
            </div>
            <div>
              <label style={miniL}>Heart rate</label>
              <input
                type="text"
                value={form.heartRate}
                onChange={handleChange('heartRate')}
                placeholder="92 bpm"
                style={I()}
              />
            </div>
            <div>
              <label style={miniL}>Respiration</label>
              <input
                type="text"
                value={form.respiration}
                onChange={handleChange('respiration')}
                placeholder="24 rpm"
                style={I()}
              />
            </div>
            <div>
              <label style={miniL}>BCS</label>
              <input
                type="text"
                value={form.bcs}
                onChange={handleChange('bcs')}
                placeholder="6/9"
                style={I()}
              />
            </div>
          </div>
        </div>

        {/* SOAP notes */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...L, marginBottom: 10 }}>SOAP notes (optional)</label>

          <div style={{ marginBottom: 10 }}>
            <label style={miniL}>Subjective</label>
            <textarea
              rows={2}
              value={form.subjective}
              onChange={handleChange('subjective')}
              placeholder="Owner reports increased paw licking and erythema for 5 days..."
              style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={miniL}>Objective</label>
            <textarea
              rows={2}
              value={form.objective}
              onChange={handleChange('objective')}
              placeholder="Interdigital erythema all paws, mild otitis externa..."
              style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={miniL}>Assessment</label>
            <textarea
              rows={2}
              value={form.assessment}
              onChange={handleChange('assessment')}
              placeholder="Atopic dermatitis flare with secondary otitis..."
              style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={miniL}>Plan</label>
            <textarea
              rows={2}
              value={form.plan}
              onChange={handleChange('plan')}
              placeholder="Continue Apoquel 16 mg SID. Start Mometamax otic BID for 10 days..."
              style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
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
            The consultation starts as <strong>In progress</strong>. You can add
            prescriptions and lab orders once it's saved.
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

const miniL = {
  display: 'block',
  fontSize: 10.5,
  fontWeight: 600,
  color: '#8fa39d',
  marginBottom: 4,
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