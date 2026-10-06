// ============================================
// SYSTEM ADMINISTRATOR — MOCK DATA
// Path: src/data/adminData.js
// ============================================

/* ============================================================
   1. ADMIN OVERVIEW — top stat cards
============================================================ */
export const adminStats = [
  {
    label: 'Active staff accounts',
    value: '48',
    hint: '3 invitations pending',
    icon: 'fa-users',
    tone: 'green',
    hintTone: 'blue',
  },
  {
    label: 'Clinic branches',
    value: '3',
    hint: 'All accepting appointments',
    icon: 'fa-hospital',
    tone: 'blue',
  },
  {
    label: 'Security posture',
    value: '98%',
    hint: 'No critical findings',
    icon: 'fa-shield-halved',
    tone: 'green',
    hintTone: 'green',
  },
  {
    label: 'Last backup',
    value: '02:00',
    hint: 'Completed successfully',
    icon: 'fa-database',
    tone: 'teal',
  },
];

/* ============================================================
   2. TEAM MEMBERS — used on Overview + Users page
============================================================ */
export const teamMembers = [
  {
    id: 1,
    name: 'Dr. Amara Mensah',
    email: 'amara.m@northstar.vet',
    role: 'Veterinarian',
    branch: 'Riverside',
    status: 'Active',
    tone: 'green',
    initials: 'AM',
  },
  {
    id: 2,
    name: 'Jae Lin',
    email: 'jae.lin@northstar.vet',
    role: 'Receptionist',
    branch: 'Central',
    status: 'Active',
    tone: 'blue',
    initials: 'JL',
  },
  {
    id: 3,
    name: 'Nora Okafor',
    email: 'nora.o@northstar.vet',
    role: 'Lab technician',
    branch: 'Central',
    status: 'Active',
    tone: 'purple',
    initials: 'NO',
  },
  {
    id: 4,
    name: 'Priya Kapoor',
    email: 'priya.k@northstar.vet',
    role: 'Veterinarian',
    branch: 'Westfield',
    status: 'Invited',
    tone: 'amber',
    initials: 'PK',
  },
  {
    id: 5,
    name: 'Marcus Chen',
    email: 'marcus.c@northstar.vet',
    role: 'Pharmacist',
    branch: 'Central',
    status: 'Active',
    tone: 'teal',
    initials: 'MC',
  },
  {
    id: 6,
    name: 'Sofia Reyes',
    email: 'sofia.r@northstar.vet',
    role: 'Veterinarian',
    branch: 'Central',
    status: 'Suspended',
    tone: 'red',
    initials: 'SR',
  },
  {
    id: 7,
    name: 'Daniel Kim',
    email: 'daniel.k@northstar.vet',
    role: 'Veterinarian',
    branch: 'Riverside',
    status: 'Active',
    tone: 'green',
    initials: 'DK',
  },
  {
    id: 8,
    name: 'Aisha Bello',
    email: 'aisha.b@northstar.vet',
    role: 'Receptionist',
    branch: 'Westfield',
    status: 'Active',
    tone: 'pink',
    initials: 'AB',
  },
];

/* ============================================================
   3. CLINIC BRANCHES
============================================================ */
export const branches = [
  {
    id: 1,
    name: 'Riverside Clinic',
    code: 'RSD',
    address: '142 Riverside Dr, Portland, OR',
    phone: '(555) 014-2200',
    staff: 18,
    appointments: 42,
    status: 'Active',
    manager: 'Dr. Amara Mensah',
  },
  {
    id: 2,
    name: 'Central Hospital',
    code: 'CTR',
    address: '88 Central Ave, Portland, OR',
    phone: '(555) 014-2300',
    staff: 24,
    appointments: 61,
    status: 'Active',
    manager: 'Dr. Lena Park',
  },
  {
    id: 3,
    name: 'Westfield Annex',
    code: 'WST',
    address: '9 Westfield Rd, Beaverton, OR',
    phone: '(555) 014-2400',
    staff: 6,
    appointments: 12,
    status: 'Limited',
    manager: 'Dr. Priya Kapoor',
  },
];

