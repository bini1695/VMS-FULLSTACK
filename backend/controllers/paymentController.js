import db from '../config/database.js';

export const listPayments = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.payment_id,
        p.invoice_id,
        p.amount,
        p.method,
        p.reference,
        p.notes,
        p.created_at,
        i.total_amount,
        i.status AS invoice_status,
        o.full_name AS owner_name
      FROM payments p
      LEFT JOIN invoices i ON i.invoice_id = p.invoice_id
      LEFT JOIN owners   o ON o.owner_id   = i.owner_id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listPayments:', err.message);
    next(err);
  }
};

export const createPayment = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { invoice_id, amount, method, reference, notes } = req.body;

    if (!invoice_id || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'invoice_id and amount (> 0) are required',
      });
    }

    const [invoices] = await conn.query(
      'SELECT invoice_id, total_amount FROM invoices WHERE invoice_id = ?',
      [invoice_id]
    );
    if (!invoices.length) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO payments (invoice_id, amount, method, reference, notes, received_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        Number(amount),
        method || 'Cash',
        reference || null,
        notes || null,
        req.user?.id || null,
      ]
    );

    const [sumRows] = await conn.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_paid FROM payments WHERE invoice_id = ?',
      [invoice_id]
    );
    const totalPaid = Number(sumRows[0].total_paid);
    const totalDue  = Number(invoices[0].total_amount);

    let newStatus = 'Unpaid';
    if (totalPaid >= totalDue) newStatus = 'Paid';
    else if (totalPaid > 0)    newStatus = 'Partially Paid';

    await conn.query(
      'UPDATE invoices SET status = ? WHERE invoice_id = ?',
      [newStatus, invoice_id]
    );

    await conn.commit();

    const [rows] = await conn.query(
      `SELECT p.*, i.total_amount, i.status AS invoice_status
       FROM payments p
       LEFT JOIN invoices i ON i.invoice_id = p.invoice_id
       WHERE p.payment_id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: rows[0],
      invoice_status: newStatus,
    });
  } catch (err) {
    await conn.rollback();
    console.error('❌ createPayment:', err.message);
    next(err);
  } finally {
    conn.release();
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    await db.query('DELETE FROM payments WHERE payment_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) { next(err); }
};