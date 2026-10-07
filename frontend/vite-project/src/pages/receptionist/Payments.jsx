import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import RecordPaymentModal from '../../components/receptionist/RecordPaymentModal.jsx';
import { paymentService } from '../../services/paymentService.js';
import './FrontDesk.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await paymentService.list();
      setPayments(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'All'
    ? payments
    : payments.filter((p) => p.method === filter);

  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  const stats = [
    { label: 'Total collected', value: `$${total.toFixed(2)}`, hint: 'All time',      icon: 'fa-dollar-sign', tone: 'green' },
    { label: 'Transactions',    value: payments.length,        hint: 'All methods',   icon: 'fa-credit-card', tone: 'blue'  },
    { label: 'Cash payments',   value: payments.filter((p) => p.method === 'Cash').length,    icon: 'fa-money-bill',  tone: 'amber' },
    { label: 'Card payments',   value: payments.filter((p) => p.method?.includes('card')).length, icon: 'fa-credit-card', tone: 'purple' },
  ];

  const handleRecord = async (payload) => {
    const res = await paymentService.create(payload);
    setPayments((prev) => [res.data, ...prev]);
    showToast(
      `Payment of $${Number(res.data.amount).toFixed(2)} recorded · Invoice ${res.invoice_status}`
    );
  };

  return (
    <DashboardLayout
      title="Payments"
      subtitle="Transaction history"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card
        title="Payment history"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${payments.length} shown`}
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <i className="fas fa-plus"></i> Record payment
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Cash', 'Credit card', 'Debit card', 'Bank transfer', 'Insurance', 'Check'].map((t) => (
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
            Loading payments…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Invoice</th>
                <th>Owner</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.payment_id}>
                  <td>
                    <strong style={{ color: '#167a68', fontSize: 12.5 }}>
                      PMT-{String(p.payment_id).padStart(4, '0')}
                    </strong>
                  </td>
                  <td>{p.invoice_id}</td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar
                        initials={(p.owner_name || '??').split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                        tone="green"
                        size="sm"
                      />
                      <strong>{p.owner_name || '—'}</strong>
                    </div>
                  </td>
                  <td><strong>${Number(p.amount).toFixed(2)}</strong></td>
                  <td>{p.method}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <Badge tone={p.invoice_status === 'Paid' ? 'green' : 'amber'}>
                      {p.invoice_status || '—'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && payments.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No payments yet. Click <strong>Record payment</strong> to add one.
          </p>
        )}
      </Card>

      <RecordPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRecord={handleRecord}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}