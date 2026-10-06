import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { ownerService } from '../../services/ownerService.js';
import { animalService } from '../../services/animalService.js';

const SPECIES = ['Canine', 'Feline', 'Rabbit', 'Avian', 'Reptile', 'Equine'];

/* These MUST match the ENUM values in the animals table:
   enum('Male','Female','Male Neutered','Female Spayed') */
const GENDER_OPTIONS = ['Male', 'Female', 'Male Neutered', 'Female Spayed'];

const EMPTY = {
  // Owner (step 1)
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  ownerAddress: '',
  // Animal (step 2)
  animalName: '',
  species: 'Canine',
  breed: '',
  gender: 'Male',
  age: '',         // free text like "3y 4m"
  weight: '',      // free text like "28 kg"
  color: '',       // (no DB column — kept for UI, ignored on save)
  microchip: '',
};

const STEPS = [
  { id: 1, label: 'Owner',   icon: 'fa-user' },
  { id: 2, label: 'Animal',  icon: 'fa-paw' },
  { id: 3, label: 'Confirm', icon: 'fa-circle-check' },
];

/* ---------- Helpers ---------- */

/* "28 kg" → 28.0 */
const parseWeight = (text) => {
  const m = String(text || '').match(/[\d.]+/);
  return m ? Number(m[0]) : null;
};

/* "3y 4m" → '2018-06-05' (approx date) ; returns null if unparseable */
const parseAgeToDob = (text) => {
  const s = String(text || '').toLowerCase().trim();
  if (!s) return null;

  const years  = Number((s.match(/(\d+(\.\d+)?)\s*y/) || [])[1] || 0);
  const months = Number((s.match(/(\d+)\s*m/)        || [])[1] || 0);

  if (!years && !months) return null;

  const now = new Date();
  const dob = new Date(now);
  dob.setFullYear(now.getFullYear() - Math.floor(years));
  dob.setMonth(now.getMonth() - Math.floor(months) - Math.round((years - Math.floor(years)) * 12));
  return dob.toISOString().slice(0, 10);
};

