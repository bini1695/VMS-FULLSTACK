import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { animalService } from '../../services/animalService.js';

const TESTS = [
  'CBC + chemistry',
  'CBC + thyroid',
  'Ear cytology',
  'Urinalysis',
  'Renal panel',
  'Pre-op CBC',
  'Skin scrape',
  'Gram stain',
  'Joint fluid analysis',
  'Fecal float',
  'Radiograph (2 views)',
  'Ultrasound',
];

export default function OrderLabModal({ open, onClose, onOrder }) {
  const [animals, setAnimals]   = useState([]);
  const [form, setForm]         = useState({
    animal_id: '',
    test_type: 'CBC + chemistry',
    priority: 'Normal',
  });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    animalService.list()
      .then((res) => setAnimals(res.data || []))
      .catch(() => setAnimals([]));
    setForm({ animal_id: '', test_type: TESTS[0], priority: 'Normal' });
    setErrors({});
    setSubmitting(false);
  }, [open]);

  const handleClose = () => { onClose?.(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.animal_id) next.animal_id = 'Select an animal';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await onOrder({
        animal_id: Number(form.animal_id),
        test_type: form.test_type,
        priority:  form.priority,
      });
      onClose?.();
    } catch (err) {
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const L = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 6 };
  const I = (err) => ({ width: '100%', padding: '11px 14px', border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`, borderRadius: 10, fontSize: 13.5, background: '#fff', color: '#0f2922', outline: 'none', fontFamily: 'inherit' });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Order laboratory test"
      width={560}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="order-lab-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> Submitting…</>
              : <><i className="fas fa-flask"></i> Order lab test</>}
          </button>
        </>
      }
    >
      <form id="order-lab-form" onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Animal</label>
          <select
            value={form.animal_id}
            onChange={(e) => setForm((p) => ({ ...p, animal_id: e.target.value }))}
            style={I(errors.animal_id)}
          >
            <option value="">— Select an animal —</option>
            {animals.map((a) => (
              <option key={a.animal_id} value={a.animal_id}>
                {a.name} · {a.species} {a.owner_name ? `· ${a.owner_name}` : ''}
              </option>
            ))}
          </select>
          {errors.animal_id && <p style={E}>{errors.animal_id}</p>}
          {animals.length === 0 && (
            <p style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
              No animals found. Register a client first.
            </p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Test type</label>
          <select
            value={form.test_type}
            onChange={(e) => setForm((p) => ({ ...p, test_type: e.target.value }))}
            style={I()}
          >
            {TESTS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={L}>Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
            style={I()}
          >
            <option value="Normal">Normal · 24-48h</option>
            <option value="STAT">STAT · within 1h</option>
          </select>
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}