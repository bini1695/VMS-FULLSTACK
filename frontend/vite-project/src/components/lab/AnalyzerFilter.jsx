import { useState, useRef, useEffect } from 'react';

const ANALYZERS = [
  { id: 'all',          label: 'All analyzers', icon: 'fa-sliders' },
  { id: 'ProCyte DX',   label: 'ProCyte DX',    icon: 'fa-vial' },
  { id: 'Catalyst One', label: 'Catalyst One',  icon: 'fa-flask' },
  { id: 'SedVue',       label: 'SedVue',        icon: 'fa-droplet' },
  { id: 'Microscope A', label: 'Microscope A',  icon: 'fa-microscope' },
];

export default function AnalyzerFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const cur = ANALYZERS.find((a) => a.id === value) || ANALYZERS[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="btn btn-outline" onClick={() => setOpen((o) => !o)} style={{ minWidth: 170 }}>
        <i className={`fas ${cur.icon}`}></i> {cur.label}
        <i className="fas fa-chevron-down" style={{ marginLeft: 4, fontSize: 10 }}></i>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 220, background: '#fff', border: '1px solid #e6ecea', borderRadius: 12, boxShadow: '0 20px 40px -12px rgba(15, 41, 34, 0.2)', padding: 6, zIndex: 100 }}>
          {ANALYZERS.map((a) => (
            <button key={a.id} type="button" onClick={() => { onChange?.(a.id); setOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13.5, color: a.id === value ? '#167a68' : '#0f2922', background: a.id === value ? '#e6f5ee' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <i className={`fas ${a.icon}`} style={{ width: 16, color: '#167a68' }}></i>
              <span style={{ flex: 1 }}>{a.label}</span>
              {a.id === value && <i className="fas fa-check" style={{ fontSize: 11, color: '#167a68' }}></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}