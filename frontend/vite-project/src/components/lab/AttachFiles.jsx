import { useState, useRef } from 'react';

const MAX = 10 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function AttachFiles({ files = [], onChange, disabled = false }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);

  const validate = (list) => {
    const ok = [];
    const errs = [];
    list.forEach((f) => {
      if (!TYPES.includes(f.type)) { errs.push(`"${f.name}" is not supported (JPG, PNG, WEBP, PDF only).`); return; }
      if (f.size > MAX) { errs.push(`"${f.name}" exceeds 10 MB.`); return; }
      ok.push({ id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), file: f });
    });
    setError(errs[0] || '');
    return ok;
  };

  const add = (list) => { const ok = validate(Array.from(list)); if (ok.length) onChange?.([...files, ...ok]); };

  const fmt = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;
  const isImg = (t) => t.startsWith('image/');

  return (
    <div>
      <div
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) add(e.dataTransfer.files); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        onClick={() => !disabled && ref.current?.click()}
        style={{ border: `1.5px dashed ${dragging ? '#167a68' : '#cee5db'}`, background: dragging ? '#e6f5ee' : '#f9fdfb', borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'all 0.15s' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: dragging ? '#b8e0d9' : '#e6f5ee', color: '#167a68', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>
          <i className="fas fa-cloud-arrow-up"></i>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f2922', marginBottom: 4 }}>
          {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
        </div>
        <div style={{ fontSize: 12, color: '#8fa39d' }}>JPG, PNG, WEBP or PDF · Max 10 MB</div>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => { if (e.target.files?.length) add(e.target.files); e.target.value = ''; }} disabled={disabled} style={{ display: 'none' }} />
      </div>

      {error && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: '#fdecec', border: '1px solid #f5c6c2', color: '#a83b3b', borderRadius: 10, fontSize: 12.5, display: 'flex', gap: 8, alignItems: 'center' }}>
          <i className="fas fa-circle-exclamation"></i> {error}
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: '#fff', border: '1px solid #e6ecea', borderRadius: 10 }}>
              {isImg(f.type) ? (
                <img src={f.url} alt={f.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 8, background: '#fdecec', color: '#d9534f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  <i className="fas fa-file-pdf"></i>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f2922', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: 11.5, color: '#8fa39d' }}>{fmt(f.size)} · {isImg(f.type) ? 'Image' : 'PDF'}</div>
              </div>
              <button type="button" onClick={() => onChange?.(files.filter((x) => x.id !== f.id))} disabled={disabled}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #f0c1c1', background: '#fff', color: '#a83b3b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <i className="fas fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}