export const ROLES = [
  { key: 'admin',        label: 'System administrator',  short: 'Administrator', icon: 'fa-user-shield'  },
  { key: 'veterinarian', label: 'Veterinarian',          short: 'Veterinarian',  icon: 'fa-user-doctor'  },
  { key: 'lab',          label: 'Laboratory technician', short: 'Lab technician', icon: 'fa-flask-vial'  },
  { key: 'receptionist', label: 'Receptionist',          short: 'Receptionist',  icon: 'fa-headset'      },
  { key: 'pharmacist',   label: 'Pharmacist',            short: 'Pharmacist',    icon: 'fa-pills'        },
  { key: 'owner',        label: 'Pet owner',             short: 'Pet owner',     icon: 'fa-paw'          },
];

export const DASHBOARD_BY_ROLE = {
  admin:        '/admin',
  veterinarian: '/vet',
  lab:          '/lab',
  receptionist: '/front-desk',
  pharmacist:   '/pharmacy',
  owner:        '/owner',
};

const ROLE_ALIASES = {
  'system administrator': 'admin',
  administrator: 'admin',
  'laboratory technician': 'lab',
  'lab technician': 'lab',
  'pet owner': 'owner',
};

export const normalizeRole = (role) => {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toLowerCase();
  if (!normalized) return null;
  return ROLE_ALIASES[normalized] || (DASHBOARD_BY_ROLE[normalized] ? normalized : null);
};

export const BRANCHES = ['Riverside', 'Central', 'Westfield'];

export const ROLE_LABEL = Object.fromEntries(
  ROLES.map((r) => [r.key, r.label])
);