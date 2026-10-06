import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { systemLogs } from '../../data/adminData.js';

const LEVEL_TONES = { INFO: 'blue', WARN: 'amber', ERROR: 'red' };

export default function Logs() {
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = systemLogs.filter((log) => {
    const matchesLevel = level === 'All' || log.level === level;
    const matchesQuery =
      log.message.toLowerCase().includes(query.toLowerCase()) ||
      log.service.toLowerCase().includes(query.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  return (
    <DashboardLayout
      title="System logs"
      subtitle="Realtime application and infrastructure events"
      user={{ name: 'System Admin', role: 'Administrator', initials: 'SA', tone: 'teal' }}
    >
      <Card
        title="Recent activity"
        subtitle={`${filtered.length} of ${systemLogs.length} events`}
        actions={
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Export CSV
          </button>
        }
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 260, flex: 1 }}>
            <i className="fas fa-magnifying-glass"></i>
            <input
              placeholder="Search messages or services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['All', 'INFO', 'WARN', 'ERROR'].map((l) => (
              <button
                key={l}
                className={`tab ${level === l ? 'active' : ''}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: '#0f2922',
            borderRadius: 10,
            padding: 16,
            fontFamily: 'Menlo, Consolas, monospace',
            fontSize: 12.5,
            color: '#e6f5ee',
            maxHeight: 520,
            overflowY: 'auto',
          }}
        >
          {filtered.map((log, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 70px 90px 1fr',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{ color: '#8fa39d' }}>{log.time}</span>
              <span
                style={{
                  color:
                    log.level === 'ERROR'
                      ? '#ff9c9c'
                      : log.level === 'WARN'
                      ? '#f5c66c'
                      : '#a5e0c0',
                  fontWeight: 700,
                }}
              >
                {log.level}
              </span>
              <span style={{ color: '#b9d2cb' }}>[{log.service}]</span>
              <span>{log.message}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: 20, color: '#8fa39d' }}>
              No logs match your filter.
            </p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}