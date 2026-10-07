import db from '../config/database.js';

export const listInventory = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory_items ORDER BY item_id');
    console.log('🟢 Inventory:', rows.length, 'rows');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ Inventory:', err.message);
    res.status(500).json({ success: false, message: err.message, data: [] });
  }
};