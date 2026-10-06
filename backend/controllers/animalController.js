import db from '../config/database.js';

/* ============================================================
   LIST ALL ANIMALS (with owner info)
============================================================ */
export const listAnimals = async (req, res, next) => {
  try {
    const { q, owner_id } = req.query;

    let sql = `
      SELECT
        a.animal_id,
        a.owner_id,
        a.name,
        a.species,
        a.breed,
        a.gender,
        a.date_of_birth,
        a.weight_kg,
        a.microchip_number,
        a.microchip_verified,
        a.created_at,
        o.full_name AS owner_name,
        o.phone     AS owner_phone
      FROM animals a
      LEFT JOIN owners o ON o.owner_id = a.owner_id
      WHERE 1=1
    `;
    const params = [];

    if (owner_id) {
      sql += ' AND a.owner_id = ?';
      params.push(owner_id);
    }
    if (q) {
      sql += ' AND (a.name LIKE ? OR a.breed LIKE ? OR a.species LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    sql += ' ORDER BY a.animal_id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listAnimals:', err.message);
    next(err);
  }
};

/* ============================================================
   GET ONE ANIMAL
============================================================ */
export const getAnimal = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, o.full_name AS owner_name, o.phone AS owner_phone
       FROM animals a
       LEFT JOIN owners o ON o.owner_id = a.owner_id
       WHERE a.animal_id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   CREATE ANIMAL
   Body: { owner_id, name, species, breed, gender,
           date_of_birth, weight_kg, microchip_number }
============================================================ */
export const createAnimal = async (req, res, next) => {
  try {
    const {
      owner_id,
      name,
      species,
      breed,
      gender,
      date_of_birth,
      weight_kg,
      microchip_number,
    } = req.body;

    if (!owner_id || !name || !species) {
      return res.status(400).json({
        success: false,
        message: 'owner_id, name and species are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO animals
         (owner_id, name, species, breed, gender, date_of_birth,
          weight_kg, microchip_number, microchip_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        owner_id,
        name,
        species,
        breed || null,
        gender || 'Male',
        date_of_birth || null,
        weight_kg || null,
        microchip_number || null,
      ]
    );

    const [rows] = await db.query(
      `SELECT a.*, o.full_name AS owner_name
       FROM animals a
       LEFT JOIN owners o ON o.owner_id = a.owner_id
       WHERE a.animal_id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createAnimal:', err.message);
    next(err);
  }
};

/* ============================================================
   UPDATE ANIMAL
============================================================ */
export const updateAnimal = async (req, res, next) => {
  try {
    const allowed = [
      'owner_id', 'name', 'species', 'breed', 'gender',
      'date_of_birth', 'weight_kg', 'microchip_number', 'microchip_verified',
    ];

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
      `UPDATE animals SET ${updates.join(', ')} WHERE animal_id = ?`,
      values
    );

    const [rows] = await db.query(
      `SELECT a.*, o.full_name AS owner_name
       FROM animals a
       LEFT JOIN owners o ON o.owner_id = a.owner_id
       WHERE a.animal_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   DELETE ANIMAL
============================================================ */
export const deleteAnimal = async (req, res, next) => {
  try {
    await db.query('DELETE FROM animals WHERE animal_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Animal deleted' });
  } catch (err) { next(err); }
};