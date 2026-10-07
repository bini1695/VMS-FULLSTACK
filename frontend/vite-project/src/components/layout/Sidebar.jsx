import { NavLink } from 'react-router-dom';
import { useWorkspace, WORKSPACES } from '../../context/WorkspaceContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_BY_WORKSPACE = {
  [WORKSPACES.ADMIN]: [
    { to: '/admin', label: 'Overview', icon: 'fa-table-cells-large' },
    { to: '/admin/users', label: 'User accounts', icon: 'fa-users', badge: '48' },
    { to: '/admin/branches', label: 'Clinic branches', icon: 'fa-hospital' },
    { to: '/admin/services', label: 'Services & pricing', icon: 'fa-clipboard-list' },
    { to: '/admin/security', label: 'Security & access', icon: 'fa-shield-halved' },
    { to: '/admin/backups', label: 'Backups', icon: 'fa-database' },
    { to: '/admin/logs', label: 'System logs', icon: 'fa-file-lines' },
    { to: '/admin/maintenance', label: 'Maintenance', icon: 'fa-wrench' },
  ],
  [WORKSPACES.VETERINARIAN]: [
    { to: '/vet', label: 'Today', icon: 'fa-table-cells-large' },
    { to: '/vet/appointments', label: 'Appointments', icon: 'fa-calendar-day', badge: '11' },
    { to: '/vet/patients', label: 'Patient records', icon: 'fa-paw' },
    { to: '/vet/consultations', label: 'Consultations', icon: 'fa-stethoscope' },
    { to: '/vet/lab', label: 'Laboratory', icon: 'fa-flask', badge: '3' },
    { to: '/vet/prescriptions', label: 'Prescriptions', icon: 'fa-prescription' },
    { to: '/vet/surgery', label: 'Surgery schedule', icon: 'fa-heart-pulse' },
    { to: '/vet/followups', label: 'Follow-ups', icon: 'fa-clipboard-check' },
  ],
  [WORKSPACES.LAB]: [
    { to: '/lab', label: 'Laboratory overview', icon: 'fa-table-cells-large' },
    { to: '/lab/requisitions', label: 'Test requisitions', icon: 'fa-clipboard-list', badge: '18' },
    { to: '/lab/tracking', label: 'Sample tracking', icon: 'fa-vials' },
    { to: '/lab/findings', label: 'Findings entry', icon: 'fa-pen-to-square' },
    { to: '/lab/reports', label: 'Diagnostic reports', icon: 'fa-file-medical' },
    { to: '/lab/equipment', label: 'Equipment', icon: 'fa-microscope' },
    { to: '/lab/stock', label: 'Reagent stock', icon: 'fa-boxes-stacked', badge: '4' },
    { to: '/lab/qc', label: 'Quality control', icon: 'fa-circle-check' },
  ],
  [WORKSPACES.RECEPTIONIST]: [
    { to: '/front-desk', label: 'Front desk', icon: 'fa-table-cells-large' },
    { to: '/front-desk/appointments', label: 'Appointments', icon: 'fa-calendar-day', badge: '27' },
    { to: '/front-desk/checkin', label: 'Check-in queue', icon: 'fa-list-check', badge: '6' },
    { to: '/front-desk/owners', label: 'Owners & animals', icon: 'fa-paw' },
    { to: '/front-desk/registration', label: 'Registration', icon: 'fa-user-plus' },
    { to: '/front-desk/billing', label: 'Billing & invoices', icon: 'fa-file-invoice-dollar', badge: '4' },
    { to: '/front-desk/payments', label: 'Payments', icon: 'fa-credit-card' },
    { to: '/front-desk/messages', label: 'Messages', icon: 'fa-comment-dots' },
  ],
  [WORKSPACES.PHARMACIST]: [
    { to: '/pharmacy', label: 'Pharmacy overview', icon: 'fa-table-cells-large' },
    { to: '/pharmacy/dispense', label: 'Dispensing queue', icon: 'fa-prescription-bottle-medical', badge: '8' },
    { to: '/pharmacy/inventory', label: 'Drug inventory', icon: 'fa-pills' },
    { to: '/pharmacy/vaccines', label: 'Vaccines', icon: 'fa-syringe' },
    { to: '/pharmacy/tools', label: 'Tools & consumables', icon: 'fa-toolbox' },
    { to: '/pharmacy/alerts', label: 'Stock alerts', icon: 'fa-triangle-exclamation', badge: '11' },
    { to: '/pharmacy/orders', label: 'Purchase orders', icon: 'fa-cart-shopping' },
    { to: '/pharmacy/suppliers', label: 'Suppliers', icon: 'fa-truck-field' },
  ],
  [WORKSPACES.OWNER]: [
    { to: '/owner', label: 'Home', icon: 'fa-house' },
    { to: '/owner/animals', label: 'My animals', icon: 'fa-paw', badge: '2' },
    { to: '/owner/appointments', label: 'Appointments', icon: 'fa-calendar-day' },
    { to: '/owner/vaccinations', label: 'Vaccinations', icon: 'fa-syringe' },
    { to: '/owner/records', label: 'Medical records', icon: 'fa-file-medical' },
    { to: '/owner/labs', label: 'Lab reports', icon: 'fa-flask' },
    { to: '/owner/prescriptions', label: 'Prescriptions', icon: 'fa-prescription' },
    { to: '/owner/invoices', label: 'Invoices & payments', icon: 'fa-file-invoice' },
  ],
};

const WORKSPACE_LABELS = {
  [WORKSPACES.ADMIN]: 'System administrator',
  [WORKSPACES.VETERINARIAN]: 'Veterinarian',
  [WORKSPACES.LAB]: 'Laboratory technician',
  [WORKSPACES.RECEPTIONIST]: 'Receptionist · Front desk',
  [WORKSPACES.PHARMACIST]: 'Pharmacist · Inventory manager',
  [WORKSPACES.OWNER]: 'Pet owner',
};

export default function Sidebar() {
  const { workspace } = useWorkspace();
  const { logout, user } = useAuth();
  const items = NAV_BY_WORKSPACE[workspace] || [];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <i className="fas fa-paw"></i>
        </div>
        <div className="sidebar-brand-text">
          <h3>VetraCare</h3>
          <p>Northstar Animal Health</p>
        </div>
      </div>

      {/* Workspace box — MUST be a div with class sidebar-workspace */}
      <div className="sidebar-workspace">
        <span className="sidebar-workspace-label">Workspace</span>
        <span className="sidebar-workspace-value">
          {WORKSPACE_LABELS[workspace]}
        </span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
            {item.badge && (
              <span className="sidebar-nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={logout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Log out</span>
      </button>
    </aside>
  );
}