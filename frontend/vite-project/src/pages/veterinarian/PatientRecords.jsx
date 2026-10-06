import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { animalService } from '../../services/animalService.js';
import './Vet.css';

export default function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const q = query ? `?q=${encodeURIComponent(query)}` : '';
        const res = await animalService.list(q);
        setPatients(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [query]);

  const ageFromDob = (dob) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years}y ${months}m`;
  };

  const stats = [
    { label: 'Total patients', value: patients.length, icon: 'fa-paw', tone: 'green' },
    { label: 'Canine', value: patients.filter((p) => p.species === 'Canine').length, icon: 'fa-dog', tone: 'blue' },
    { label: 'Feline', value: patients.filter((p) => p.species === 'Feline').length, icon: 'fa-cat', tone: 'purple' },
    { label: 'Exotic', value: patients.filter((p) => !['Canine','Feline'].includes(p.species)).length, icon: 'fa-dove', tone: 'amber' },
  ];

  return (
    <DashboardLayout
      title="Patient records"
      subtitle="All animals"
      user={{ name: 'Dr. Amara Mensah', role: 'Veterinarian', initials: 'AM', tone: 'green' }}
    >
      <div className="stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <Card title="All patients" subtitle={loading ? 'Loading…' : `${patients.length} patients`}>
        <div className="search-box" style={{ maxWidth: 380, marginBottom: 16 }}>
          <i className="fas fa-magnifying-glass"></i>
          <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading && <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th><th>Species</th><th>Breed</th><th>Gender</th><th>Age</th><th>Weight</th><th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.animal_id}>
                  <td>
                    <div className="cell-avatar-group">
                      <Avatar initials={(p.name || '??').slice(0, 2).toUpperCase()} tone="green" size="sm" />
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.species}</td>
                  <td>{p.breed || '—'}</td>
                  <td><Badge tone={p.gender?.includes('Female') ? 'pink' : 'blue'}>{p.gender || '—'}</Badge></td>
                  <td>{ageFromDob(p.date_of_birth)}</td>
                  <td>{p.weight_kg ? `${p.weight_kg} kg` : '—'}</td>
                  <td>{p.owner_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardLayout>
  );
}