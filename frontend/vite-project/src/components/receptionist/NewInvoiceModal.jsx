import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { ownerService } from '../../services/ownerService.js';

const SUGGESTED = [
  { description: 'General consultation', amount: 85 },
  { description: 'Dermatology consult',  amount: 125 },
  { description: 'Emergency consult',    amount: 180 },
  { description: 'Rabies vaccine',       amount: 45 },
  { description: 'DHPP vaccine',         amount: 55 },
  { description: 'Ear cytology',         amount: 42.5 },
  { description: 'Urinalysis',           amount: 65 },
  { description: 'CBC + chemistry',      amount: 120 },
  { description: 'Dental cleaning',      amount: 320 },
  { description: 'Mometamax otic 15 g',  amount: 38 },
  { description: 'Apoquel 16 mg (30)',   amount: 72 },
];

export default function NewInvoiceModal({ open, onClose, onCreate }) {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    owner_id: '',
    appointment_id: '',
    items: [{ description: SUGGESTED[0].description, amount: SUGGESTED[0].amount }],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    ownerService.list()
      .then((res) => setOwners(res.data || []))
      .catch(() => {});
  }, [open]);

  const handleClose = () => {
    setForm({
      owner_id: '',
      appointment_id: '',
      items: [{ description: SUGGESTED[0].description, amount: SUGGESTED[0].amount }],
    });
    setErrors({});
    setSubmitting(false);
    onClose?.();
  };

  const handleItemChange = (i, field, value) => {
    setForm((prev) => {
      const next = [...prev.items];
      next[i] = { ...next[i], [field]: value };
      return { ...prev, items: next };
    });
  };

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }],
    }));

  const removeItem = (i) => {
    if (form.items.length === 1) return;
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
  };

  const total = form.items.reduce((s, it) => s + Number(it.amount || 0), 0);

  const validate = () => {
    const next = {};
    if (!form.owner_id) next.owner_id = 'Select an owner';
    if (form.items.some((i) => !i.description.trim()))
      next.items = 'Every line needs a description';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onCreate({
        owner_id: form.owner_id,
        appointment_id: form.appointment_id || null,
        items: form.items,
      });
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const L = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 6 };
  const I = (err) => ({ width: '100%', padding: '10px 12px', border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`, borderRadius: 10, fontSize: 13, background: '#fff', color: '#0f2922', outline: 'none', fontFamily: 'inherit' });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New invoice"
      width={680}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="new-invoice-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Creating…</> : <><i className="fas fa-file-invoice"></i> Create invoice</>}
          </button>
        </>
      }
    >
      <form id="new-invoice-form" onSubmit={handleSubmit} noValidate>
        {/* Owner */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Owner</label>
          <select
            value={form.owner_id}
            onChange={(e) => setForm((p) => ({ ...p, owner_id: e.target.value }))}
            style={I(errors.owner_id)}
          >
            <option value="">— Select owner —</option>
            {owners.map((o) => (
              <option key={o.owner_id} value={o.owner_id}>
                {o.full_name} · {o.phone}
              </option>
            ))}
          </select>
          {errors.owner_id && <p style={E}>{errors.owner_id}</p>}
          {owners.length === 0 && (
            <p style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
              No owners found. Add an owner first.
            </p>
          )}
        </div>

        {/* Line items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ ...L, marginBottom: 0 }}>Line items</label>
            <button type="button" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={addItem}>
              <i className="fas fa-plus"></i> Add item
            </button>
          </div>

          {form.items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 40px', gap: 8, marginBottom: 8 }}>
              <select
                value={item.description}
                onChange={(e) => {
                  const s = SUGGESTED.find((x) => x.description === e.target.value);
                  handleItemChange(i, 'description', e.target.value);
                  if (s) handleItemChange(i, 'amount', s.amount);
                }}
                style={I()}
              >
                <option value="">— Pick —</option>
                {SUGGESTED.map((s) => (
                  <option key={s.description} value={s.description}>
                    {s.description} (${s.amount})
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleItemChange(i, 'amount', e.target.value)}
                step="0.01"
                min="0"
                style={I()}
              />

              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={form.items.length === 1}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid #f0c1c1', background: '#fff',
                  color: '#a83b3b',
                  cursor: form.items.length === 1 ? 'not-allowed' : 'pointer',
                  opacity: form.items.length === 1 ? 0.4 : 1,
                }}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>
          ))}
          {errors.items && <p style={E}>{errors.items}</p>}
        </div>

        {/* Total */}
        <div style={{ background: '#f6f9f8', border: '1px solid #e6ecea', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
            <span>Total</span>
            <span style={{ color: '#167a68' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}