/* ============================================================
   4. SERVICES & PRICING — grouped by category
============================================================ */
export const serviceGroups = [
  {
    category: 'Consultations',
    items: [
      { code: 'CONS-01', name: 'General consultation', duration: '30 min', price: 85,  active: true },
      { code: 'CONS-02', name: 'Dermatology consult',  duration: '45 min', price: 125, active: true },
      { code: 'CONS-03', name: 'Emergency consult',    duration: 'Varies', price: 180, active: true },
      { code: 'CONS-04', name: 'Behavior consult',     duration: '60 min', price: 145, active: false },
    ],
  },
  {
    category: 'Vaccinations',
    items: [
      { code: 'VAC-01', name: 'Rabies vaccine',      duration: '15 min', price: 45, active: true },
      { code: 'VAC-02', name: 'DHPP vaccine',        duration: '15 min', price: 55, active: true },
      { code: 'VAC-03', name: 'Bordetella vaccine',  duration: '15 min', price: 40, active: true },
      { code: 'VAC-04', name: 'Feline leukemia vaccine', duration: '15 min', price: 60, active: true },
    ],
  },
  {
    category: 'Procedures',
    items: [
      { code: 'PRC-01', name: 'Dental cleaning',  duration: '60 min', price: 320, active: true },
      { code: 'PRC-02', name: 'Spay (feline)',    duration: '45 min', price: 280, active: true },
      { code: 'PRC-03', name: 'Neuter (canine)',  duration: '45 min', price: 260, active: true },
      { code: 'PRC-04', name: 'Mass removal',     duration: '90 min', price: 480, active: true },
    ],
  },
  {
    category: 'Diagnostics',
    items: [
      { code: 'DIA-01', name: 'CBC + chemistry panel', duration: 'In-house', price: 120, active: true },
      { code: 'DIA-02', name: 'Radiograph (2 views)',  duration: '20 min',   price: 180, active: true },
      { code: 'DIA-03', name: 'Ultrasound',            duration: '30 min',   price: 220, active: true },
      { code: 'DIA-04', name: 'Fecal float',           duration: 'In-house', price: 45,  active: true },
    ],
  },
];

/* ============================================================
   5. SECURITY & ACCESS
============================================================ */
export const securityChecks = [
  {
    title: 'Access review',
    meta: 'Completed 2 days ago',
    status: 'pass',
    icon: 'fa-shield-halved',
  },
  {
    title: 'Nightly backup',
    meta: 'Last run 02:00 · 4.2 GB',
    status: 'pass',
    icon: 'fa-database',
  },
  {
    title: 'Credentials expiring',
    meta: '3 service accounts in 14 days',
    status: 'warn',
    icon: 'fa-key',
  },
  {
    title: 'MFA enforcement',
    meta: '94% of accounts enabled',
    status: 'pass',
    icon: 'fa-mobile-screen',
  },
  {
    title: 'Suspicious sign-ins',
    meta: '2 flagged in last 7 days',
    status: 'warn',
    icon: 'fa-triangle-exclamation',
  },
];

export const securityEvents = [
  { time: '09:14', user: 'amara.m@northstar.vet',  action: 'Signed in',       ip: '10.0.4.12',     result: 'Success',  tone: 'green' },
  { time: '09:02', user: 'unknown',                action: 'Failed sign-in',  ip: '203.0.113.44',  result: 'Blocked',  tone: 'red'   },
  { time: '08:47', user: 'nora.o@northstar.vet',   action: 'Password change', ip: '10.0.4.19',     result: 'Success',  tone: 'green' },
  { time: '08:21', user: 'jae.lin@northstar.vet',  action: 'Signed in',       ip: '10.0.4.22',     result: 'Success',  tone: 'green' },
  { time: '07:58', user: 'marcus.c@northstar.vet', action: 'Role update',     ip: '10.0.4.31',     result: 'Approved', tone: 'blue'  },
  { time: '07:41', user: 'sofia.r@northstar.vet',  action: 'Signed in',       ip: '10.0.4.55',     result: 'Success',  tone: 'green' },
];

