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
  const [animals, setAnimals]       = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [form, setForm]             = useState({
    animal_id: '',
    test_type: 'CBC + chemistry',
    priority: 'Normal',
  });
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------- Load animals when modal opens ---------- */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const load = async () => {
      setLoadingLists(true);
      try {
        const res = await animalService.list();
        if (cancelled) return;
        console.log('🟢 Animals loaded:', res.data?.length || 0);
        setAnimals(res.data || []);
      } catch (err) {
        console.error('Animals fetch failed:', err);
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [open]);

  /* ---------- Reset form when closed ---------- */
  useEffect(() => {
    if (!open) {
      setForm({ animal_id: '', test_type: TESTS[0], priority: 'Normal' });
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const handleClose = () => onClose?.();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Validate BEFORE sending */
    const next = {};
    if (!form.animal_id || Number(form.animal_id) <= 0) {
      next.animal_id = 'Select an animal';
    }
    if (!form.test_type) {
      next.test_type = 'Select a test';
    }
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
  const I = (err) => ({ width: '100%', padding: '11px 14px', border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`, borderRadius: 10, fontSize: 13.5, background: '#fff', color: '#0f2922', outline: 'none', fontFamily: 'inherit', cursor: loadingLists ? 'wait' : 'pointer' });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  const noAnimals = !loadingLists && animals.length === 0;

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
          <button
            type="submit"
            form="order-lab-form"
            className="btn btn-primary btn-lg"
            disabled={submitting || noAnimals || !form.animal_id}
          >
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> Submitting…</>
              : <><i className="fas fa-flask"></i> Order lab test</>}
          </button>
        </>
      }
    >
      <form id="order-lab-form" onSubmit={handleSubmit} noValidate>
        {/* Warning banner if no animals */}
        {noAnimals && (
          <div style={{
            padding: 12, borderRadius: 10, marginBottom: 16,
            background: '#fbeed8', border: '1px solid #f0dcb5',
            color: '#97611a', fontSize: 12.5, fontWeight: 500,
          }}>
            <i className="fas fa-triangle-exclamation" style={{ marginRight: 8 }}></i>
            No animals found. Register an owner and animal first.
          </div>
        )}

        {/* Animal picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Animal</label>
          <select
            value={form.animal_id}
            onChange={handleChange('animal_id')}
            style={I(errors.animal_id)}
            disabled={loadingLists || noAnimals}
          >
            <option value="">
              {loadingLists ? 'Loading…' : '— Select an animal —'}
            </option>
            {animals.map((a) => (
              <option key={a.animal_id} value={a.animal_id}>
                {a.name} · {a.species}{a.owner_name ? ` · ${a.owner_name}` : ''}
              </option>
            ))}
          </select>
          {errors.animal_id && <p style={E}>{errors.animal_id}</p>}
        </div>

        {/* Test type */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Test type</label>
          <select
            value={form.test_type}
            onChange={handleChange('test_type')}
            style={I(errors.test_type)}
            disabled={loadingLists}
          >
            {TESTS.map((t) => <option key={t}>{t}</option>)}
          </select>
          {errors.test_type && <p style={E}>{errors.test_type}</p>}
        </div>

        {/* Priority */}
        <div>
          <label style={L}>Priority</label>
          <select
            value={form.priority}
            onChange={handleChange('priority')}
            style={I()}
            disabled={loadingLists}
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