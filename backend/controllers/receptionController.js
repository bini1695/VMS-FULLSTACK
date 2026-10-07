import db from '../config/database.js';

// 1. ONE-STEP INTAKE: REGISTER OWNER + PET (TRANSACTION)
export const registerOwnerAndPet = async (req, res, next) => {
  let connection;
  let transactionStarted = false;
  try {
    const { owner_name, phone, email, address, pet_name, species, breed, age, gender } = req.body;
    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [ownerResult] = await connection.query(
      `INSERT INTO owners (full_name, phone, email, address) VALUES (?, ?, ?, ?)`,
      [owner_name, phone, email || null, address || null]
    );

    const owner_id = ownerResult.insertId;
    let dateOfBirth = null;
    if (age !== undefined) {
      dateOfBirth = new Date();
      dateOfBirth.setUTCFullYear(dateOfBirth.getUTCFullYear() - age);
      dateOfBirth = dateOfBirth.toISOString().slice(0, 10);
    }

    const [petResult] = await connection.query(
      `INSERT INTO animals (owner_id, name, species, breed, date_of_birth, gender)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [owner_id, pet_name, species, breed || null, dateOfBirth, gender || 'Male']
    );

    await connection.commit();
    transactionStarted = false;

    res.status(201).json({
      success: true,
      message: 'Owner and pet registered successfully',
      owner_id,
      patient_id: petResult.insertId,
    });
  } catch (error) {
    if (transactionStarted) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// 2. CHECK IN AN APPOINTMENT
export const checkInPatient = async (req, res, next) => {
  try {
    const { appointment_id } = req.body;
    const isAdmin = req.user?.role === 'System administrator';
    if (!isAdmin && !req.user?.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Your account must be assigned to a clinic branch to check in appointments.',
      });
    }
    const branchCondition = isAdmin ? '' : ' AND branch_id = ?';
    const params = isAdmin ? [appointment_id] : [appointment_id, req.user.branch_id];
    const [result] = await db.query(
      `UPDATE appointments SET status = 'Checked in' WHERE appointment_id = ?${branchCondition}`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Appointment ${appointment_id} not found.` });
    }

    res.status(201).json({
      success: true,
      message: 'Patient checked in successfully',
      appointment_id,
      status: 'Checked in',
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET DAILY RECEPTION QUEUE
export const getDailyQueue = async (req, res, next) => {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const targetDate = req.query.date || today;
    const isAdmin = req.user?.role === 'System administrator';
    if (!isAdmin && !req.user?.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Your account must be assigned to a clinic branch to view the appointment queue.',
      });
    }
    const branchCondition = isAdmin ? '' : ' AND a.branch_id = ?';
    const params = isAdmin ? [targetDate] : [targetDate, req.user.branch_id];

    const [queue] = await db.query(
      `SELECT 
        a.appointment_id, a.appointment_date, a.reason_for_visit, a.status, a.vet_id,
        p.animal_id AS patient_id, p.name AS pet_name, p.species, p.breed,
        o.full_name AS owner_name, o.phone AS owner_phone,
        u.full_name AS vet_name
       FROM appointments a
       JOIN animals p ON a.animal_id = p.animal_id
       JOIN owners o ON p.owner_id = o.owner_id
       LEFT JOIN users u ON a.vet_id = u.user_id
       WHERE DATE(a.appointment_date) = ?${branchCondition}
       ORDER BY a.appointment_date ASC`,
      params
    );

    res.status(200).json({
      success: true,
      count: queue.length,
      date: targetDate,
      queue,
    });
  } catch (error) {
    next(error);
  }
};

// 4. UPDATE APPOINTMENT STATUS
export const updateQueueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isAdmin = req.user?.role === 'System administrator';
    if (!isAdmin && !req.user?.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Your account must be assigned to a clinic branch to update appointments.',
      });
    }
    const branchCondition = isAdmin ? '' : ' AND branch_id = ?';
    const params = isAdmin ? [status, id] : [status, id, req.user.branch_id];

    const [result] = await db.query(
      `UPDATE appointments SET status = ? WHERE appointment_id = ?${branchCondition}`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Appointment ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}'`,
    });
  } catch (error) {
    next(error);
  }
};