/* ============================================================
   6. BACKUPS
============================================================ */
export const backups = [
  { id: 'BK-2026-10-01', type: 'Full',        size: '4.2 GB', started: '01 Oct 2026, 02:00', duration: '12 min', status: 'Completed', tone: 'green' },
  { id: 'BK-2026-09-30', type: 'Incremental', size: '640 MB', started: '30 Sep 2026, 02:00', duration: '4 min',  status: 'Completed', tone: 'green' },
  { id: 'BK-2026-09-29', type: 'Full',        size: '4.1 GB', started: '29 Sep 2026, 02:00', duration: '11 min', status: 'Completed', tone: 'green' },
  { id: 'BK-2026-09-28', type: 'Incremental', size: '512 MB', started: '28 Sep 2026, 02:00', duration: '3 min',  status: 'Completed', tone: 'green' },
  { id: 'BK-2026-09-27', type: 'Full',        size: '4.0 GB', started: '27 Sep 2026, 02:00', duration: '14 min', status: 'Completed', tone: 'green' },
  { id: 'BK-2026-09-26', type: 'Incremental', size: '604 MB', started: '26 Sep 2026, 02:00', duration: '5 min',  status: 'Failed',    tone: 'red'   },
];

export const backupSchedule = [
  { label: 'Daily incremental',    value: '02:00 daily',       meta: 'Retention 14 days' },
  { label: 'Weekly full backup',    value: 'Sundays 01:00',     meta: 'Retention 8 weeks' },
  { label: 'Off-site replication',  value: 'Every 6 hours',     meta: 'US-West region' },
  { label: 'Restore drill',         value: 'Quarterly',         meta: 'Next: 15 Nov 2026' },
];

/* ============================================================
   7. SYSTEM LOGS
============================================================ */
export const systemLogs = [
  { time: '09:14:22', level: 'INFO',  service: 'auth',     message: 'User amara.m signed in from 10.0.4.12' },
  { time: '09:02:11', level: 'WARN',  service: 'auth',     message: 'Failed sign-in attempt for unknown@203.0.113.44' },
  { time: '08:55:03', level: 'INFO',  service: 'api',      message: 'GET /api/appointments 200 (48ms)' },
  { time: '08:47:41', level: 'INFO',  service: 'users',    message: 'Password changed for nora.o@northstar.vet' },
  { time: '08:20:00', level: 'ERROR', service: 'lab-sync', message: 'Analyzer ProCyte DX timeout (retrying)' },
  { time: '08:18:52', level: 'INFO',  service: 'lab-sync', message: 'Analyzer Catalyst One synced, 12 results uploaded' },
  { time: '07:58:14', level: 'INFO',  service: 'users',    message: 'Role updated for marcus.c → pharmacist' },
  { time: '07:00:00', level: 'INFO',  service: 'backup',   message: 'Nightly incremental backup completed (640 MB)' },
  { time: '06:45:31', level: 'WARN',  service: 'storage',  message: 'Disk usage at 78% on /var/lib/vetcare' },
  { time: '02:00:00', level: 'INFO',  service: 'backup',   message: 'Full backup started (BK-2026-10-01)' },
];

/* ============================================================
   8. MAINTENANCE
============================================================ */
export const maintenanceTasks = [
  { title: 'Database index optimization',   schedule: 'Every Sunday 03:00',            lastRun: '28 Sep 2026', status: 'Scheduled',     tone: 'blue'  },
  { title: 'Log rotation & archive',        schedule: 'Every day 04:00',               lastRun: '01 Oct 2026', status: 'Healthy',       tone: 'green' },
  { title: 'Certificate renewal',           schedule: 'Auto (60 days before expiry)', lastRun: '12 Sep 2026', status: 'Healthy',       tone: 'green' },
  { title: 'Storage cleanup',               schedule: 'Every 7 days',                  lastRun: '25 Sep 2026', status: 'Due in 2 days', tone: 'amber' },
  { title: 'Analyzer firmware check',       schedule: 'Monthly, 1st at 05:00',         lastRun: '01 Oct 2026', status: 'Up to date',    tone: 'green' },
];

export const maintenanceIssues = [
  { title: 'Disk usage high on /var/lib/vetcare',      severity: 'Medium', opened: '01 Oct 2026', tone: 'amber' },
  { title: 'Analyzer ProCyte DX intermittent timeouts', severity: 'High',   opened: '30 Sep 2026', tone: 'red'   },
];