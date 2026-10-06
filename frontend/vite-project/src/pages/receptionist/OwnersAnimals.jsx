import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import AddOwnerModal from '../../components/receptionist/AddOwnerModal.jsx';
import { ownerService } from '../../services/ownerService.js';
import './FrontDesk.css';

export default function OwnersAnimals() {
  const [owners, setOwners]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [query, setQuery]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast]         = useState('');

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  /* ---------- LOAD FROM DB ---------- */
  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const q = query ? `?q=${encodeURIComponent(query)}` : '';
      const res = await ownerService.list(q);
      setOwners(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 200);  // debounce
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /* ---------- CREATE ---------- */
  const handleAddOwner = (owner) => {
    setOwners((prev) => [owner, ...prev]);
    showToast(`${owner.full_name} added to database`);
  };

  const stats = [
    {
      label: 'Total owners',
      value: owners.length,
      hint: 'Registered clients',
      icon: 'fa-users',
      tone: 'green',
    },
    {
      label: 'Total animals',
      value: owners.reduce((s, o) => s + Number(o.animal_count || 0), 0),
      hint: 'Under care',
      icon: 'fa-paw',
      tone: 'blue',
    },
    {
      label: 'Multi-pet owners',
      value: owners.filter((o) => Number(o.animal_count) > 1).length,
      hint: 'Owning 2+ animals',
      icon: 'fa-paw',
      tone: 'purple',
    },
    {
      label: 'With email',
      value: owners.filter((o) => o.email).length,
      hint: 'Reachable by email',
      icon: 'fa-envelope',
      tone: 'amber',
    },
  ];

  return (
    <DashboardLayout
      title="Owners & animals"
      subtitle="Client directory and their pets"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="Client directory"
        subtitle={loading ? 'Loading…' : `${owners.length} owners`}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <i className="fas fa-user-plus"></i> Add owner
          </button>
        }
      >
        {/* Search */}
        <div className="search-box" style={{ maxWidth: 380, marginBottom: 16 }}>
          <i className="fas fa-magnifying-glass"></i>
          <input
            placeholder="Search by name, phone or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading owners…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Contact</th>
                <th>Animals</th>
                <th>Since</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((o) => (
                <tr key={o.owner_id}>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar
                        initials={(o.full_name || '??')
                          .split(/\s+/).map((n) => n[0]).slice(0, 2).join('')
                          .toUpperCase()}
                        tone="green"
                        size="sm"
                      />
                      <div>
                        <strong>{o.full_name}</strong>
                        <span>#{o.owner_id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{o.phone}</div>
                    <div style={{ fontSize: 11.5, color: '#8fa39d' }}>{o.email || '—'}</div>
                  </td>
                  <td>
                    <span className="badge green">
                      {o.animal_count || 0} animal{o.animal_count === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td>{new Date(o.created_at).getFullYear()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 12px' }}
                      onClick={() => showToast(`Viewing ${o.full_name}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && owners.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No owners yet. Click <strong>Add owner</strong> to create one.
          </p>
        )}
      </Card>

      <AddOwnerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddOwner}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}