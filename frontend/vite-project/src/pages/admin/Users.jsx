import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import AddTeamMemberModal from './AddTeamMemberModal.jsx';
import { teamMembers as initialMembers } from '../../data/adminData.js';

export default function Users() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = members.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && m.status === 'Active') ||
      (filter === 'Invited' && m.status === 'Invited') ||
      (filter === 'Suspended' && m.status === 'Suspended');
    return matchesQuery && matchesFilter;
  });

  const toggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'Active' ? 'Suspended' : 'Active' }
          : m
      )
    );
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMember = (member) => {
    setMembers((prev) => [member, ...prev]);
    setToast(`${member.name} added as ${member.role}`);
    setTimeout(() => setToast(''), 3200);
  };

  return (
    <DashboardLayout
      title="User account management"
      subtitle="Vets, reception, pharmacy and laboratory teams"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <Card
        title="Team members"
        subtitle={`${filtered.length} of ${members.length} accounts`}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <i className="fas fa-user-plus"></i> Add team member
          </button>
        }
      >
        {/* Search + filters */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <div className="search-box" style={{ minWidth: 260, flex: 1 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['All', 'Active', 'Invited', 'Suspended'].map((t) => (
              <button
                key={t}
                className={`tab ${filter === t ? 'active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Team member</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className="cell-avatar-group">
                    <Avatar initials={m.initials} tone={m.tone} />
                    <div>
                      <strong>{m.name}</strong>
                      <span>{m.email}</span>
                    </div>
                  </div>
                </td>
                <td>{m.role}</td>
                <td>{m.branch}</td>
                <td>
                  <Badge
                    tone={
                      m.status === 'Active'
                        ? 'green'
                        : m.status === 'Invited'
                        ? 'amber'
                        : 'red'
                    }
                  >
                    {m.status}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', marginRight: 6 }}
                    onClick={() => toggleStatus(m.id)}
                  >
                    {m.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{
                      padding: '6px 12px',
                      color: '#a83b3b',
                      borderColor: '#f0c1c1',
                    }}
                    onClick={() => removeMember(m.id)}
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
            No accounts match your search.
          </p>
        )}
      </Card>

      {/* Modal */}
      <AddTeamMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddMember}
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