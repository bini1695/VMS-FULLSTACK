import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import { qcRuns } from '../../data/labData.js';
import './Lab.css';

export default function QualityControl() {
  const passed = qcRuns.filter((q) => q.result === 'Pass').length;
  const failed = qcRuns.filter((q) => q.result === 'Fail').length;

  const stats = [
    { label: 'QC runs today', value: qcRuns.length, hint: 'All analyzers',         icon: 'fa-flask-vial',         tone: 'blue'  },
    { label: 'Passed',        value: passed,        hint: 'Within control limits', icon: 'fa-circle-check',       tone: 'green' },
    { label: 'Failed',        value: failed,        hint: 'Requires investigation', icon: 'fa-circle-exclamation', tone: 'red'   },
    { label: 'Next scheduled',value: '4:00 PM',     hint: 'Daily QC run',          icon: 'fa-clock',              tone: 'amber' },
  ];

  return (
    <DashboardLayout title="Quality control" subtitle="Daily QC runs and analyzer performance"
      user={{ name: 'Nora Okafor', role: 'Lab technician', initials: 'NO', tone: 'purple' }}>
      <div className="stats-grid">{stats.map((s) => <StatCard key={s.label} {...s} />)}</div>

      <Card title="Recent QC runs" subtitle="Latest analyzer quality checks"
        actions={<button className="btn btn-primary"><i className="fas fa-play"></i> Run QC now</button>}>
        <table className="data-table">
          <thead><tr><th>QC ID</th><th>Analyzer</th><th>Level</th><th>Result</th><th>Date</th><th>Operator</th></tr></thead>
          <tbody>
            {qcRuns.map((q) => (
              <tr key={q.id}>
                <td><strong style={{ color: '#167a68', fontSize: 12.5 }}>{q.id}</strong></td>
                <td>{q.analyzer}</td>
                <td>{q.level}</td>
                <td><Badge tone={q.result === 'Pass' ? 'green' : 'red'}>{q.result}</Badge></td>
                <td>{q.date}</td>
                <td>{q.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}