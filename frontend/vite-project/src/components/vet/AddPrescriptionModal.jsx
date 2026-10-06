import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { api } from '../../services/api.js';

const getItemName = (it) =>
  it.item_name || it.name || it.drug_name || `Item #${it.item_id}`;

const getItemMeta = (it) => {
  const parts = [];
  if (it.category) parts.push(it.category);
  if (it.unit_price) parts.push(`$${Number(it.unit_price).toFixed(2)}`);
  if (it.stock_quantity !== undefined) parts.push(`${it.stock_quantity} in stock`);
  return parts.join(' · ');
};

export default function AddPrescriptionModal({ open, onClose, onCreate }) {
  const [animals, setAnimals] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [debug, setDebug] = useState('');
  const [form, setForm] = useState({
    animal_id: '',
    item_id: '',
    dosage_instructions: '',
    quantity: 1,
    priority: 'Normal',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Load form data from the WORKING /prescriptions route */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoadingLists(true);
      setDebug('Loading…');
      try {
        const res = await api.get('/prescriptions/form-data');
        if (cancelled) return;

        const animalsData = res.animals || [];
        const itemsData = res.inventory || [];

        console.log('🟢 Loaded:', animalsData.length, 'animals,', itemsData.length, 'items');

        setAnimals(animalsData);
        setItems(itemsData);
        setDebug(`Loaded ${animalsData.length} animals, ${itemsData.length} medications`);
      } catch (err) {
        if (cancelled) return;
        console.error('Load failed:', err);
        setDebug('Error: ' + err.message);
        setAnimals([]);
        setItems([]);
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm({ animal_id: '', item_id: '', dosage_instructions: '', quantity: 1, priority: 'Normal' });
      setErrors({});
      setDebug('');
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
    if (!form.item_id) next.item_id = 'Select a medication';
    if (!form.dosage_instructions.trim()) next.dosage_instructions = 'Enter dosage instructions';
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Quantity must be 1 or more';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await onCreate({
        animal_id: Number(form.animal_id),
        item_id: Number(form.item_id),
        dosage_instructions: form.dosage_instructions.trim(),
        quantity: Number(form.quantity),
        priority: form.priority,
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
  const D = { fontSize: 11.5, color: '#8fa39d', textAlign: 'center', marginBottom: 12 };

  const canSubmit = !submitting && form.animal_id && form.item_id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Write prescription"
      width={600}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="rx-form" className="btn btn-primary btn-lg" disabled={!canSubmit}>
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> Writing…</>
              : <><i className="fas fa-prescription"></i> Write prescription</>}
          </button>
        </>
      }
    >
      <form id="rx-form" onSubmit={handleSubmit} noValidate>
        {debug && <p style={D}>{debug}</p>}

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Animal</label>
          <select
            value={form.animal_id}
            onChange={handleChange('animal_id')}
            style={I(errors.animal_id)}
            disabled={loadingLists}
          >
            <option value="">{loadingLists ? 'Loading…' : '— Select an animal —'}</option>
            {animals.map((a) => (
              <option key={a.animal_id} value={a.animal_id}>
                {a.name} · {a.species}{a.owner_name ? ` · ${a.owner_name}` : ''}
              </option>
            ))}
          </select>
          {errors.animal_id && <p style={E}>{errors.animal_id}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Medication</label>
          <select
            value={form.item_id}
            onChange={handleChange('item_id')}
            style={I(errors.item_id)}
            disabled={loadingLists || items.length === 0}
          >
            <option value="">
              {items.length === 0 ? '— No medications available —' : '— Select a medication —'}
            </option>
            {items.map((it) => (
              <option key={it.item_id} value={it.item_id}>
                {getItemName(it)}{getItemMeta(it) ? ` (${getItemMeta(it)})` : ''}
              </option>
            ))}
          </select>
          {errors.item_id && <p style={E}>{errors.item_id}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Dosage instructions</label>
          <input
            type="text"
            value={form.dosage_instructions}
            onChange={handleChange('dosage_instructions')}
            placeholder="e.g. 4 drops BID · 10 days"
            style={I(errors.dosage_instructions)}
          />
          {errors.dosage_instructions && <p style={E}>{errors.dosage_instructions}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={L}>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={handleChange('quantity')}
              min="1"
              style={I(errors.quantity)}
            />
            {errors.quantity && <p style={E}>{errors.quantity}</p>}
          </div>
          <div>
            <label style={L}>Priority</label>
            <select value={form.priority} onChange={handleChange('priority')} style={I()}>
              <option value="Normal">Normal</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}