import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

/* ============================================================
   ROLE MAPPINGS
   Frontend sends short keys  →  MySQL expects enum strings
============================================================ */
const SHORT_TO_ENUM = {
  admin:        'System administrator',
  veterinarian: 'Veterinarian',
  lab:          'Lab technician',
  receptionist: 'Receptionist',
  pharmacist:   'Pharmacist',
  owner:        'Pet owner',
};

const ENUM_TO_SHORT = {
  'System administrator': 'admin',
  'Veterinarian':         'veterinarian',
  'Lab technician':       'lab',
  'Inventory manager':    'pharmacist',   // fallback alias
  'Receptionist':         'receptionist',
  'Pharmacist':           'pharmacist',
  'Pet owner':            'owner',
};

const toEnumRole  = (r) => SHORT_TO_ENUM[r] || r;
const toShortRole = (r) => ENUM_TO_SHORT[r] || r;

/* ============================================================
   SHARED RESPONSE BUILDER
   Returns the shape the frontend expects:
     { id, name, email, role, ... }
============================================================ */
const buildUserPayload = (u) => ({
  id:        u.user_id,
  user_id:   u.user_id,
  name:      u.full_name,
  full_name: u.full_name,
  email:     u.email,
  role:      toShortRole(u.role),
  branch_id: u.branch_id ?? null,
});

const signToken = (u) =>
  jwt.sign(
    { id: u.user_id, role: toShortRole(u.role) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

/* ============================================================
   REGISTER
============================================================ */
export const register = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty',
      });
    }

    /* Accept both naming conventions from the frontend */
    const full_name   = req.body.full_name || req.body.name;
    const { email, password } = req.body;
    const roleKey     = req.body.role;                     // short key from UI
    const branch_id   = req.body.branch_id ?? null;
    const branchName  = req.body.branch;                   // optional string

    /* Validation */
    if (!full_name || !email || !password || !roleKey) {
      return res.status(400).json({
        success: false,
        message: 'full_name, email, password and role are required',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    /* Email already registered? */
    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    /* Resolve branch_id — accept number or resolve by name */
    let validBranchId = null;
    if (branch_id) {
      const [b] = await db.query(
        'SELECT branch_id FROM clinic_branches WHERE branch_id = ?',
        [branch_id]
      );
      if (b.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Branch ID ${branch_id} does not exist`,
        });
      }
      validBranchId = b[0].branch_id;
    } else if (branchName) {
      const [b] = await db.query(
        'SELECT branch_id FROM clinic_branches WHERE branch_name = ? LIMIT 1',
        [branchName]
      );
      if (b.length > 0) validBranchId = b[0].branch_id;
    }

    /* Map role to enum value stored in MySQL */
    const enumRole = toEnumRole(roleKey);

    /* Hash password */
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    /* Insert */
    const [result] = await db.query(
      `INSERT INTO users (branch_id, full_name, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, 'Active')`,
      [validBranchId, full_name, email, password_hash, enumRole]
    );

    /* Build response with token so frontend can auto-login */
    const created = {
      user_id:   result.insertId,
      full_name,
      email,
      role:      enumRole,
      branch_id: validBranchId,
    };

    res.status(201).json({
      success: true,
      message: 'User account registered successfully',
      token:   signToken(created),
      user:    buildUserPayload(created),
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const login = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Request body is missing' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const [rows] = await db.query(
      `SELECT user_id, branch_id, full_name, email, password_hash, role, status
       FROM users WHERE LOWER(email) = LOWER(?)`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Contact administrator.',
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token:   signToken(user),
      user:    buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET PROFILE (used by /auth/me or /auth/profile)
============================================================ */
export const getProfile = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, branch_id, full_name, email, role, status
       FROM users WHERE user_id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: buildUserPayload(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};