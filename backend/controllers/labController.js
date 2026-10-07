import db from '../config/database.js';

export const listRequisitions = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, a.name AS animal_name, a.species,
             o.full_name AS owner_name, u.full_name AS vet_name
      FROM lab_requisitions r
      LEFT JOIN animals a ON a.animal_id = r.animal_id
      LEFT JOIN owners  o ON o.owner_id  = a.owner_id
      LEFT JOIN users   u ON u.user_id   = r.ordered_by
      ORDER BY r.received_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listRequisitions:', err.message);
    res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

export const getRequisition = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM lab_requisitions WHERE requisition_id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    const [findings] = await db.query(
      'SELECT * FROM lab_findings WHERE requisition_id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], findings } });
  } catch (err) { next(err); }
};

export const createRequisition = async (req, res, next) => {
  try {
    const { animal_id, consultation_id, test_type, priority } = req.body;

    if (!animal_id || !test_type) {
      return res.status(400).json({ success: false, message: 'animal_id and test_type required' });
    }

    const [maxRow] = await db.query(
      `SELECT requisition_id FROM lab_requisitions
       WHERE requisition_id LIKE 'LAB-%'
       ORDER BY CAST(SUBSTRING(requisition_id, 5) AS UNSIGNED) DESC LIMIT 1`
    );
    let nextNum = 1;
    if (maxRow.length) {
      const last = parseInt(maxRow[0].requisition_id.replace('LAB-', ''), 10);
      if (!isNaN(last)) nextNum = last + 1;
    }
    const reqId = `LAB-${String(nextNum).padStart(4, '0')}`;

    await db.query(
      `INSERT INTO lab_requisitions
        (requisition_id, animal_id, consultation_id, ordered_by, test_type, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Received')`,
      [reqId, animal_id, consultation_id || null, req.user?.id || null, test_type, priority || 'Normal']
    );

    const [rows] = await db.query('SELECT * FROM lab_requisitions WHERE requisition_id = ?', [reqId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createRequisition:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRequisition = async (req, res, next) => {
  try {
    const allowed = ['status', 'priority', 'is_abnormal', 'completed_at'];
    const updates = [], values = [];
    for (const f of allowed) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (!updates.length) return res.status(400).json({ success: false, message: 'No fields' });

    values.push(req.params.id);
    await db.query(`UPDATE lab_requisitions SET ${updates.join(', ')} WHERE requisition_id = ?`, values);
    const [rows] = await db.query('SELECT * FROM lab_requisitions WHERE requisition_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

export const listFindings = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM lab_findings ORDER BY finding_id DESC');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const createFinding = async (req, res, next) => {
  try {
    const { requisition_id, organism_or_parameter, result_value, reference_range, microscopy_findings } = req.body;
    if (!requisition_id) return res.status(400).json({ success: false, message: 'requisition_id required' });

    const [result] = await db.query(
      `INSERT INTO lab_findings
        (requisition_id, organism_or_parameter, result_value, reference_range, microscopy_findings)
       VALUES (?, ?, ?, ?, ?)`,
      [requisition_id, organism_or_parameter || null, result_value || null, reference_range || null, microscopy_findings || null]
    );

    const [rows] = await db.query('SELECT * FROM lab_findings WHERE finding_id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};