import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { findings as initial } from '../../data/labData.js';
import './Lab.css';

export default function FindingsEntry() {
  const [findings, setFindings] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0].id);
  const [note, setNote] = useState('');
  const [toast, setToast] = useState('');

  const active = findings.find((f) => f.id === activeId);

  const handleSave = () => {
    setToast(`Findings saved for ${active.id}`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleValidate = () => {
    setFindings((prev) =>
      prev.map((f) => (f.id === active.id ? { ...f, status: 'Released' } : f))
    );
    setToast(`${active.id} result released to clinician`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <DashboardLayout
      title="Findings entry"
      subtitle="Microscopy, hematology and chemistry result entry"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}
    >
      <div className="grid-2col">
        {/* LEFT — list of pending findings */}
        <Card title="Awaiting findings" subtitle={`${findings.length} samples`}>
          {findings.map((f) => (
            <div
              key={f.id}
              className={`schedule-item ${activeId === f.id ? 'active' : ''}`}
              onClick={() => setActiveId(f.id)}
            >
              <div className="schedule-time" style={{ width: 90, fontSize: 11.5 }}>{f.id}</div>
              <div className="schedule-info">
                <strong>{f.patient}</strong>
                <span>{f.test} · {f.value}</span>
              </div>
              <Badge tone={f.status === 'Released' ? 'green' : f.status === 'Abnormal' ? 'red' : 'blue'}>
                {f.status}
              </Badge>
            </div>
          ))}
        </Card>

        {/* RIGHT — entry form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title={`Findings · ${active.id}`} subtitle={`${active.patient} · ${active.test}`}>
            <div style={{
              background: active.status === 'Abnormal' ? '#fdf3f3' : '#e6f5ee',
              border: active.status === 'Abnormal' ? '1px solid #f3d0d0' : '1px solid #b8e0d9',
              padding: 14,
              borderRadius: 10,
              marginBottom: 16,
            }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4, color: '#0f2922' }}>
                {active.organism}
              </div>
              <div style={{
                fontSize: 12,
                color: active.status === 'Abnormal' ? '#a83b3b' : '#167a68',
                fontWeight: 500,
              }}>
                {active.value} · Reference: {active.ref}
              </div>
            </div>

            <div className="form-group">
              <label className="lab-label">Additional notes</label>
              <textarea
                className="lab-textarea"
                rows={4}
                placeholder="Enter microscopy notes, cell morphology observations, etc."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
              <i className="fas fa-paperclip"></i> Attach diagnostic image
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>
                <i className="fas fa-save"></i> Save draft
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleValidate}>
                <i className="fas fa-circle-check"></i> Validate &amp; release
              </button>
            </div>
          </Card>
        </div>
      </div>

      {toast && (
        <div className="lab-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}