import db from '../config/database.js';

/* ============================================================
   LIST ALL OWNERS (with their animal count)
============================================================ */
export const listOwners = async (req, res, next) => {
  try {
    const { q } = req.query;
    let sql = `
      SELECT
        o.owner_id,
        o.full_name,
        o.phone,
        o.email,
        o.address,
        o.created_at,
        COUNT(a.animal_id) AS animal_count
      FROM owners o
      LEFT JOIN animals a ON a.owner_id = o.owner_id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ' AND (o.full_name LIKE ? OR o.phone LIKE ? OR o.email LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    sql += ' GROUP BY o.owner_id ORDER BY o.owner_id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listOwners:', err.message);
    next(err);
  }
};

/* ============================================================
   GET ONE OWNER (with their animals)
============================================================ */
export const getOwner = async (req, res, next) => {
  try {
    const [owners] = await db.query(
      'SELECT * FROM owners WHERE owner_id = ?',
      [req.params.id]
    );
    if (!owners.length) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    const [animals] = await db.query(
      'SELECT * FROM animals WHERE owner_id = ?',
      [req.params.id]
    );

    res.json({ success: true, data: { ...owners[0], animals } });
  } catch (err) { next(err); }
};

/* ============================================================
   CREATE
============================================================ */
export const createOwner = async (req, res, next) => {
  try {
    const { full_name, phone, email, address } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'full_name and phone are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO owners (full_name, phone, email, address)
       VALUES (?, ?, ?, ?)`,
      [full_name, phone, email || null, address || null]
    );

    const [rows] = await db.query(
      'SELECT * FROM owners WHERE owner_id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createOwner:', err.message);
    next(err);
  }
};

/* ============================================================
   UPDATE
============================================================ */
export const updateOwner = async (req, res, next) => {
  try {
    const allowed = ['full_name', 'phone', 'email', 'address'];
    const updates = [];
    const values = [];

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }
    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await db.query(
      `UPDATE owners SET ${updates.join(', ')} WHERE owner_id = ?`,
      values
    );

    const [rows] = await db.query('SELECT * FROM owners WHERE owner_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   DELETE
============================================================ */
export const deleteOwner = async (req, res, next) => {
  try {
    await db.query('DELETE FROM owners WHERE owner_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Owner deleted' });
  } catch (err) { next(err); }
};