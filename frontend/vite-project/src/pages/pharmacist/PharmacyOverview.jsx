import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { pharmacyStats, dispensingQueue } from '../../data/mockData.js';

export default function PharmacyOverview() {
  return (
    <DashboardLayout
      title="Pharmacy & inventory"
      subtitle="Central dispensary · Stock synchronized across 3 branches"
      user={{ name: 'Avery Johnson', role: 'Pharmacist', initials: 'AJ', tone: 'teal' }}
    >
      <div className="stats-grid">
        {pharmacyStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid-2col">
        <Card
          title="Prescription dispensing queue"
          subtitle="Electronic prescriptions awaiting pharmacy action"
          actions={
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Walk-in dispense
            </button>
          }
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>RX</th>
                <th>Patient &amp; owner</th>
                <th>Medication</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dispensingQueue.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong style={{ color: 'var(--primary)', fontSize: 12.5 }}>
                      {r.id}
                    </strong>
                  </td>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={r.initials} tone={r.avatar} size="sm" />
                      <div>
                        <strong>{r.patient}</strong>
                        <span>{r.owner}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{r.medication}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.doctor}</div>
                  </td>
                  <td><Badge tone={r.tone}>{r.status}</Badge></td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '6px 10px' }}>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Dispense RX-8412" subtitle="Cooper Davis · Digital prescription">
            <div
              style={{
                background: 'var(--bg-tint-green)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
                Mometamax otic suspension
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Instill 4 drops in each affected ear once daily for 10 days.
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Quantity: 15 g</div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                background: '#f6fbf9',
                border: '1px solid #d6ece3',
                padding: 12,
                borderRadius: 10,
                marginBottom: 12,
                fontSize: 12.5,
                color: 'var(--primary)',
                fontWeight: 500,
              }}
            >
              <i className="fas fa-shield-halved"></i>
              Allergy and interaction check passed
            </div>

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Selected lot
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>MMX-26-041 · Exp Nov 2026</div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fas fa-print"></i> Print label &amp; dispense
            </button>
          </Card>

          <Card title="Low stock & expiry alerts" subtitle="Prioritized attention">
            <div className="report-item abnormal">
              <div className="stat-icon red" style={{ width: 36, height: 36 }}>
                <i className="fas fa-triangle-exclamation"></i>
              </div>
              <div style={{ flex: 1 }}>
                <strong>Amoxicillin 250 mg</strong>
                <span>4 packs left · Reorder now</span>
              </div>
            </div>
            <div className="report-item abnormal">
              <div className="stat-icon red" style={{ width: 36, height: 36 }}>
                <i className="fas fa-triangle-exclamation"></i>
              </div>
              <div style={{ flex: 1 }}>
                <strong>Meloxicam oral susp.</strong>
                <span>2 bottles left · Reorder now</span>
              </div>
            </div>
            <div className="report-item">
              <div className="stat-icon amber" style={{ width: 36, height: 36 }}>
                <i className="fas fa-clock"></i>
              </div>
              <div style={{ flex: 1 }}>
                <strong>Rabies vaccine</strong>
                <span>Expires in 42 days · 6 doses</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}