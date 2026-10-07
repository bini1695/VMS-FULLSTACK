import db from '../config/database.js';

// GET ALL INVENTORY ITEMS (Optionally filter low stock)
export const getInventory = async (req, res, next) => {
  try {
    const { low_stock } = req.query;

    let query = 'SELECT * FROM inventory_items';
    if (low_stock === 'true') {
      query += ' WHERE quantity_in_stock <= reorder_level';
    }
    query += ' ORDER BY item_name ASC';

    const [items] = await db.query(query);

    res.status(200).json({
      success: true,
      count: items.length,
      inventory: items,
    });
  } catch (error) {
    next(error);
  }
};

// ADD NEW INVENTORY ITEM
export const addInventoryItem = async (req, res, next) => {
  try {
    const { item_name, category, unit_of_measure, quantity_in_stock, reorder_level, unit_price } = req.body;

    const [result] = await db.query(
      `INSERT INTO inventory_items (item_name, category, unit_of_measure, quantity_in_stock, reorder_level, unit_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item_name,
        category || 'Medication',
        unit_of_measure || 'tablets',
        quantity_in_stock,
        reorder_level || 10,
        unit_price,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      item_id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE PRESCRIPTION (Veterinarian)
export const createPrescription = async (req, res, next) => {
  try {
    const { patient_id, vet_id, item_id, dosage, quantity_prescribed } = req.body;

    // Verify Item exists and check stock
    const [items] = await db.query('SELECT quantity_in_stock FROM inventory_items WHERE item_id = ?', [item_id]);
    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    if (items[0].quantity_in_stock < quantity_prescribed) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Current stock is ${items[0].quantity_in_stock}, but ${quantity_prescribed} was requested.`,
      });
    }

    const [result] = await db.query(
      `INSERT INTO prescriptions (patient_id, vet_id, item_id, dosage, quantity_prescribed, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [patient_id, vet_id, item_id, dosage, quantity_prescribed]
    );

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription_id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// DISPENSE MEDICATION (Deducts stock automatically using DB transaction)
export const dispensePrescription = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // 1. Fetch prescription details
    const [prescriptions] = await connection.query(
      'SELECT * FROM prescriptions WHERE prescription_id = ? FOR UPDATE',
      [id]
    );

    if (prescriptions.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    const prescription = prescriptions[0];

    if (prescription.status === 'Dispensed') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Prescription has already been dispensed' });
    }

    // 2. Check stock level
    const [items] = await connection.query(
      'SELECT quantity_in_stock FROM inventory_items WHERE item_id = ? FOR UPDATE',
      [prescription.item_id]
    );

    if (items[0].quantity_in_stock < prescription.quantity_prescribed) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Cannot dispense: Insufficient inventory stock' });
    }

    // 3. Deduct Inventory Stock
    await connection.query(
      'UPDATE inventory_items SET quantity_in_stock = quantity_in_stock - ? WHERE item_id = ?',
      [prescription.quantity_prescribed, prescription.item_id]
    );

    // 4. Update Prescription Status
    await connection.query(
      "UPDATE prescriptions SET status = 'Dispensed' WHERE prescription_id = ?",
      [id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Medication dispensed successfully and inventory stock updated',
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};