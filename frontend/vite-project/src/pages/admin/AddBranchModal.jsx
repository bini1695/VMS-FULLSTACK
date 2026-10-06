import { useState } from 'react';
import Modal from '../../components/common/Modal.jsx';

const MANAGER_OPTIONS = [
  'Dr. Amara Mensah',
  'Dr. Lena Park',
  'Dr. Priya Kapoor',
  'Dr. Daniel Kim',
  'Dr. Sofia Reyes',
];

const EMPTY_FORM = {
  name: '',
  code: '',
  address: '',
  phone: '',
  manager: 'Dr. Amara Mensah',
  status: 'Active',
};

export default function AddBranchModal({ open, onClose, onAdd }) {
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
    let value = e.target.value;

    // Auto-uppercase the branch code
    if (field === 'code') value = value.toUpperCase().slice(0, 4);

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Branch name is required';
    if (!form.code.trim()) next.code = 'Code is required';
    else if (!/^[A-Z]{2,4}$/.test(form.code))
      next.code = 'Code must be 2-4 uppercase letters';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const newBranch = {
      id: Date.now(),
      name: form.name.trim(),
      code: form.code.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      manager: form.manager,
      status: form.status,
      staff: 0,
      appointments: 0,
    };

    onAdd?.(newBranch);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add clinic branch"
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
            form="add-branch-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving…
              </>
            ) : (
              <>
                <i className="fas fa-hospital"></i> Add branch
              </>
            )}
          </button>
        </>
      }
    >
      <form id="add-branch-form" onSubmit={handleSubmit} noValidate>
        {/* Branch name */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Branch name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Eastside Clinic"
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Code + Phone row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Branch code</label>
            <input
              type="text"
              value={form.code}
              onChange={handleChange('code')}
              placeholder="EST"
              maxLength={4}
              style={inputStyle(errors.code)}
            />
            {errors.code && <p style={errorStyle}>{errors.code}</p>}
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(555) 014-2500"
              style={inputStyle(errors.phone)}
            />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Address</label>
          <input
            type="text"
            value={form.address}
            onChange={handleChange('address')}
            placeholder="120 Eastside Blvd, Portland, OR"
            style={inputStyle(errors.address)}
          />
          {errors.address && <p style={errorStyle}>{errors.address}</p>}
        </div>

        {/* Manager + Status row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Manager</label>
            <select
              value={form.manager}
              onChange={handleChange('manager')}
              style={inputStyle()}
            >
              {MANAGER_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              style={inputStyle()}
            >
              <option value="Active">Active</option>
              <option value="Limited">Limited</option>
            </select>
          </div>
        </div>

        {/* Info box */}
        <div
          style={{
            marginTop: 4,
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
            A new branch starts with 0 staff and 0 appointments. You can assign team
            members to this branch from the <strong>User accounts</strong> page.
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