import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { ownerService } from '../../services/ownerService.js';

const CHANNELS = [
  { value: 'Email', icon: 'fa-envelope' },
  { value: 'SMS',   icon: 'fa-comment-sms' },
];

const TEMPLATES = [
  { label: 'Appointment reminder', subject: 'Appointment reminder',
    body: 'Hi, this is a reminder about your upcoming appointment. Please reply to confirm.' },
  { label: 'Vaccination due',      subject: 'Vaccination due',
    body: 'Your pet\'s vaccination is due soon. Please call us to schedule.' },
  { label: 'Follow-up check',      subject: 'Follow-up check-in',
    body: 'We hope your pet is doing well after their visit. Please reply if you have concerns.' },
  { label: 'Payment reminder',     subject: 'Outstanding balance',
    body: 'This is a friendly reminder about the outstanding balance on your account.' },
  { label: 'Welcome message',      subject: 'Welcome to VetraCare',
    body: 'Welcome to VetraCare! We look forward to caring for your pet.' },
];

export default function ComposeMessageModal({ open, onClose, onSend }) {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    channel: 'Email',
    recipient: '',
    subject: '',
    body: '',
    scheduleAt: '',
    sendNow: true,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Load owners when modal opens */
  useState(() => {
    ownerService.list()
      .then((res) => setOwners(res.data || []))
      .catch(() => {});
  });

  const handleClose = () => {
    setForm({ channel: 'Email', recipient: '', subject: '', body: '', scheduleAt: '', sendNow: true });
    setErrors({});
    setSubmitting(false);
    onClose?.();
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const applyTemplate = (tpl) => {
    setForm((prev) => ({ ...prev, subject: tpl.subject, body: tpl.body }));
    setErrors((prev) => ({ ...prev, subject: '', body: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.recipient.trim()) next.recipient = 'Recipient is required';
    if (!form.body.trim())      next.body = 'Message body is required';
    if (form.channel === 'Email' && !form.subject.trim())
      next.subject = 'Subject is required for emails';
    if (!form.sendNow && !form.scheduleAt)
      next.scheduleAt = 'Pick a date and time to schedule';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      /* Find the owner by phone/email to link recipient_id */
      const matchedOwner = owners.find(
        (o) => o.email === form.recipient || o.phone === form.recipient
      );

      await onSend({
        recipient_id:      matchedOwner?.owner_id || null,
        recipient_contact: form.recipient.trim(),
        channel:           form.channel,
        subject:           form.subject.trim() || null,
        body:              form.body.trim(),
        scheduled_at:      form.sendNow ? null : form.scheduleAt.replace('T', ' ') + ':00',
      });

      handleClose();
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
      title="Compose message"
      width={640}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="compose-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting
              ? <><i className="fas fa-spinner fa-spin"></i> {form.sendNow ? 'Sending…' : 'Scheduling…'}</>
              : <><i className={`fas ${form.sendNow ? 'fa-paper-plane' : 'fa-clock'}`}></i> {form.sendNow ? 'Send message' : 'Schedule message'}</>}
          </button>
        </>
      }
    >
      <form id="compose-form" onSubmit={handleSubmit} noValidate>
        {/* Channel picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Channel</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {CHANNELS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, channel: c.value }))}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `1.5px solid ${form.channel === c.value ? '#167a68' : '#e6ecea'}`,
                  background: form.channel === c.value ? '#e6f5ee' : '#fff',
                  color: form.channel === c.value ? '#167a68' : '#0f2922',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <i className={`fas ${c.icon}`}></i>
                {c.value}
              </button>
            ))}
          </div>
        </div>

        {/* Quick select owner */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Quick select client</label>
          <select
            value=""
            onChange={(e) => {
              const o = owners.find((x) => String(x.owner_id) === e.target.value);
              if (o) {
                setForm((prev) => ({
                  ...prev,
                  recipient: form.channel === 'Email' ? (o.email || '') : (o.phone || ''),
                }));
                setErrors((prev) => ({ ...prev, recipient: '' }));
              }
            }}
            style={I()}
          >
            <option value="">— Choose an owner —</option>
            {owners.map((o) => (
              <option key={o.owner_id} value={o.owner_id}>
                {o.full_name} {o.email ? `· ${o.email}` : o.phone ? `· ${o.phone}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>
            {form.channel === 'Email' ? 'To (email address)' : 'To (phone number)'}
          </label>
          <input
            type={form.channel === 'Email' ? 'email' : 'tel'}
            value={form.recipient}
            onChange={handleChange('recipient')}
            placeholder={form.channel === 'Email' ? 'taylor@example.com' : '(555) 018-4271'}
            style={I(errors.recipient)}
          />
          {errors.recipient && <p style={E}>{errors.recipient}</p>}
        </div>

        {/* Templates */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Quick templates</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: '1px solid #e6ecea',
                  background: '#fff',
                  color: '#4f6b63',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject (email only) */}
        {form.channel === 'Email' && (
          <div style={{ marginBottom: 16 }}>
            <label style={L}>Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={handleChange('subject')}
              placeholder="Appointment reminder"
              style={I(errors.subject)}
            />
            {errors.subject && <p style={E}>{errors.subject}</p>}
          </div>
        )}

        {/* Body */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Message</label>
          <textarea
            value={form.body}
            onChange={handleChange('body')}
            placeholder="Write your message here..."
            rows={5}
            style={{ ...I(errors.body), resize: 'vertical', fontFamily: 'inherit' }}
          />
          {errors.body && <p style={E}>{errors.body}</p>}
          <div style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
            {form.body.length} characters
            {form.channel === 'SMS' && ` · ${Math.ceil(form.body.length / 160)} SMS parts`}
          </div>
        </div>

        {/* Schedule option */}
        <div style={{ padding: 14, background: '#f6f9f8', border: '1px solid #e6ecea', borderRadius: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', marginBottom: form.sendNow ? 0 : 12 }}>
            <input
              type="checkbox"
              checked={form.sendNow}
              onChange={handleChange('sendNow')}
              style={{ width: 16, height: 16, accentColor: '#167a68', cursor: 'pointer' }}
            />
            <span>
              <strong style={{ display: 'block' }}>Send now</strong>
              <span style={{ fontSize: 11.5, color: '#8fa39d' }}>Uncheck to schedule for later</span>
            </span>
          </label>

          {!form.sendNow && (
            <div>
              <label style={L}>Schedule at</label>
              <input
                type="datetime-local"
                value={form.scheduleAt}
                onChange={handleChange('scheduleAt')}
                style={I(errors.scheduleAt)}
              />
              {errors.scheduleAt && <p style={E}>{errors.scheduleAt}</p>}
            </div>
          )}
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}