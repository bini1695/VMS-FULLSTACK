import { useState } from 'react';
import Modal from '../../components/common/Modal.jsx';

const CATEGORY_OPTIONS = [
  'Consultations',
  'Vaccinations',
  'Procedures',
  'Diagnostics',
];

const DURATION_OPTIONS = [
  '15 min',
  '20 min',
  '30 min',
  '45 min',
  '60 min',
  '90 min',
  'Varies',
  'In-house',
];

const EMPTY_FORM = {
  code: '',
  name: '',
  category: 'Consultations',
  duration: '30 min',
  price: '',
  active: true,
};

export default function AddServiceModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleChange = (field) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    // Auto-uppercase service code
    if (field === 'code') value = value.toUpperCase().slice(0, 8);

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.code.trim()) next.code = 'Service code is required';
    else if (!/^[A-Z]{2,6}-\d{2,3}$/.test(form.code))
      next.code = 'Format: XXX-00 (e.g. CONS-04)';

    if (!form.name.trim()) next.name = 'Service name is required';
    else if (form.name.trim().length < 3)
      next.name = 'Name must be at least 3 characters';

    const price = Number(form.price);
    if (form.price === '' || isNaN(price)) next.price = 'Price is required';
    else if (price <= 0) next.price = 'Price must be greater than 0';
    else if (price > 10000) next.price = 'Price seems too high';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const newService = {
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category,
      duration: form.duration,
      price: Number(form.price),
      active: form.active,
    };

    onAdd?.(newService);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add service"
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
            form="add-service-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving…
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Add service
              </>
            )}
          </button>
        </>
      }
    >
      <form id="add-service-form" onSubmit={handleSubmit} noValidate>
        {/* Code + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Service code</label>
            <input
              type="text"
              value={form.code}
              onChange={handleChange('code')}
              placeholder="CONS-04"
              maxLength={8}
              style={inputStyle(errors.code)}
            />
            {errors.code && <p style={errorStyle}>{errors.code}</p>}
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              style={inputStyle()}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Service name */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Service name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Senior wellness exam"
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Duration + Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Duration</label>
            <select
              value={form.duration}
              onChange={handleChange('duration')}
              style={inputStyle()}
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Price (USD)</label>
            <input
              type="number"
              value={form.price}
              onChange={handleChange('price')}
              placeholder="125"
              min="0"
              step="5"
              style={inputStyle(errors.price)}
            />
            {errors.price && <p style={errorStyle}>{errors.price}</p>}
          </div>
        </div>

        {/* Active toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            borderRadius: 10,
            background: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={form.active}
            onChange={handleChange('active')}
            style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
          />
          <span>
            <strong style={{ display: 'block' }}>Active immediately</strong>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Uncheck to save it as a draft (inactive) — you can enable it later.
            </span>
          </span>
        </label>

        {/* Info box */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            background: 'var(--bg-tint-blue)',
            color: '#2c5c92',
            fontSize: 12.5,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <i className="fas fa-circle-info" style={{ marginTop: 2 }}></i>
          <span>
            The service is added to the <strong>{form.category}</strong> catalog and
            becomes available across all branches.
          </span>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- inline style helpers ---------- */
const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: 6,
};

function inputStyle(error) {
  return {
    width: '100%',
    padding: '11px 14px',
    border: `1px solid ${error ? '#d9534f' : 'var(--border)'}`,
    borderRadius: 10,
    fontSize: 13.5,
    background: '#fff',
    color: 'var(--text-primary)',
    outline: 'none',
  };
}

const errorStyle = {
  color: '#a83b3b',
  fontSize: 12,
  marginTop: 5,
  fontWeight: 500,
};