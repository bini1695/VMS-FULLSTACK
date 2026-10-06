import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import AddServiceModal from './AddServiceModal.jsx';
import { serviceGroups as initialGroups } from '../../data/adminData.js';

export default function Services() {
  const [groups, setGroups] = useState(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState(null);
  const [toast, setToast] = useState('');

  /* ---------- toggle active ---------- */
  const toggleActive = (category, itemCode) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.category === category
          ? {
              ...g,
              items: g.items.map((it) =>
                it.code === itemCode ? { ...it, active: !it.active } : it
              ),
            }
          : g
      )
    );
  };

  /* ---------- update price inline ---------- */
  const updatePrice = (category, itemCode, newPrice) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.category === category
          ? {
              ...g,
              items: g.items.map((it) =>
                it.code === itemCode
                  ? { ...it, price: Number(newPrice) || 0 }
                  : it
              ),
            }
          : g
      )
    );
  };

  /* ---------- remove service ---------- */
  const removeService = (category, itemCode) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.category === category
          ? { ...g, items: g.items.filter((it) => it.code !== itemCode) }
          : g
      )
    );
  };

  /* ---------- open modal with a preset category ---------- */
  const openModalFor = (category) => {
    setDefaultCategory(category);
    setModalOpen(true);
  };

  /* ---------- handle add from modal ---------- */
  const handleAddService = (newService) => {
    setGroups((prev) => {
      // If the category already exists, prepend to its items
      const existing = prev.find((g) => g.category === newService.category);
      if (existing) {
        return prev.map((g) =>
          g.category === newService.category
            ? { ...g, items: [newService, ...g.items] }
            : g
        );
      }
      // Otherwise create a new category group
      return [...prev, { category: newService.category, items: [newService] }];
    });

    setToast(`${newService.name} added to ${newService.category}`);
    setTimeout(() => setToast(''), 3200);
  };

  /* ---------- aggregate counts ---------- */
  const totalServices = groups.reduce((sum, g) => sum + g.items.length, 0);
  const activeServices = groups.reduce(
    (sum, g) => sum + g.items.filter((it) => it.active).length,
    0
  );

  return (
    <DashboardLayout
      title="Services & pricing"
      subtitle={`Standard catalog · ${totalServices} services across all branches`}
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      {/* Summary strip */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green"><i className="fas fa-clipboard-list"></i></div>
          <div className="stat-body">
            <div className="stat-label">Total services</div>
            <div className="stat-value">{totalServices}</div>
            <div className="stat-hint">Across all categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><i className="fas fa-circle-check"></i></div>
          <div className="stat-body">
            <div className="stat-label">Active</div>
            <div className="stat-value">{activeServices}</div>
            <div className="stat-hint">Currently bookable</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><i className="fas fa-circle-pause"></i></div>
          <div className="stat-body">
            <div className="stat-label">Inactive</div>
            <div className="stat-value">{totalServices - activeServices}</div>
            <div className="stat-hint">Hidden from booking</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><i className="fas fa-layer-group"></i></div>
          <div className="stat-body">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{groups.length}</div>
            <div className="stat-hint">Service groupings</div>
          </div>
        </div>
      </div>

      {/* Service groups */}
      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 20 }}>
          <Card
            title={group.category}
            subtitle={`${group.items.length} service${group.items.length === 1 ? '' : 's'}`}
            actions={
              <button
                className="btn btn-outline"
                onClick={() => openModalFor(group.category)}
              >
                <i className="fas fa-plus"></i> Add service
              </button>
            }
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Service</th>
                  <th>Duration</th>
                  <th>Price (USD)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((s) => (
                  <tr key={s.code}>
                    <td>
                      <strong style={{ color: 'var(--primary)', fontSize: 12.5 }}>
                        {s.code}
                      </strong>
                    </td>
                    <td>{s.name}</td>
                    <td>{s.duration}</td>
                    <td>
                      <input
                        type="number"
                        value={s.price}
                        onChange={(e) =>
                          updatePrice(group.category, s.code, e.target.value)
                        }
                        style={{
                          width: 90,
                          padding: '6px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          outline: 'none',
                        }}
                      />
                    </td>
                    <td>
                      <Badge tone={s.active ? 'green' : 'gray'}>
                        {s.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', marginRight: 6 }}
                        onClick={() => toggleActive(group.category, s.code)}
                      >
                        {s.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{
                          padding: '6px 12px',
                          color: '#a83b3b',
                          borderColor: '#f0c1c1',
                        }}
                        onClick={() => removeService(group.category, s.code)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {group.items.length === 0 && (
              <p
                style={{
                  padding: 30,
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                No services in this category yet.
              </p>
            )}
          </Card>
        </div>
      ))}

      {/* Add service modal */}
      <AddServiceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setDefaultCategory(null);
        }}
        onAdd={handleAddService}
        defaultCategory={defaultCategory}
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