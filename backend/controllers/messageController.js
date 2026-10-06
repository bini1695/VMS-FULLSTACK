import db from '../config/database.js';

/* ============================================================
   LIST ALL MESSAGES (with sender info)
============================================================ */
export const listMessages = async (req, res, next) => {
  try {
    const { channel, unread } = req.query;

    let sql = `
      SELECT
        m.message_id,
        m.sender_id,
        m.recipient_id,
        m.recipient_contact,
        m.channel,
        m.subject,
        m.body,
        m.status,
        m.is_read,
        m.scheduled_at,
        m.created_at,
        u.full_name AS sender_name
      FROM messages m
      LEFT JOIN users u ON u.user_id = m.sender_id
      WHERE 1=1
    `;
    const params = [];

    if (channel)        { sql += ' AND m.channel = ?';  params.push(channel); }
    if (unread === '1') { sql += ' AND m.is_read = 0'; }

    sql += ' ORDER BY m.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ listMessages:', err.message);
    next(err);
  }
};

/* ============================================================
   GET ONE
============================================================ */
export const getMessage = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, u.full_name AS sender_name
       FROM messages m
       LEFT JOIN users u ON u.user_id = m.sender_id
       WHERE m.message_id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/* ============================================================
   CREATE MESSAGE
   Body: { recipient_id?, recipient_contact?, channel, subject?, body, scheduled_at? }
============================================================ */
export const createMessage = async (req, res, next) => {
  try {
    const {
      recipient_id,
      recipient_contact,
      channel,
      subject,
      body,
      scheduled_at,
    } = req.body;

    if (!channel || !body) {
      return res.status(400).json({
        success: false,
        message: 'channel and body are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO messages
         (sender_id, recipient_id, recipient_contact, channel, subject, body, status, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user?.id || null,
        recipient_id || null,
        recipient_contact || null,
        channel,
        subject || null,
        body,
        scheduled_at ? 'Scheduled' : 'Sent',
        scheduled_at || null,
      ]
    );

    const [rows] = await db.query(
      `SELECT m.*, u.full_name AS sender_name
       FROM messages m
       LEFT JOIN users u ON u.user_id = m.sender_id
       WHERE m.message_id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('❌ createMessage:', err.message);
    next(err);
  }
};

/* ============================================================
   MARK AS READ
============================================================ */
export const markRead = async (req, res, next) => {
  try {
    await db.query(
      'UPDATE messages SET is_read = 1 WHERE message_id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) { next(err); }
};

/* ============================================================
   DELETE
============================================================ */
export const deleteMessage = async (req, res, next) => {
  try {
    await db.query('DELETE FROM messages WHERE message_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};