/* ============================================================
   Main Component
============================================================ */
export default function RegistrationWizard({ open, onClose, onComplete, defaultOwner }) {
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState(
    defaultOwner
      ? { ...EMPTY, ownerName: defaultOwner.ownerName || '', animalName: defaultOwner.animalName || '' }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setStep(1);
    setForm(EMPTY);
    setErrors({});
    setSubmitting(false);
    onClose?.();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (s) => {
    const next = {};
    if (s === 1) {
      if (!form.ownerName.trim())  next.ownerName  = 'Owner name is required';
      if (!form.ownerPhone.trim()) next.ownerPhone = 'Phone is required';
    }
    if (s === 2) {
      if (!form.animalName.trim()) next.animalName = 'Animal name is required';
      if (!form.species)           next.species    = 'Species is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 3)); };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  /* ---------- SAVE TO DATABASE ---------- */
  const handleComplete = async () => {
    if (!validateStep(1) || !validateStep(2)) return;

    setSubmitting(true);
    setErrors({});

    try {
      /* 1) Create the owner */
      const ownerRes = await ownerService.create({
        full_name: form.ownerName.trim(),
        phone:     form.ownerPhone.trim(),
        email:     form.ownerEmail.trim() || null,
        address:   form.ownerAddress.trim() || null,
      });
      const ownerId = ownerRes.data.owner_id;

      /* 2) Create the animal linked to that owner */
      const animalRes = await animalService.create({
        owner_id:         ownerId,
        name:             form.animalName.trim(),
        species:          form.species,
        breed:            form.breed.trim() || null,
        gender:           form.gender,
        date_of_birth:    parseAgeToDob(form.age),
        weight_kg:        parseWeight(form.weight),
        microchip_number: form.microchip.trim() || null,
      });

      const created = {
        owner_id:  ownerId,
        owner:     ownerRes.data.full_name,
        animal_id: animalRes.data.animal_id,
        patient:   animalRes.data.name,
        species:   animalRes.data.species,
        initials:  animalRes.data.name.slice(0, 2).toUpperCase(),
        avatar:    'blue',
      };

      onComplete?.(created);
      setSubmitting(false);
      handleClose();
    } catch (err) {
      console.error('Registration failed:', err);
      setErrors({ submit: err.message || 'Registration failed' });
      setSubmitting(false);
    }
  };

  const L = {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.06em', color: '#8fa39d',
    textTransform: 'uppercase', marginBottom: 6,
  };
  const I = (err) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${err ? '#d9534f' : '#e6ecea'}`,
    borderRadius: 10, fontSize: 13.5, background: '#fff',
    color: '#0f2922', outline: 'none', fontFamily: 'inherit',
  });
  const E = { color: '#a83b3b', fontSize: 12, marginTop: 5, fontWeight: 500 };
  const H = { fontSize: 16, fontWeight: 700, color: '#0f2922', marginBottom: 4, marginTop: 0 };
  const SubH = { fontSize: 12.5, color: '#8fa39d', marginBottom: 20, marginTop: 0 };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register owner & pet"
      width={640}
      footer={
        <>
          {step > 1 && (
            <button type="button" className="btn btn-outline btn-lg" onClick={back} disabled={submitting}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
          <button type="button" className="btn btn-outline btn-lg" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>

          {step < 3 ? (
            <button type="button" className="btn btn-primary btn-lg" onClick={next}>
              Next <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button type="button" className="btn btn-primary btn-lg" onClick={handleComplete} disabled={submitting}>
              {submitting
                ? <><i className="fas fa-spinner fa-spin"></i> Registering…</>
                : <><i className="fas fa-circle-check"></i> Complete registration</>}
            </button>
          )}
        </>
      }
    >
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '0 8px' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: step >= s.id ? '#167a68' : '#e6ecea',
                color: step >= s.id ? '#fff' : '#8fa39d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>
                {step > s.id ? <i className="fas fa-check"></i> : <i className={`fas ${s.icon}`}></i>}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: step >= s.id ? '#167a68' : '#8fa39d' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step > s.id ? '#167a68' : '#e6ecea', margin: '0 8px', marginBottom: 22 }} />
            )}
          </div>
        ))}
      </div>

      {/* ============ STEP 1 — OWNER ============ */}
      {step === 1 && (
        <div>
          <h4 style={H}>Owner information</h4>
          <p style={SubH}>The client who will own the animal</p>

          <div style={{ marginBottom: 16 }}>
            <label style={L}>Full name</label>
            <input type="text" value={form.ownerName} onChange={handleChange('ownerName')}
              placeholder="Taylor Davis" style={I(errors.ownerName)} autoFocus />
            {errors.ownerName && <p style={E}>{errors.ownerName}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={L}>Phone</label>
              <input type="tel" value={form.ownerPhone} onChange={handleChange('ownerPhone')}
                placeholder="(555) 018-4271" style={I(errors.ownerPhone)} />
              {errors.ownerPhone && <p style={E}>{errors.ownerPhone}</p>}
            </div>
            <div>
              <label style={L}>Email (optional)</label>
              <input type="email" value={form.ownerEmail} onChange={handleChange('ownerEmail')}
                placeholder="taylor@example.com" style={I()} />
            </div>
          </div>

          <div>
            <label style={L}>Address (optional)</label>
            <input type="text" value={form.ownerAddress} onChange={handleChange('ownerAddress')}
              placeholder="142 Riverside Dr, Portland, OR" style={I()} />
          </div>
        </div>
      )}

      {/* ============ STEP 2 — ANIMAL ============ */}
      {step === 2 && (
        <div>
          <h4 style={H}>Animal information</h4>
          <p style={SubH}>Details about the pet</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={L}>Animal name</label>
              <input type="text" value={form.animalName} onChange={handleChange('animalName')}
                placeholder="Cooper" style={I(errors.animalName)} autoFocus />
              {errors.animalName && <p style={E}>{errors.animalName}</p>}
            </div>
            <div>
              <label style={L}>Species</label>
              <select value={form.species} onChange={handleChange('species')} style={I()}>
                {SPECIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={L}>Breed</label>
              <input type="text" value={form.breed} onChange={handleChange('breed')}
                placeholder="Golden Retriever" style={I()} />
            </div>
            <div>
              <label style={L}>Gender</label>
              <select value={form.gender} onChange={handleChange('gender')} style={I()}>
                {GENDER_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={L}>Age</label>
              <input type="text" value={form.age} onChange={handleChange('age')}
                placeholder="3y 4m" style={I()} />
            </div>
            <div>
              <label style={L}>Weight</label>
              <input type="text" value={form.weight} onChange={handleChange('weight')}
                placeholder="31 kg" style={I()} />
            </div>
            <div>
              <label style={L}>Color</label>
              <input type="text" value={form.color} onChange={handleChange('color')}
                placeholder="Brown" style={I()} />
            </div>
          </div>

          <div>
            <label style={L}>Microchip ID (optional)</label>
            <input type="text" value={form.microchip} onChange={handleChange('microchip')}
              placeholder="985141000123456" style={I()} />
          </div>
        </div>
      )}

      {/* ============ STEP 3 — CONFIRM ============ */}
      {step === 3 && (
        <div>
          <h4 style={H}>Confirm registration</h4>
          <p style={SubH}>Review the details before saving</p>

          <div style={{ border: '1px solid #e6ecea', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 10 }}>
              <i className="fas fa-user" style={{ color: '#167a68', marginRight: 6 }}></i> Owner
            </div>
            <Row k="Name"    v={form.ownerName} />
            <Row k="Phone"   v={form.ownerPhone} />
            <Row k="Email"   v={form.ownerEmail || '—'} />
            <Row k="Address" v={form.ownerAddress || '—'} last />
          </div>

          <div style={{ border: '1px solid #e6ecea', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#8fa39d', textTransform: 'uppercase', marginBottom: 10 }}>
              <i className="fas fa-paw" style={{ color: '#167a68', marginRight: 6 }}></i> Animal
            </div>
            <Row k="Name"    v={form.animalName} />
            <Row k="Species" v={form.species} />
            <Row k="Breed"   v={form.breed || '—'} />
            <Row k="Gender"  v={form.gender} />
            <Row k="Age"     v={form.age || '—'} />
            <Row k="Weight"  v={form.weight || '—'} />
            <Row k="Microchip" v={form.microchip || '—'} last />
          </div>

          {errors.submit && <p style={E}>{errors.submit}</p>}
        </div>
      )}
    </Modal>
  );
}

function Row({ k, v, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0',
      borderBottom: last ? 'none' : '1px solid #f0f4f5',
      fontSize: 13,
    }}>
      <span style={{ color: '#8fa39d', fontSize: 12.5 }}>{k}</span>
      <strong style={{ color: '#0f2922', fontWeight: 600, textAlign: 'right' }}>{v}</strong>
    </div>
  );
}