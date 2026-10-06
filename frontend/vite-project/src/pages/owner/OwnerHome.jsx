import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { ownerAnimals, careChecklist, labReports } from '../../data/mockData.js';

export default function OwnerHome() {
  return (
    <DashboardLayout
      title="Welcome back, Taylor"
      subtitle="Your animals' care, appointments and records in one place"
      user={{ name: 'Taylor Davis', role: 'Pet owner', initials: 'TD', tone: 'green' }}
    >
      {/* Hero */}
      <div className="owner-hero">
        <div className="owner-hero-content">
          <div className="owner-hero-label">
            <i className="fas fa-calendar-day"></i> Next appointment
          </div>
          <h2>Thursday, 15 October · 9:30 AM</h2>
          <div className="owner-hero-sub">
            Cooper's dermatology recheck with Dr. Amara Mensah
          </div>
          <div className="owner-hero-meta">
            <span><i className="fas fa-location-dot"></i> Riverside Clinic</span>
            <span><i className="fas fa-clock"></i> 30 minutes</span>
          </div>
          <div className="owner-hero-buttons">
            <button className="owner-hero-btn primary">Confirmed</button>
            <button className="owner-hero-btn ghost">Reschedule</button>
          </div>
        </div>
        <div className="owner-hero-image"></div>
      </div>

      <div className="grid-2col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card
            title="My animals"
            subtitle="Profiles linked to your account"
            actions={
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> Add an animal
              </button>
            }
          >
            <div className="grid-2col-equal">
              {ownerAnimals.map((a) => (
                <div key={a.name} className="animal-card">
                  <div
                    className="animal-card-img"
                    style={{ backgroundImage: `url(${a.img})` }}
                  ></div>
                  <div className="animal-card-body">
                    <div className="flex-between">
                      <h4>{a.name}</h4>
                      <i className="fas fa-arrow-up-right-from-square" style={{ color: 'var(--text-muted)', fontSize: 12 }}></i>
                    </div>
                    <div className="meta">{a.breed}</div>
                    <div className="animal-card-tags">
                      {a.tags.map((t) => (
                        <Badge
                          key={t}
                          tone={t.toLowerCase().includes('due') ? 'amber' : 'green'}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid-2col-equal">
            <Card title="Vaccination history" subtitle="Cooper · Complete immunization record"
              actions={<button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}>View all <i className="fas fa-arrow-right" style={{ fontSize: 9 }}></i></button>}
            >
              <div className="checklist-item">
                <div className="checklist-icon" style={{ background: 'var(--bg-tint-green)', color: 'var(--accent-green)' }}>
                  <i className="fas fa-syringe"></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>Rabies</strong>
                  <span>Administered 12 Mar 2026</span>
                </div>
                <Badge tone="green">Current</Badge>
              </div>
              <div className="checklist-item">
                <div className="checklist-icon" style={{ background: 'var(--bg-tint-green)', color: 'var(--accent-green)' }}>
                  <i className="fas fa-syringe"></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>DHPP</strong>
                  <span>Administered 12 Mar 2026</span>
                </div>
                <Badge tone="green">Current</Badge>
              </div>
            </Card>

            <Card title="Past medical notes" subtitle="Shared consultation summaries"
              actions={<button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}>Full history <i className="fas fa-arrow-right" style={{ fontSize: 9 }}></i></button>}
            >
              <div className="checklist-item">
                <div className="checklist-icon" style={{ background: 'var(--bg-tint-amber)', color: 'var(--accent-amber)' }}>
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>Dermatology consult</strong>
                  <span>Cooper · 1 Oct 2026</span>
                </div>
              </div>
              <div className="checklist-item">
                <div className="checklist-icon" style={{ background: 'var(--bg-tint-blue)', color: 'var(--accent-blue)' }}>
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>Wellness exam</strong>
                  <span>Milo · 15 Sep 2026</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Care checklist" subtitle="Next 30 days">
            {careChecklist.map((c) => (
              <div key={c.title} className="checklist-item">
                <div className={`checklist-icon`} style={{
                  background: c.tone === 'green' ? 'var(--bg-tint-green)'
                    : c.tone === 'amber' ? 'var(--bg-tint-amber)'
                    : 'var(--bg-tint-blue)',
                  color: c.tone === 'green' ? 'var(--accent-green)'
                    : c.tone === 'amber' ? 'var(--accent-amber)'
                    : 'var(--accent-blue)',
                }}>
                  <i className={`fas ${c.icon}`}></i>
                </div>
                <div className="checklist-body" style={{ flex: 1 }}>
                  <strong>{c.title}</strong>
                  <span>{c.date}</span>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Laboratory reports" subtitle="Digital results and downloads">
            {labReports.map((r) => (
              <div
                key={r.title}
                className={`report-item ${r.abnormal ? 'abnormal' : ''}`}
              >
                <div
                  className="stat-icon"
                  style={{
                    width: 36,
                    height: 36,
                    background: r.abnormal ? 'var(--bg-tint-red)' : 'var(--bg-tint-green)',
                    color: r.abnormal ? 'var(--accent-red)' : 'var(--primary)',
                  }}
                >
                  <i className="fas fa-file-medical"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{r.title}</strong>
                  <span>{r.meta}</span>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Request an appointment">
            <div className="text-sm text-muted mb-16">
              We'll confirm within one business hour.
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fas fa-calendar-plus"></i> Book appointment
            </button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}