import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { labColumns } from '../../data/labData.js';
import './Lab.css';

function Card1({ item }) {
  return (
    <div className={`kanban-card ${item.flagged ? 'flagged' : ''}`}>
      <div className="kanban-card-top">
        <span className="kanban-card-id">{item.id}</span>
        {item.tag && <Badge tone={item.tone}>{item.tag}</Badge>}
      </div>
      <div className="kanban-card-patient">
        <Avatar initials={item.initials} tone={item.avatar} size="sm" />
        <div>
          <strong>{item.patient}</strong>
          <span>{item.species}</span>
        </div>
      </div>
      <div className="kanban-card-footer">
        <span>{item.test}</span>
        <span>{item.time}</span>
      </div>
    </div>
  );
}

function Column({ title, color, items }) {
  return (
    <div className="kanban-col">
      <div className="kanban-col-header">
        <span><span className="dot" style={{ background: color }}></span>{title}</span>
        <span className="kanban-col-count">{items.length}</span>
      </div>
      {items.map((it) => <Card1 key={it.id} item={it} />)}
    </div>
  );
}

export default function SampleTracking() {
  return (
    <DashboardLayout
      title="Sample tracking"
      subtitle="Live workflow across Received → Processing → Completed"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}
    >
      <Card
        title="Workflow"
        subtitle="Drag not enabled — use requisition actions to advance samples"
        actions={
          <button className="btn btn-outline">
            <i className="fas fa-rotate"></i> Refresh
          </button>
        }
      >
        <div className="kanban">
          <Column title="Received"   color="#3b7bbf" items={labColumns.received} />
          <Column title="Processing" color="#e8a340" items={labColumns.processing} />
          <Column title="Completed"  color="#2ea37b" items={labColumns.completed} />
        </div>
      </Card>
    </DashboardLayout>
  );
}