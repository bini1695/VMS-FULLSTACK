import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { invoiceService } from '../../services/invoiceService.js';

const METHODS = ['Cash', 'Credit card', 'Debit card', 'Bank transfer', 'Insurance', 'Check'];

export default function RecordPaymentModal({ open, onClose, onRecord }) {
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [form, setForm] = useState({
    invoice_id: '',
    amount: '',
    method: 'Cash',
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Load unpaid invoices on open */
  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingInvoices(true);
      try {
        const res = await invoiceService.list();
        /* Only show invoices that aren't fully paid */
        setInvoices((res.data || []).filter((i) => i.status !== 'Paid'));
      } catch {
        setInvoices([]);
      } finally {
        setLoadingInvoices(false);
      }
    };
    load();
  }, [open]);

  const handleClose = () => {
    setForm({ invoice_id: '', amount: '', method: 'Cash', reference: '', notes: '' });
    setErrors({});
    setSubmitting(false);
    onClose?.();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  /* Auto-fill amount when invoice selected */
  const handleInvoiceChange = (e) => {
    const id = e.target.value;
    const inv = invoices.find((i) => i.invoice_id === id);
    setForm((prev) => ({
      ...prev,
      invoice_id: id,
      amount: inv ? Number(inv.total_amount).toFixed(2) : '',
    }));
    setErrors((prev) => ({ ...prev, invoice_id: '' }));
  };

  const selectedInvoice = invoices.find((i) => i.invoice_id === form.invoice_id);

  const validate = () => {
    const next = {};
    if (!form.invoice_id) next.invoice_id = 'Select an invoice';
    if (!form.amount || Number(form.amount) <= 0)
      next.amount = 'Enter a valid amount';
    else if (selectedInvoice && Number(form.amount) > Number(selectedInvoice.total_amount))
      next.amount = 'Amount exceeds invoice total';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onRecord({
        invoice_id: form.invoice_id,
        amount: Number(form.amount),
        method: form.method,
        reference: form.reference.trim() || null,
        notes: form.notes.trim() || null,
      });
      handleClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const L = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 6 };
  const I = (err) => ({ width: '100%', padding: '11px 14px', border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`, borderRadius: 10, fontSize: 13.5, background: '#fff', color: '#0f2922', outline: 'none', fontFamily: 'inherit' });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Record payment"
      width={560}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="record-payment-form" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Saving…</> : <><i className="fas fa-check"></i> Record payment</>}
          </button>
        </>
      }
    >
      <form id="record-payment-form" onSubmit={handleSubmit} noValidate>
        {/* Invoice picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Select invoice</label>
          <select
            value={form.invoice_id}
            onChange={handleInvoiceChange}
            style={I(errors.invoice_id)}
            disabled={loadingInvoices}
          >
            <option value="">
              {loadingInvoices ? 'Loading…' : '— Choose an unpaid invoice —'}
            </option>
            {invoices.map((inv) => (
              <option key={inv.invoice_id} value={inv.invoice_id}>
                {inv.invoice_id} · {inv.owner_name || '?'} · ${Number(inv.total_amount).toFixed(2)}
              </option>
            ))}
          </select>
          {errors.invoice_id && <p style={E}>{errors.invoice_id}</p>}
          {!loadingInvoices && invoices.length === 0 && (
            <p style={{ fontSize: 11.5, color: '#8fa39d', marginTop: 4 }}>
              No unpaid invoices. All invoices are already paid.
            </p>
          )}
        </div>

        {/* Selected invoice summary */}
        {selectedInvoice && (
          <div style={{ padding: 14, borderRadius: 10, background: '#f6f9f8', border: '1px solid #e6ecea', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2922' }}>
                  {selectedInvoice.owner_name}
                </div>
                <div style={{ fontSize: 12, color: '#8fa39d', marginTop: 2 }}>
                  {selectedInvoice.animal_name || 'No animal linked'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#8fa39d', marginBottom: 2 }}>Total due</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#a83b3b' }}>
                  ${Number(selectedInvoice.total_amount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amount + Method */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={L}>Amount (USD)</label>
            <input
              type="number"
              value={form.amount}
              onChange={handleChange('amount')}
              placeholder="165.50"
              step="0.01"
              min="0"
              style={I(errors.amount)}
            />
            {errors.amount && <p style={E}>{errors.amount}</p>}
          </div>
          <div>
            <label style={L}>Method</label>
            <select value={form.method} onChange={handleChange('method')} style={I()}>
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Reference */}
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Reference (optional)</label>
          <input
            type="text"
            value={form.reference}
            onChange={handleChange('reference')}
            placeholder="TXN-12345 or check #"
            style={I()}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={L}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Installment, insurance info, etc."
            rows={2}
            style={{ ...I(), resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {errors.submit && <p style={E}>{errors.submit}</p>}
      </form>
    </Modal>
  );
}