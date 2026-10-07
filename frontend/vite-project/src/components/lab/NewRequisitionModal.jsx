import { useState } from 'react';
import Modal from '../common/Modal.jsx';

const TESTS = ['CBC + chemistry', 'Ear cytology', 'Urinalysis', 'Renal panel', 'Pre-op CBC', 'CBC + thyroid', 'Skin scrape', 'Gram stain', 'Joint fluid analysis', 'Fecal float'];
const SPECIES = ['Canine', 'Feline', 'Rabbit', 'Avian', 'Reptile', 'Equine'];
const PRIORITIES = ['Routine', 'STAT', 'Urgent'];
const CLINICIANS = ['Dr. Amara Mensah', 'Dr. Lena Park', 'Dr. Priya Kapoor', 'Dr. Daniel Kim', 'Dr. Sofia Reyes', 'Dr. Marcus Chen'];

const EMPTY = { patient: '', species: 'Canine', owner: '', clinician: 'Dr. Amara Mensah', test: 'CBC + chemistry', priority: 'Routine' };

export default function NewRequisitionModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => { setForm(EMPTY); setErrors({}); setSubmitting(false); onClose?.(); };
  const handleChange = (f) => (e) => { setForm((p) => ({ ...p, [f]: e.target.value })); setErrors((p) => ({ ...p, [f]: '' })); };

  const validate = () => {
    const n = {};
    if (!form.patient.trim()) n.patient = 'Patient name is required';
    if (!form.owner.trim()) n.owner = 'Owner name is required';
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const buildInitials = (name) => {
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  };

  const pickTone = () => ['green', 'blue', 'purple', 'amber', 'teal', 'pink'][Math.floor(Math.random() * 6)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    onAdd?.({
      id: `LAB-${Math.floor(2900 + Math.random() * 99)}`,
      patient: form.patient.trim(),
      species: form.species,
      owner: form.owner.trim(),
      clinician: form.clinician,
      test: form.test,
      priority: form.priority,
      status: 'Received',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      initials: buildInitials(form.patient),
      avatar: pickTone(),
    });

    setSubmitting(false);
    handleClose();
  };

  const L = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 6 };
  const I = (err) => ({ width: '100%', padding: '11px 14px', border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`, borderRadius: 10, fontSize: 13.5, background: '#fff', color: '#0f2922', outline: 'none', fontFamily: 'inherit' });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  return (
    <Modal open={open} onClose={handleClose} title="New laboratory requisition" width={600}
      footer={<>
        <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>Cancel</button>
        <button type="submit" form="new-req-form" className="btn btn-primary btn-lg" disabled={submitting}>
          {submitting ? <><i className="fas fa-spinner fa-spin"></i> Creating…</> : <><i className="fas fa-plus"></i> Create requisition</>}
        </button>
      </>}
    >
      <form id="new-req-form" onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Patient name</label>
            <input type="text" value={form.patient} onChange={handleChange('patient')} placeholder="Cooper Davis" style={I(errors.patient)} />
            {errors.patient && <p style={E}>{errors.patient}</p>}
          </div>
          <div>
            <label style={L}>Species</label>
            <select value={form.species} onChange={handleChange('species')} style={I()}>
              {SPECIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Owner name</label>
          <input type="text" value={form.owner} onChange={handleChange('owner')} placeholder="Taylor Davis" style={I(errors.owner)} />
          {errors.owner && <p style={E}>{errors.owner}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Requesting clinician</label>
            <select value={form.clinician} onChange={handleChange('clinician')} style={I()}>
              {CLINICIANS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Test</label>
            <select value={form.test} onChange={handleChange('test')} style={I()}>
              {TESTS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={L}>Priority</label>
          <select value={form.priority} onChange={handleChange('priority')} style={I()}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </form>
    </Modal>
  );
}