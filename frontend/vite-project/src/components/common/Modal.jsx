import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer, width = 520 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 41, 34, 0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.35)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e6ecea', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e6ecea', background: '#fff', color: '#4f6b63', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <i className="fas fa-xmark"></i>
          </button>
        </div>
        <div style={{ padding: '22px 24px' }}>{children}</div>
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e6ecea', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#f6f9f8', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}