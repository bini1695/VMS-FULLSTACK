import db from '../config/database.js';

function ageToDateOfBirth(age) {
  const dateOfBirth = new Date();
  dateOfBirth.setUTCFullYear(dateOfBirth.getUTCFullYear() - age);
  return dateOfBirth.toISOString().slice(0, 10);
}

// REGISTER PET OWNER
export const createOwner = async (req, res, next) => {
  try {
    const { full_name, phone, email, address } = req.body;

    const [result] = await db.query(
      `INSERT INTO owners (full_name, phone, email, address) VALUES (?, ?, ?, ?)`,
      [full_name, phone, email || null, address || null]
    );

    res.status(201).json({
      success: true,
      message: 'Pet owner registered successfully',
      owner: {
        owner_id: result.insertId,
        full_name,
        phone,
        email: email || null,
        address: address || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET PET OWNERS
export const getOwners = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = 'SELECT owner_id, full_name, phone, email, address FROM owners';
    const params = [];

    if (search) {
      query += ' WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY owner_id DESC';
    const [owners] = await db.query(query, params);

    res.status(200).json({ success: true, count: owners.length, owners });
  } catch (error) {
    next(error);
  }
};

// REGISTER PATIENT (PET)
export const createPatient = async (req, res, next) => {
  try {
    const {
      owner_id,
      pet_name,
      species,
      breed,
      age,
      date_of_birth,
      gender,
      weight_kg,
      microchip_number,
    } = req.body;

    // Check if owner exists
    const [owners] = await db.query('SELECT owner_id FROM owners WHERE owner_id = ?', [owner_id]);
    if (owners.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Owner ID ${owner_id} does not exist.` 
      });
    }

    const dateOfBirth = date_of_birth || (age !== undefined ? ageToDateOfBirth(age) : null);

    const [result] = await db.query(
      `INSERT INTO animals (owner_id, name, species, breed, gender, date_of_birth, weight_kg, microchip_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        owner_id,
        pet_name,
        species,
        breed || null,
        gender,
        dateOfBirth,
        weight_kg ?? null,
        microchip_number || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: {
        patient_id: result.insertId,
        owner_id,
        pet_name,
        species,
        breed: breed || null,
        age: age ?? null,
        date_of_birth: dateOfBirth,
        gender,
        weight_kg: weight_kg ?? null,
        microchip_number: microchip_number || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PATIENTS WITH OWNER DETAILS (SEARCH & LIST)
export const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT 
        p.animal_id AS patient_id, p.pet_name, p.species, p.breed,
        TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) AS age,
        p.date_of_birth, p.gender, p.weight_kg, p.microchip_number,
        o.owner_id, o.full_name AS owner_name, o.phone AS owner_phone
      FROM (
        SELECT animal_id, owner_id, name AS pet_name, species, breed, gender,
               date_of_birth, weight_kg, microchip_number
        FROM animals
      ) p
      JOIN owners o ON p.owner_id = o.owner_id
    `;
    const queryParams = [];

    if (search) {
      query += ` WHERE p.pet_name LIKE ? OR o.full_name LIKE ? OR o.phone LIKE ? OR p.microchip_number LIKE ?`;
      const term = `%${search}%`;
      queryParams.push(term, term, term, term);
    }

    query += ` ORDER BY p.animal_id DESC`;

    const [patients] = await db.query(query, queryParams);

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PATIENT BY ID WITH FULL HISTORY
export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [patients] = await db.query(
      `SELECT p.animal_id AS patient_id, p.owner_id, p.name AS pet_name, p.species,
              p.breed, TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) AS age,
              p.date_of_birth, p.gender, p.weight_kg, p.microchip_number,
              o.full_name AS owner_name, o.phone AS owner_phone, o.email AS owner_email 
       FROM animals p
       JOIN owners o ON p.owner_id = o.owner_id
       WHERE p.animal_id = ?`,
      [id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Fetch patient appointments
    const [appointments] = await db.query(
      `SELECT appointment_id, appointment_date, reason_for_visit, status
       FROM appointments WHERE animal_id = ? ORDER BY appointment_date DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      patient: patients[0],
      history: {
        appointments,
      },
    });
  } catch (error) {
    next(error);
  }
};