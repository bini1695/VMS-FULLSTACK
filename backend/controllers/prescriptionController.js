import db from '../config/database.js';

/* ============================================================
   FORM DATA — animals + inventory for the Write modal
============================================================ */
export const getFormData = async (req, res) => {
  try {
    const [animals] = await db.query(`
      SELECT a.*, o.full_name AS owner_name
      FROM animals a
      LEFT JOIN owners o ON o.owner_id = a.owner_id
      ORDER BY a.animal_id DESC
    `);

    const [inventory] = await db.query(
      'SELECT * FROM inventory_items ORDER BY item_id ASC'
    );

    console.log('🟢 form-data:', animals.length, 'animals,', inventory.length, 'items');

    res.json({
      success: true,
      animals,
      inventory,
    });
  } catch (err) {
    console.error('❌ getFormData:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   LIST ALL PRESCRIPTIONS
============================================================ */
export const listPrescriptions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.prescription_id,
        p.animal_id,
        p.consultation_id,
        p.prescribed_by,
        p.item_id,
        p.dosage_instructions,
        p.quantity,
        p.priority,
        p.status,
        p.created_at,
        a.name      AS animal_name,
        a.species   AS species,
        o.full_name AS owner_name,
        v.full_name AS vet_name
      FROM prescriptions p
      LEFT JOIN animals a ON a.animal_id = p.animal_id
      LEFT JOIN owners  o ON o.owner_id  = a.owner_id
      LEFT JOIN users   v ON v.user_id   = p.prescribed_by
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listPrescriptions:', err.message);
    res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

/* ============================================================
   CREATE PRESCRIPTION
   Body: { animal_id, item_id, dosage_instructions, quantity, priority }
============================================================ */
export const createPrescription = async (req, res) => {
  try {
    const { animal_id, consultation_id, item_id, dosage_instructions, quantity, priority } = req.body;

    if (!animal_id || !item_id || !dosage_instructions || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'animal_id, item_id, dosage_instructions and quantity are required',
      });
    }

    /* Generate next RX-0001, RX-0002, ... */
    const [maxRow] = await db.query(
      `SELECT prescription_id FROM prescriptions
       WHERE prescription_id LIKE 'RX-%'
       ORDER BY CAST(SUBSTRING(prescription_id, 4) AS UNSIGNED) DESC LIMIT 1`
    );
    let nextNum = 1;
    if (maxRow.length) {
      const last = parseInt(maxRow[0].prescription_id.replace('RX-', ''), 10);
      if (!isNaN(last)) nextNum = last + 1;
    }
    const rxId = `RX-${String(nextNum).padStart(4, '0')}`;

    await db.query(
      `INSERT INTO prescriptions
        (prescription_id, animal_id, consultation_id, prescribed_by, item_id,
         dosage_instructions, quantity, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Ready to fill')`,
      [
        rxId,
        animal_id,
        consultation_id || null,
        req.user?.id || null,
        item_id,
        dosage_instructions,
        Number(quantity),
        priority || 'Normal',
      ]
    );

    const [rows] = await db.query(
      'SELECT * FROM prescriptions WHERE prescription_id = ?',
      [rxId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createPrescription:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE PRESCRIPTION
============================================================ */
export const updatePrescription = async (req, res) => {
  try {
    const allowed = ['status', 'priority', 'dosage_instructions', 'quantity'];
    const updates = [], values = [];
    for (const f of allowed) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await db.query(
      `UPDATE prescriptions SET ${updates.join(', ')} WHERE prescription_id = ?`,
      values
    );

    const [rows] = await db.query(
      'SELECT * FROM prescriptions WHERE prescription_id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ updatePrescription:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};