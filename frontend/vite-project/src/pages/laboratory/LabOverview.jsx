import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import AttachFiles from '../../components/lab/AttachFiles.jsx';
import NewRequisitionModal from '../../components/lab/NewRequisitionModal.jsx';
import AnalyzerFilter from '../../components/lab/AnalyzerFilter.jsx';
import { labStats as initialStats, labColumns as initialColumns } from '../../data/labData.js';
import './Lab.css';

function KanbanCard({ item }) {
  return (
    <div className={`kanban-card ${item.flagged ? 'flagged' : ''}`}>
      <div className="kanban-card-top">
        <span className="kanban-card-id">{item.id}</span>
        {item.tag && <Badge tone={item.tone}>{item.tag}</Badge>}
      </div>
      <div className="kanban-card-patient">
        <Avatar initials={item.initials} tone={item.avatar} size="sm" />
        <div><strong>{item.patient}</strong><span>{item.species}</span></div>
      </div>
      <div className="kanban-card-footer">
        <span>{item.test}</span><span>{item.time}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ title, dotColor, items }) {
  return (
    <div className="kanban-col">
      <div className="kanban-col-header">
        <span><span className="dot" style={{ background: dotColor }}></span>{title}</span>
        <span className="kanban-col-count">{items.length}</span>
      </div>
      {items.length === 0
        ? <p style={{ padding: '20px 8px', textAlign: 'center', fontSize: 12.5, color: '#8fa39d' }}>No samples</p>
        : items.map((it) => <KanbanCard key={it.id} item={it} />)}
    </div>
  );
}

export default function LabOverview() {
  const [columns, setColumns] = useState(initialColumns);
  const [analyzerFilter, setAnalyzerFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const filterItems = (items) => analyzerFilter === 'all' ? items : items.filter((it) => it.analyzer === analyzerFilter);

  const handleAdd = (newReq) => {
    setColumns((prev) => ({ ...prev, received: [newReq, ...prev.received] }));
    showToast(`Requisition ${newReq.id} created for ${newReq.patient}`);
  };

  const handleRelease = () => {
    const n = attachments.length;
    showToast(n > 0 ? `Result released with ${n} attachment${n > 1 ? 's' : ''}` : 'Result released');
    setAttachments([]);
  };

  const totalVisible = columns.received.length + columns.processing.length + columns.completed.length;
  const stats = initialStats.map((s, i) => i === 0 ? { ...s, value: String(columns.received.length) } : s);

  return (
    <DashboardLayout title="Laboratory operations" subtitle="Central Hospital Laboratory · Live sample workflow"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid-2col">
        <Card title="Sample tracking" subtitle={`Dragless workflow view · ${totalVisible} visible samples`}
          actions={<><AnalyzerFilter value={analyzerFilter} onChange={setAnalyzerFilter} />
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}><i className="fas fa-plus"></i> New requisition</button></>}>
          {analyzerFilter !== 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 12, background: '#e6f5ee', border: '1px solid #b8e0d9', borderRadius: 10, fontSize: 13, color: '#167a68', fontWeight: 500 }}>
              <i className="fas fa-filter"></i> Filtered by <strong>{analyzerFilter}</strong>
              <button type="button" onClick={() => setAnalyzerFilter('all')} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#167a68', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Clear filter</button>
            </div>
          )}
          <div className="kanban">
            <KanbanColumn title="Received"   dotColor="#3b7bbf" items={filterItems(columns.received)} />
            <KanbanColumn title="Processing" dotColor="#e8a340" items={filterItems(columns.processing)} />
            <KanbanColumn title="Completed"  dotColor="#2ea37b" items={filterItems(columns.completed)} />
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Findings entry" subtitle="LAB-2838 · Cooper Davis">
            <div style={{ background: '#fdf3f3', border: '1px solid #f3d0d0', padding: 14, borderRadius: 10, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f2922', marginBottom: 4 }}>Malassezia organisms</div>
              <div style={{ fontSize: 12, color: '#a83b3b', fontWeight: 500 }}>HIGH · Reference: none to rare</div>
            </div>
            <div style={{ border: '1px solid #e6ecea', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 8 }}>Microscopy findings</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: '#0f2922' }}>Numerous budding yeast; moderate cocci present.</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="lab-label">Attachments</label>
              <AttachFiles files={attachments} onChange={setAttachments} />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRelease}>
              <i className="fas fa-circle-check"></i> Validate &amp; release result
            </button>
          </Card>

          <Card title="Equipment integration" subtitle="Analyzer interface status">
            {[
              { name: 'ProCyte DX',   status: 'Online · Last sync 2 min ago',    tone: 'green', icon: 'fa-circle-check' },
              { name: 'Catalyst One', status: 'Online · Last sync 5 min ago',    tone: 'green', icon: 'fa-circle-check' },
              { name: 'SedVue',       status: 'Maintenance scheduled · 4:00 PM', tone: 'amber', icon: 'fa-clock' },
            ].map((eq) => (
              <div key={eq.name} className="checklist-item">
                <div className="checklist-icon" style={{ background: eq.tone === 'green' ? '#e6f5ee' : '#fdf2e2', color: eq.tone === 'green' ? '#2ea37b' : '#e8a340' }}>
                  <i className={`fas ${eq.icon}`}></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>{eq.name}</strong><span>{eq.status}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <NewRequisitionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      {toast && <div className="lab-toast"><i className="fas fa-circle-check"></i> {toast}</div>}
    </DashboardLayout>
  );
}