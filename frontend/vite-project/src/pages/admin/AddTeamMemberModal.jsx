import { useState } from 'react';
import Modal from '../../components/common/Modal.jsx';

const ROLE_OPTIONS = [
  'Veterinarian',
  'Receptionist',
  'Lab technician',
  'Pharmacist',
  'Practice manager',
  'Administrator',
];

const BRANCH_OPTIONS = ['Riverside', 'Central', 'Westfield'];

const EMPTY_FORM = {
  name: '',
  email: '',
  role: 'Veterinarian',
  branch: 'Riverside',
  sendInvite: true,
};

export default function AddTeamMemberModal({ open, onClose, onAdd }) {
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const pickAvatarTone = () => {
    const tones = ['green', 'blue', 'purple', 'amber', 'teal', 'pink'];
    return tones[Math.floor(Math.random() * tones.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const newMember = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      branch: form.branch,
      status: form.sendInvite ? 'Invited' : 'Active',
      tone: pickAvatarTone(),
      initials: buildInitials(form.name),
    };

    onAdd?.(newMember);
    setSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add team member"
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
            form="add-member-form"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving…
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Add member
              </>
            )}
          </button>
        </>
      }
    >
      <form id="add-member-form" onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Full name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Dr. Jane Smith"
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="jane.smith@northstar.vet"
            style={inputStyle(errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Role
            </label>
            <select value={form.role} onChange={handleChange('role')} style={inputStyle()}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Branch
            </label>
            <select value={form.branch} onChange={handleChange('branch')} style={inputStyle()}>
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

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
            checked={form.sendInvite}
            onChange={handleChange('sendInvite')}
            style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
          />
          <span>
            <strong style={{ display: 'block' }}>Send email invitation</strong>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              The user will receive a signup link. Uncheck to add as active immediately.
            </span>
          </span>
        </label>

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
            Permissions are assigned automatically based on the selected role. You can
            edit them later from the user's profile.
          </span>
        </div>
      </form>
    </Modal>
  );
}

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