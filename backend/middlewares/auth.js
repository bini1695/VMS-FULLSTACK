import jwt from 'jsonwebtoken';

const ROLE_ALIASES = {
  admin: 'system administrator',
  'system administrator': 'system administrator',
  veterinarian: 'veterinarian',
  vet: 'veterinarian',
  lab: 'lab technician',
  'lab technician': 'lab technician',
  receptionist: 'receptionist',
  pharmacist: 'pharmacist',
  'inventory manager': 'pharmacist',
  owner: 'pet owner',
  'pet owner': 'pet owner',
};

const normalizeRole = (role) => {
  if (typeof role !== 'string') return '';
  const normalized = role.trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
};

export function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(/\s+/) || [];

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required',
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: 'Authentication is not configured',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== 'object' || decoded === null || decoded.id === undefined) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
}

export function authorizeRoles(...roles) {
  const allowedRoles = new Set(roles.map(normalizeRole));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication is required',
      });
    }

    if (!allowedRoles.has(normalizeRole(req.user.role))) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
    }

    return next();
  };
}
