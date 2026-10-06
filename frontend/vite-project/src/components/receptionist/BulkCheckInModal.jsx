import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Avatar from '../common/Avatar.jsx';
import Badge from '../common/Badge.jsx';

const CLINICIANS = [
  'Dr. Amara Mensah',
  'Dr. Lena Park',
  'Dr. Priya Kapoor',
  'Dr. Daniel Kim',
  'Dr. Sofia Reyes',
  'Dr. Marcus Chen',
];

const ROOMS = [
  'Consultation room 1',
  'Consultation room 2',
  'Consultation room 3',
  'Examination room A',
  'Examination room B',
];

export default function BulkCheckInModal({ open, onClose, queue, onBulkCheckIn }) {
  const [selected, setSelected] = useState([]);
  const [clinician, setClinician] = useState(CLINICIANS[0]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* Reset state whenever modal opens */
  useEffect(() => {
    if (open) {
      setSelected([]);
      setClinician(CLINICIANS[0]);
      setRoom(ROOMS[0]);
      setSubmitting(false);
      setError('');
    }
  }, [open]);

  const handleClose = () => {
    setSelected([]);
    setError('');
    setSubmitting(false);
    onClose?.();
  };

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setError('');
  };

  const selectAll = () => {
    const allIds = queue.map((q) => q.id);
    setSelected(selected.length === queue.length ? [] : allIds);
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError('Select at least one patient to check in');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    onBulkCheckIn?.({
      ids: selected,
      clinician,
      room,
      checkedInAt: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    setSubmitting(false);
    handleClose();
  };

  const allSelected = queue.length > 0 && selected.length === queue.length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Bulk check-in"
      width={640}
      footer={
        <>
          <div style={{ flex: 1, fontSize: 12.5, color: '#8fa39d', fontWeight: 500 }}>
            {selected.length} of {queue.length} selected
          </div>
          <button
            type="button"
            className="btn btn-outline btn-lg"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={submitting || selected.length === 0}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Checking in…
              </>
            ) : (
              <>
                <i className="fas fa-check-double"></i> Check in {selected.length || ''}
              </>
            )}
          </button>
        </>
      }
    >
      {/* Select all header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: '#f6f9f8',
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            color: '#0f2922',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            onChange={selectAll}
            style={{ width: 16, height: 16, accentColor: '#167a68', cursor: 'pointer' }}
          />
          Select all patients
        </label>
        <span style={{ fontSize: 12, color: '#8fa39d' }}>
          {queue.length} in queue
        </span>
      </div>

      {/* Patient checklist */}
      <div
        style={{
          maxHeight: 280,
          overflowY: 'auto',
          marginBottom: 16,
          border: '1px solid #e6ecea',
          borderRadius: 10,
        }}
      >
        {queue.length === 0 ? (
          <p style={{ padding: 30, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No patients in queue.
          </p>
        ) : (
          queue.map((q, i) => {
            const isChecked = selected.includes(q.id);
            return (
              <label
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: isChecked ? '#e6f5ee' : '#fff',
                  borderBottom: i < queue.length - 1 ? '1px solid #f0f4f5' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(q.id)}
                  style={{ width: 16, height: 16, accentColor: '#167a68', cursor: 'pointer' }}
                />
                <Avatar initials={q.initials} tone={q.avatar} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#0f2922',
                      marginBottom: 2,
                    }}
                  >
                    {q.patient}
                  </div>
                  <div style={{ fontSize: 12, color: '#8fa39d' }}>{q.owner}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge tone={q.tone}>{q.status}</Badge>
                  <div style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
                    {q.time}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>

      {/* Assign clinician + room */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={L}>Assign clinician to all</label>
          <select value={clinician} onChange={(e) => setClinician(e.target.value)} style={I()}>
            {CLINICIANS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={L}>Assign room to all</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)} style={I()}>
            {ROOMS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: '#fdecec',
            border: '1px solid #f5c6c2',
            borderRadius: 10,
            fontSize: 12.5,
            color: '#a83b3b',
            fontWeight: 500,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <i className="fas fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Info */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 10,
          background: '#e6f0fa',
          color: '#2c5c92',
          fontSize: 12.5,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <i className="fas fa-circle-info" style={{ marginTop: 2 }}></i>
        <span>
          All selected patients will be marked <strong>Checked in</strong> and
          assigned to the chosen clinician and room.
        </span>
      </div>
    </Modal>
  );
}

/* ---------- styles ---------- */
const L = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#8fa39d',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const I = () => ({
  width: '100%',
  padding: '11px 14px',
  border: '1px solid #e6ecea',
  borderRadius: 10,
  fontSize: 13.5,
  background: '#fff',
  color: '#0f2922',
  outline: 'none',
  fontFamily: 'inherit',
});