import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { animalService } from '../../services/animalService.js';

const REASONS = [
  'Post-op check',
  'Dermatology recheck',
  'Vaccination booster',
  'Renal panel recheck',
  'Lameness re-evaluation',
  'Dental cleaning follow-up',
  'Chronic disease management',
  'Blood work recheck',
  'Weight management',
  'Behavior follow-up',
  'Wound healing check',
  'Other',
];

const EMPTY = {
  animal_id: '',
  reason: 'Post-op check',
  due_date: '',
  priority: 'Routine',
  notes: '',
};

export default function AddFollowUpModal({ open, onClose, onCreate }) {
  const [animals, setAnimals] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Load animals */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoadingLists(true);
      try {
        const res = await animalService.list();
        if (!cancelled) setAnimals(res.data || []);
      } catch (err) {
        console.error('Failed to load animals:', err);
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [open]);

  /* Reset when closed */
  useEffect(() => {
    if (!open) {
      setForm(EMPTY);
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (!form.animal_id) next.animal_id = 'Select an animal';
    if (!form.reason.trim()) next.reason = 'Reason is required';
    if (!form.due_date) next.due_date = 'Due date is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await onCreate({
        animal_id: Number(form.animal_id),
        reason: form.reason.trim(),
        due_date: form.due_date,
        priority: form.priority,
        notes: form.notes.trim() || null,
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
      onClose={onClose}
      title="Add follow-up"
      width={600}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="submit"
            form="fu-form"
            className="btn btn-primary btn-lg"
            disabled={submitting || !form.animal_id}
          >
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> Creating…</>
              : <><i className="fas fa-clipboard-check"></i> Create follow-up</>}
          </button>
        </>
      }
    >
      <form id="fu-form" onSubmit={handleSubmit} noValidate>
        {/* Animal */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Animal</label>
          <select
            value={form.animal_id}
            onChange={handleChange('animal_id')}
            style={I(errors.animal_id)}
            disabled={loadingLists}
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

        {/* Reason */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Reason for follow-up</label>
          <select value={form.reason} onChange={handleChange('reason')} style={I(errors.reason)}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          {errors.reason && <p style={E}>{errors.reason}</p>}
        </div>

        {/* Due date + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Due date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={handleChange('due_date')}
              style={I(errors.due_date)}
            />
            {errors.due_date && <p style={E}>{errors.due_date}</p>}
          </div>
          <div>
            <label style={L}>Priority</label>
            <select value={form.priority} onChange={handleChange('priority')} style={I()}>
              <option value="Routine">Routine</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={L}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="What to check, reminders..."
            rows={3}
            style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}
