import db from '../config/database.js';

/* ============================================================
   LIST ALL INVOICES
============================================================ */
export const listInvoices = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT
        i.invoice_id,
        i.owner_id,
        i.appointment_id,
        i.total_amount,
        i.status,
        i.created_at,
        o.full_name AS owner_name,
        o.phone     AS owner_phone,
        an.name     AS animal_name,
        (SELECT COUNT(*) FROM invoice_items WHERE invoice_id = i.invoice_id) AS item_count
      FROM invoices i
      LEFT JOIN owners       o  ON o.owner_id       = i.owner_id
      LEFT JOIN appointments a  ON a.appointment_id = i.appointment_id
      LEFT JOIN animals      an ON an.animal_id     = a.animal_id
      WHERE 1=1
    `;
    const params = [];
    if (status) { sql += ' AND i.status = ?'; params.push(status); }
    sql += ' ORDER BY i.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listInvoices:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ONE INVOICE (with line items)
============================================================ */
export const getInvoice = async (req, res, next) => {
  try {
    const [invoices] = await db.query(
      `SELECT i.*, o.full_name AS owner_name, an.name AS animal_name
       FROM invoices i
       LEFT JOIN owners       o  ON o.owner_id       = i.owner_id
       LEFT JOIN appointments a  ON a.appointment_id = i.appointment_id
       LEFT JOIN animals      an ON an.animal_id     = a.animal_id
       WHERE i.invoice_id = ?`,
      [req.params.id]
    );
    if (!invoices.length) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const [items] = await db.query(
      'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY invoice_item_id',
      [req.params.id]
    );

    res.json({ success: true, data: { ...invoices[0], items } });
  } catch (err) {
    console.error('❌ getInvoice:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CREATE INVOICE + LINE ITEMS
   Body: { owner_id, appointment_id?, items: [{ description, amount }] }
============================================================ */
export const createInvoice = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { owner_id, appointment_id, items } = req.body;

    if (!owner_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'owner_id and items[] are required',
      });
    }

    const total = items.reduce((s, it) => s + Number(it.amount), 0);

    /* Auto-generate INV-0001, INV-0002, ... */
    const [maxRow] = await conn.query(
      `SELECT invoice_id FROM invoices
       WHERE invoice_id LIKE 'INV-%'
       ORDER BY CAST(SUBSTRING(invoice_id, 5) AS UNSIGNED) DESC
       LIMIT 1`
    );
    let nextNum = 1;
    if (maxRow.length) {
      const last = parseInt(maxRow[0].invoice_id.replace('INV-', ''), 10);
      if (!isNaN(last)) nextNum = last + 1;
    }
    const invoiceId = `INV-${String(nextNum).padStart(4, '0')}`;

    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO invoices (invoice_id, owner_id, appointment_id, total_amount, status)
       VALUES (?, ?, ?, ?, 'Unpaid')`,
      [invoiceId, owner_id, appointment_id || null, total]
    );

    for (const it of items) {
      await conn.query(
        `INSERT INTO invoice_items (invoice_id, description, amount)
         VALUES (?, ?, ?)`,
        [invoiceId, it.description, Number(it.amount)]
      );
    }

    await conn.commit();

    const [rows] = await conn.query(
      `SELECT i.*, o.full_name AS owner_name
       FROM invoices i
       LEFT JOIN owners o ON o.owner_id = i.owner_id
       WHERE i.invoice_id = ?`,
      [invoiceId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    await conn.rollback();
    console.error('❌ createInvoice:', err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

/* ============================================================
   UPDATE INVOICE
============================================================ */
export const updateInvoice = async (req, res, next) => {
  try {
    const allowed = ['status', 'total_amount', 'owner_id', 'appointment_id'];
    const updates = [], values = [];
    for (const f of allowed) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await db.query(
      `UPDATE invoices SET ${updates.join(', ')} WHERE invoice_id = ?`,
      values
    );

    const [rows] = await db.query('SELECT * FROM invoices WHERE invoice_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ updateInvoice:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   DELETE INVOICE + ITEMS
============================================================ */
export const deleteInvoice = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
    await conn.query('DELETE FROM invoices WHERE invoice_id = ?', [req.params.id]);
    await conn.commit();
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) {
    await conn.rollback();
    console.error('❌ deleteInvoice:', err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};