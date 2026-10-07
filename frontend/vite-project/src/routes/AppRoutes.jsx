import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

// ---------- HOME ----------
import Home from '../pages/home/Home.jsx';

// ---------- AUTH ----------
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

// ---------- ADMIN ----------
import AdminOverview from '../pages/admin/Overview.jsx';
import Users from '../pages/admin/Users.jsx';
import Branches from '../pages/admin/Branches.jsx';
import Services from '../pages/admin/Services.jsx';
import Security from '../pages/admin/Security.jsx';
import Backups from '../pages/admin/Backups.jsx';
import Logs from '../pages/admin/Logs.jsx';
import Maintenance from '../pages/admin/Maintenance.jsx';

// ---------- VETERINARIAN ----------
import VetToday from '../pages/veterinarian/Today.jsx';
import VetAppointments from '../pages/veterinarian/Appointments.jsx';
import PatientRecords from '../pages/veterinarian/PatientRecords.jsx';
import Consultations from '../pages/veterinarian/Consultations.jsx';
import VetLab from '../pages/veterinarian/Laboratory.jsx';
import VetPrescriptions from '../pages/veterinarian/Prescriptions.jsx';
import SurgerySchedule from '../pages/veterinarian/SurgerySchedule.jsx';
import FollowUps from '../pages/veterinarian/FollowUps.jsx';

// ---------- LABORATORY ----------
import LabOverview from '../pages/laboratory/LabOverview.jsx';
import Requisitions from '../pages/laboratory/Requisitions.jsx';
import SampleTracking from '../pages/laboratory/SampleTracking.jsx';
import FindingsEntry from '../pages/laboratory/FindingsEntry.jsx';
import Reports from '../pages/laboratory/Reports.jsx';
import Equipment from '../pages/laboratory/Equipment.jsx';
import ReagentStock from '../pages/laboratory/ReagentStock.jsx';
import QualityControl from '../pages/laboratory/QualityControl.jsx';

// ---------- RECEPTIONIST ----------
import FrontDesk from '../pages/receptionist/FrontDesk.jsx';
import ReceptionAppointments from '../pages/receptionist/Appointments.jsx';
import CheckInQueue from '../pages/receptionist/CheckInQueue.jsx';
import OwnersAnimals from '../pages/receptionist/OwnersAnimals.jsx';
import Registration from '../pages/receptionist/Registration.jsx';
import BillingInvoices from '../pages/receptionist/BillingInvoices.jsx';
import Payments from '../pages/receptionist/Payments.jsx';
import Messages from '../pages/receptionist/Messages.jsx';

// ---------- PHARMACIST ----------
import PharmacyOverview from '../pages/pharmacist/PharmacyOverview.jsx';

// ---------- PET OWNER ----------
import OwnerHome from '../pages/owner/OwnerHome.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- HOME (public landing page) ---------- */}
      <Route path="/" element={<Home />} />

      {/* ---------- PUBLIC (auth) ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- ADMIN ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/branches" element={<Branches />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/security" element={<Security />} />
        <Route path="/admin/backups" element={<Backups />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/maintenance" element={<Maintenance />} />
      </Route>

      {/* ---------- VET ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="veterinarian" />}>
        <Route path="/vet" element={<VetToday />} />
        <Route path="/vet/appointments" element={<VetAppointments />} />
        <Route path="/vet/patients" element={<PatientRecords />} />
        <Route path="/vet/consultations" element={<Consultations />} />
        <Route path="/vet/lab" element={<VetLab />} />
        <Route path="/vet/prescriptions" element={<VetPrescriptions />} />
        <Route path="/vet/surgery" element={<SurgerySchedule />} />
        <Route path="/vet/followups" element={<FollowUps />} />
      </Route>

      {/* ---------- LAB ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="lab" />}>
        <Route path="/lab" element={<LabOverview />} />
        <Route path="/lab/requisitions" element={<Requisitions />} />
        <Route path="/lab/tracking" element={<SampleTracking />} />
        <Route path="/lab/findings" element={<FindingsEntry />} />
        <Route path="/lab/reports" element={<Reports />} />
        <Route path="/lab/equipment" element={<Equipment />} />
        <Route path="/lab/stock" element={<ReagentStock />} />
        <Route path="/lab/qc" element={<QualityControl />} />
      </Route>

      {/* ---------- RECEPTIONIST ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="receptionist" />}>
        <Route path="/front-desk" element={<FrontDesk />} />
        <Route path="/front-desk/appointments" element={<ReceptionAppointments />} />
        <Route path="/front-desk/checkin" element={<CheckInQueue />} />
        <Route path="/front-desk/owners" element={<OwnersAnimals />} />
        <Route path="/front-desk/registration" element={<Registration />} />
        <Route path="/front-desk/billing" element={<BillingInvoices />} />
        <Route path="/front-desk/payments" element={<Payments />} />
        <Route path="/front-desk/messages" element={<Messages />} />
      </Route>

      {/* ---------- PHARMACIST ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="pharmacist" />}>
        <Route path="/pharmacy" element={<PharmacyOverview />} />
        <Route path="/pharmacy/*" element={<PharmacyOverview />} />
      </Route>

      {/* ---------- OWNER ONLY ---------- */}
      <Route element={<ProtectedRoute allowedRole="owner" />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/*" element={<OwnerHome />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}