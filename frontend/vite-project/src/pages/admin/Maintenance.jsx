import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import RebuildIndexesButton from './RebuildIndexesButton.jsx';

export default function Maintenance() {
  const [toast, setToast] = useState({ text: '', type: 'info' });

  const handleActionSuccess = (message, type = 'info') => {
    setToast({ text: message, type });
    setTimeout(() => setToast({ text: '', type: 'info' }), 3500);
  };

  return (
    <DashboardLayout
      title="Maintenance"
      subtitle="Scheduled tasks, system health and open issues"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      {/* ... Stats row and other cards ... */}

      {/* ---------- QUICK ACTIONS CARD ---------- */}
      <Card title="Quick actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 4px 8px' }}>
          
          {/* Rebuild Database Indexes */}
          <RebuildIndexesButton onSuccess={handleActionSuccess} />

          {/* Clear log archive (placeholder for later) */}
          <button
            className="btn btn-outline btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => handleActionSuccess('Log archive cleared')}
          >
            <i className="fas fa-broom"></i> Clear log archive
          </button>

          {/* Restart background workers (placeholder for later) */}
          <button
            className="btn btn-outline btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => handleActionSuccess('Background workers restarted')}
          >
            <i className="fas fa-rotate"></i> Restart background workers
          </button>

        </div>
      </Card>

      {/* Toast Notification */}
      {toast.text && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: toast.type === 'error' ? '#a83b3b' : '#0f2922',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 500,
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 2000,
          }}
        >
          <i
            className={`fas ${
              toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'
            }`}
            style={{ color: toast.type === 'error' ? '#ff9c9c' : '#a5e0c0' }}
          ></i>
          {toast.text}
        </div>
      )}
    </DashboardLayout>
  );
}