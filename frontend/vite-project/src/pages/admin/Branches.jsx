import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import AddBranchModal from './AddBranchModal.jsx';
import { exportToCsv } from '../../utils/exportCsv.js';
import { branches as initialBranches } from '../../data/adminData.js';

export default function Branches() {
  const [branches, setBranches] = useState(initialBranches);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');

  const filtered = branches.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.code.toLowerCase().includes(query.toLowerCase()) ||
    b.address.toLowerCase().includes(query.toLowerCase())
  );

  const stats = [
    { label: 'Total branches',    value: branches.length,                                                hint: 'Across the network',        icon: 'fa-hospital',              tone: 'green' },
    { label: 'Total staff',       value: branches.reduce((s, b) => s + b.staff, 0),                       hint: 'Active employees',          icon: 'fa-users',                 tone: 'blue'  },
    { label: 'Appointments today',value: branches.reduce((s, b) => s + b.appointments, 0),                hint: 'Across all branches',       icon: 'fa-calendar-check',        tone: 'teal'  },
    { label: 'Limited capacity',  value: branches.filter((b) => b.status === 'Limited').length,           hint: 'Branches at low capacity',  icon: 'fa-triangle-exclamation',  tone: 'amber' },
  ];

  const handleAddBranch = (branch) => {
    setBranches((prev) => [branch, ...prev]);
    setToast(`${branch.name} added successfully`);
    setTimeout(() => setToast(''), 3200);
  };

  const removeBranch = (id) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleStatus = (id) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'Active' ? 'Limited' : 'Active' }
          : b
      )
    );
  };

  return (
    <DashboardLayout
      title="Clinic branches"
      subtitle={`${branches.length} active locations · Northstar Animal Health`}
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="All branches"
        subtitle={`${filtered.length} of ${branches.length} shown`}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Add branch
          </button>
        }
      >
        {/* Search bar */}
        <div style={{ marginBottom: 16 }}>
          <div className="search-box" style={{ maxWidth: 380 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input
              placeholder="Search by name, code or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Address</th>
              <th>Manager</th>
              <th>Staff</th>
              <th>Appointments today</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div className="cell-avatar-group">
                    <div className="avatar tone-teal" style={{ fontSize: 11, fontWeight: 700 }}>
                      {b.code}
                    </div>
                    <div>
                      <strong>{b.name}</strong>
                      <span>{b.phone}</span>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  {b.address}
                </td>
                <td>{b.manager}</td>
                <td>{b.staff}</td>
                <td>{b.appointments}</td>
                <td>
                  <Badge tone={b.status === 'Active' ? 'green' : 'amber'}>
                    {b.status}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', marginRight: 6 }}
                    onClick={() => toggleStatus(b.id)}
                  >
                    {b.status === 'Active' ? 'Limit' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{
                      padding: '6px 12px',
                      color: '#a83b3b',
                      borderColor: '#f0c1c1',
                    }}
                    onClick={() => removeBranch(b.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p
            style={{
              padding: 40,
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No branches match your search.
          </p>
        )}
      </Card>

      {/* Add branch modal */}
      <AddBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddBranch}
      />

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#0f2922',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 500,
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 2000,
          }}
        >
          <i className="fas fa-circle-check" style={{ color: '#a5e0c0' }}></i>
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}