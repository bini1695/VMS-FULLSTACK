import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { ownerService } from '../../services/ownerService.js';

const EMPTY = {
  full_name: '',
  phone: '',
  email: '',
  address: '',
};

export default function AddOwnerModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setForm(EMPTY);
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
    if (!form.full_name.trim()) next.full_name = 'Owner name is required';
    if (!form.phone.trim())     next.phone     = 'Phone is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await ownerService.create({
        full_name: form.full_name.trim(),
        phone:     form.phone.trim(),
        email:     form.email.trim() || null,
        address:   form.address.trim() || null,
      });

      onAdd?.(res.data);
      setSubmitting(false);
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create owner' });
      setSubmitting(false);
    }
  };

  const L = {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.06em', color: '#8fa39d',
    textTransform: 'uppercase', marginBottom: 6,
  };
  const I = (err) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`,
    borderRadius: 10, fontSize: 13.5, background: '#fff',
    color: '#0f2922', outline: 'none', fontFamily: 'inherit',
  });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add new owner"
      width={560}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="add-owner-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Saving…</> : <><i className="fas fa-user-plus"></i> Add owner</>}
          </button>
        </>
      }
    >
      <form id="add-owner-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Full name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={handleChange('full_name')}
            placeholder="Taylor Davis"
            style={I(errors.full_name)}
            autoFocus
          />
          {errors.full_name && <p style={E}>{errors.full_name}</p>}
        </div>

        {/* Phone + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(555) 018-4271"
              style={I(errors.phone)}
            />
            {errors.phone && <p style={E}>{errors.phone}</p>}
          </div>
          <div>
            <label style={L}>Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="taylor@example.com"
              style={I(errors.email)}
            />
            {errors.email && <p style={E}>{errors.email}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label style={L}>Address (optional)</label>
          <input
            type="text"
            value={form.address}
            onChange={handleChange('address')}
            placeholder="142 Riverside Dr, Portland, OR"
            style={I()}
          />
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}