import db from '../config/database.js';

export const listConsultations = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, a.name AS animal_name, a.species,
             o.full_name AS owner_name, v.full_name AS vet_name
      FROM consultations c
      LEFT JOIN animals a ON a.animal_id = c.animal_id
      LEFT JOIN owners  o ON o.owner_id  = a.owner_id
      LEFT JOIN users   v ON v.user_id   = c.vet_id
      ORDER BY c.consultation_date DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listConsultations:', err.message);
    res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

export const getConsultation = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM consultations WHERE consultation_id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

export const createConsultation = async (req, res, next) => {
  try {
    const {
      appointment_id, animal_id, vet_id,
      temperature_c, heart_rate_bpm, respiration_rpm, body_condition_score,
      subjective_notes, objective_notes, assessment_notes,
    } = req.body;

    if (!appointment_id || !animal_id) {
      return res.status(400).json({ success: false, message: 'appointment_id and animal_id required' });
    }

    const [result] = await db.query(
      `INSERT INTO consultations
        (appointment_id, animal_id, vet_id, temperature_c, heart_rate_bpm,
         respiration_rpm, body_condition_score, subjective_notes, objective_notes, assessment_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment_id, animal_id, vet_id || req.user?.id || null,
        temperature_c || null, heart_rate_bpm || null, respiration_rpm || null,
        body_condition_score || null,
        subjective_notes || null, objective_notes || null, assessment_notes || null,
      ]
    );

    const [rows] = await db.query('SELECT * FROM consultations WHERE consultation_id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createConsultation:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateConsultation = async (req, res, next) => {
  try {
    const allowed = ['temperature_c', 'heart_rate_bpm', 'respiration_rpm', 'body_condition_score',
                     'subjective_notes', 'objective_notes', 'assessment_notes'];
    const updates = [], values = [];
    for (const f of allowed) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (!updates.length) return res.status(400).json({ success: false, message: 'No fields' });

    values.push(req.params.id);
    await db.query(`UPDATE consultations SET ${updates.join(', ')} WHERE consultation_id = ?`, values);
    const [rows] = await db.query('SELECT * FROM consultations WHERE consultation_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};