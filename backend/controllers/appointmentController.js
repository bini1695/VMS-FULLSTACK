import db from '../config/database.js';

/* ============================================================
   LIST ALL APPOINTMENTS
   JOINs animals + owners + users to build a complete view
============================================================ */
export const listAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT
        a.appointment_id,
        a.branch_id,
        a.animal_id,
        a.vet_id,
        a.appointment_date,
        a.reason_for_visit,
        a.status,
        a.wait_time_minutes,
        a.created_at,

        an.name        AS animal_name,
        an.species     AS species,
        an.breed       AS breed,
        o.full_name    AS owner_name,
        o.phone        AS owner_phone,
        v.full_name    AS vet_name
      FROM appointments a
      LEFT JOIN animals   an ON an.animal_id = a.animal_id
      LEFT JOIN owners    o  ON o.owner_id   = an.owner_id
      LEFT JOIN users     v  ON v.user_id    = a.vet_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listAppointments:', err.message);
    next(err);
  }
};

/* ============================================================
   GET ONE
============================================================ */
export const getAppointment = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, an.name AS animal_name, o.full_name AS owner_name
       FROM appointments a
       LEFT JOIN animals an ON an.animal_id = a.animal_id
       LEFT JOIN owners  o  ON o.owner_id   = an.owner_id
       WHERE a.appointment_id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   CREATE
   Body must send: animal_id, branch_id, vet_id (optional),
                   appointment_date, reason_for_visit
============================================================ */
export const createAppointment = async (req, res, next) => {
  try {
    const {
      animal_id,
      branch_id,
      vet_id,
      appointment_date,
      reason_for_visit,
    } = req.body;

    if (!animal_id || !branch_id || !appointment_date || !reason_for_visit) {
      return res.status(400).json({
        success: false,
        message: 'animal_id, branch_id, appointment_date and reason_for_visit are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO appointments
         (branch_id, animal_id, vet_id, appointment_date, reason_for_visit, status, wait_time_minutes)
       VALUES (?, ?, ?, ?, ?, 'Scheduled', 0)`,
      [
        branch_id,
        animal_id,
        vet_id || null,
        appointment_date,
        reason_for_visit,
      ]
    );

    const [rows] = await db.query(
      `SELECT a.*, an.name AS animal_name, o.full_name AS owner_name
       FROM appointments a
       LEFT JOIN animals an ON an.animal_id = a.animal_id
       LEFT JOIN owners  o  ON o.owner_id   = an.owner_id
       WHERE a.appointment_id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createAppointment:', err.message);
    next(err);
  }
};

/* ============================================================
   UPDATE
============================================================ */
export const updateAppointment = async (req, res, next) => {
  try {
    const map = {
      animal_id:        'animal_id',
      branch_id:        'branch_id',
      vet_id:           'vet_id',
      appointment_date: 'appointment_date',
      reason_for_visit: 'reason_for_visit',
      status:           'status',
      wait_time_minutes:'wait_time_minutes',
    };

    const updates = [];
    const values = [];

    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        updates.push(`${column} = ?`);
        values.push(req.body[key]);
      }
    }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await db.query(
      `UPDATE appointments SET ${updates.join(', ')} WHERE appointment_id = ?`,
      values
    );

    const [rows] = await db.query(
      `SELECT a.*, an.name AS animal_name, o.full_name AS owner_name
       FROM appointments a
       LEFT JOIN animals an ON an.animal_id = a.animal_id
       LEFT JOIN owners  o  ON o.owner_id   = an.owner_id
       WHERE a.appointment_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   DELETE
============================================================ */
export const deleteAppointment = async (req, res, next) => {
  try {
    await db.query('DELETE FROM appointments WHERE appointment_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) { next(err); }
};