import db from '../config/database.js';

/* ============================================================
   LIST ALL FOLLOW-UPS (with animal + owner + vet)
============================================================ */
export const listFollowUps = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT
        f.follow_up_id,
        f.animal_id,
        f.vet_id,
        f.reason,
        f.due_date,
        f.priority,
        f.status,
        f.notes,
        f.created_at,
        a.name      AS animal_name,
        a.species   AS species,
        o.full_name AS owner_name,
        v.full_name AS vet_name
      FROM follow_ups f
      LEFT JOIN animals a ON a.animal_id = f.animal_id
      LEFT JOIN owners  o ON o.owner_id  = a.owner_id
      LEFT JOIN users   v ON v.user_id   = f.vet_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ' AND f.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY f.due_date ASC, f.follow_up_id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listFollowUps:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ONE
============================================================ */
export const getFollowUp = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM follow_ups WHERE follow_up_id = ?',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ getFollowUp:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CREATE
   Body: { animal_id, reason, due_date, priority, notes }
============================================================ */
export const createFollowUp = async (req, res) => {
  try {
    const { animal_id, reason, due_date, priority, notes, vet_id } = req.body;

    if (!animal_id || !reason || !due_date) {
      return res.status(400).json({
        success: false,
        message: 'animal_id, reason and due_date are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO follow_ups
        (animal_id, vet_id, reason, due_date, priority, status, notes)
       VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        animal_id,
        vet_id || req.user?.id || null,
        reason,
        due_date,
        priority || 'Routine',
        notes || null,
      ]
    );

    const [rows] = await db.query(
      `SELECT f.*, a.name AS animal_name, o.full_name AS owner_name
       FROM follow_ups f
       LEFT JOIN animals a ON a.animal_id = f.animal_id
       LEFT JOIN owners  o ON o.owner_id  = a.owner_id
       WHERE f.follow_up_id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createFollowUp:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE
============================================================ */
export const updateFollowUp = async (req, res) => {
  try {
    const allowed = ['reason', 'due_date', 'priority', 'status', 'notes', 'vet_id'];
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
      `UPDATE follow_ups SET ${updates.join(', ')} WHERE follow_up_id = ?`,
      values
    );

    const [rows] = await db.query(
      'SELECT * FROM follow_ups WHERE follow_up_id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ updateFollowUp:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   DELETE
============================================================ */
export const deleteFollowUp = async (req, res) => {
  try {
    await db.query('DELETE FROM follow_ups WHERE follow_up_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('❌ deleteFollowUp:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};