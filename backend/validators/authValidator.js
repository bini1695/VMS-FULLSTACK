import Joi from 'joi';

/* ---------- REGISTER SCHEMA ----------
   Accepts the frontend payload shape:
     { name, email, phone, branch, branch_id, password, role }
   And the DB-friendly shape:
     { full_name, email, password, role }
------------------------------------------------ */
export const registerSchema = Joi.object({
  // Accept name OR full_name (at least one required)
  name:      Joi.string().trim().min(3).max(100),
  full_name: Joi.string().trim().min(3).max(100),

  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().min(6).max(128).required(),

  // Optional fields sent by the frontend
  phone:     Joi.string().allow('', null),
  branch:    Joi.string().allow('', null),      // string like "Riverside"
  branch_id: Joi.number().integer().allow(null),

  // Role: accept short keys AND enum strings
  role: Joi.string().valid(
    // short keys
    'admin', 'veterinarian', 'lab', 'receptionist', 'pharmacist', 'owner',
    // enum strings
    'System administrator', 'Veterinarian', 'Lab technician',
    'Receptionist', 'Pharmacist', 'Inventory manager', 'Pet owner',
  ).required(),
})
  .or('name', 'full_name')        // require at least one
  .unknown(true);                  // silently accept any extra keys

/* ---------- LOGIN SCHEMA ---------- */
export const loginSchema = Joi.object({
  email:    Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
}).unknown(true);