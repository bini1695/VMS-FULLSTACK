import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import NewInvoiceModal from '../../components/receptionist/NewInvoiceModal.jsx';
import { invoiceService } from '../../services/invoiceService.js';
import './FrontDesk.css';

export default function BillingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  /* ---------- LOAD ---------- */
  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await invoiceService.list();
      setInvoices(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'All'
    ? invoices
    : invoices.filter((i) => i.status === filter);

  const totalUnpaid = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((s, i) => s + Number(i.total_amount || 0), 0);

  const stats = [
    { label: 'Total invoices', value: invoices.length,                                              icon: 'fa-file-invoice',       tone: 'blue'  },
    { label: 'Unpaid',         value: invoices.filter((i) => i.status === 'Unpaid').length,         icon: 'fa-clock',              tone: 'amber' },
    { label: 'Paid',           value: invoices.filter((i) => i.status === 'Paid').length,           icon: 'fa-circle-check',       tone: 'green' },
    { label: 'Outstanding',    value: `$${totalUnpaid.toFixed(2)}`,                                  icon: 'fa-circle-exclamation', tone: 'red'   },
  ];

  const markPaid = async (inv) => {
    try {
      await invoiceService.update(inv.invoice_id, { status: 'Paid' });
      setInvoices((prev) =>
        prev.map((i) => i.invoice_id === inv.invoice_id ? { ...i, status: 'Paid' } : i)
      );
      showToast(`Invoice ${inv.invoice_id} marked paid`);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleCreate = async (payload) => {
    const res = await invoiceService.create(payload);
    setInvoices((prev) => [res.data, ...prev]);
    showToast(`Invoice ${res.data.invoice_id} created`);
  };

  return (
    <DashboardLayout
      title="Billing & invoices"
      subtitle="Invoices for all clients"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="All invoices"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${invoices.length} shown`}
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <i className="fas fa-plus"></i> New invoice
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Unpaid', 'Partially Paid', 'Paid'].map((t) => (
            <button
              key={t}
              className={`tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading invoices…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Owner</th>
                <th>Animal</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td>
                    <strong style={{ color: '#167a68', fontSize: 12.5 }}>
                      {inv.invoice_id}
                    </strong>
                  </td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar
                        initials={(inv.owner_name || '??').split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                        tone="green"
                        size="sm"
                      />
                      <div>
                        <strong>{inv.owner_name || '—'}</strong>
                        <span>{inv.owner_phone || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>{inv.animal_name || '—'}</td>
                  <td>{inv.item_count || 0}</td>
                  <td><strong>${Number(inv.total_amount || 0).toFixed(2)}</strong></td>
                  <td>
                    <Badge tone={
                      inv.status === 'Paid'           ? 'green' :
                      inv.status === 'Partially Paid' ? 'amber' : 'red'
                    }>
                      {inv.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {inv.status !== 'Paid' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px' }}
                        onClick={() => markPaid(inv)}
                      >
                        Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && invoices.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No invoices yet. Click <strong>New invoice</strong> to create one.
          </p>
        )}
      </Card>

      <NewInvoiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}