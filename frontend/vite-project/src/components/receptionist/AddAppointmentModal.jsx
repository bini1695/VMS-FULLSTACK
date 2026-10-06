import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { animalService } from '../../services/animalService.js';
import { api } from '../../services/api.js';

const REASONS = [
  'Wellness exam', 'Vaccination', 'Dermatology follow-up',
  'Lameness assessment', 'Ultrasound review', 'Dental cleaning',
  'Post-op check', 'Behavior consult', 'Emergency consult', 'Other',
];

export default function AddAppointmentModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    animal_id: '',
    branch_id: '1',
    vet_id: '',
    appointment_date: '',
    reason_for_visit: 'Wellness exam',
  });
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Load animals and vets when modal opens */
  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingLists(true);
      try {
        const animalsRes = await animalService.list();
        setAnimals(animalsRes.data || []);

        /* Try to fetch vets — fallback to empty list if endpoint absent */
        try {
          const vetsRes = await api.get('/users?role=Veterinarian');
          setVets(vetsRes.data || []);
        } catch {
          setVets([]);
        }
      } catch (err) {
        console.error('Failed to load animals:', err);
      } finally {
        setLoadingLists(false);
      }
    };
    load();
  }, [open]);

  const handleClose = () => {
    setForm({
      animal_id: '',
      branch_id: '1',
      vet_id: '',
      appointment_date: '',
      reason_for_visit: 'Wellness exam',
    });
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
    if (!form.animal_id) next.animal_id = 'Select an animal';
    if (!form.appointment_date) next.appointment_date = 'Pick a date and time';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      /* Convert "2026-10-15T10:30" → "2026-10-15 10:30:00" for MySQL */
      const dateTime = form.appointment_date.replace('T', ' ') + ':00';

      await onAdd({
        animal_id: form.animal_id,
        branch_id: form.branch_id,
        vet_id: form.vet_id || null,
        appointment_date: dateTime,
        reason_for_visit: form.reason_for_visit,
      });
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
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
      title="New appointment"
      width={580}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="add-appt-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> Scheduling…</>
              : <><i className="fas fa-calendar-plus"></i> Create appointment</>}
          </button>
        </>
      }
    >
      <form id="add-appt-form" onSubmit={handleSubmit} noValidate>
        {/* Animal picker */}
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
                {a.name} · {a.species} {a.owner_name ? `· ${a.owner_name}` : ''}
              </option>
            ))}
          </select>
          {errors.animal_id && <p style={E}>{errors.animal_id}</p>}
          {!loadingLists && animals.length === 0 && (
            <p style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
              No animals found. Add an owner and animal first.
            </p>
          )}
        </div>

        {/* Branch */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Branch</label>
          <select value={form.branch_id} onChange={handleChange('branch_id')} style={I()}>
            <option value="1">Central</option>
            <option value="2">Riverside</option>
          </select>
        </div>

        {/* Vet */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Veterinarian (optional)</label>
          <select value={form.vet_id} onChange={handleChange('vet_id')} style={I()}>
            <option value="">— Assign later —</option>
            {vets.map((v) => (
              <option key={v.user_id} value={v.user_id}>{v.full_name}</option>
            ))}
          </select>
        </div>

        {/* Date+Time */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Date &amp; time</label>
          <input
            type="datetime-local"
            value={form.appointment_date}
            onChange={handleChange('appointment_date')}
            style={I(errors.appointment_date)}
          />
          {errors.appointment_date && <p style={E}>{errors.appointment_date}</p>}
        </div>

        {/* Reason */}
        <div>
          <label style={L}>Reason for visit</label>
          <select
            value={form.reason_for_visit}
            onChange={handleChange('reason_for_visit')}
            style={I()}
          >
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}