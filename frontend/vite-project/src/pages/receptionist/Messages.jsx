import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import ComposeMessageModal from '../../components/receptionist/ComposeMessageModal.jsx';
import { messageService } from '../../services/messageService.js';
import './FrontDesk.css';

export default function Messages() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('All');
  const [composeOpen, setComposeOpen] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };

  /* ---------- LOAD ---------- */
  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await messageService.list();
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'All'
    ? items
    : items.filter((m) =>
        m.channel === filter || (filter === 'Unread' && !m.is_read)
      );

  const unreadCount = items.filter((m) => !m.is_read).length;

  const markRead = async (id) => {
    try {
      await messageService.markRead(id);
      setItems((prev) =>
        prev.map((m) => (m.message_id === id ? { ...m, is_read: 1 } : m))
      );
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleSend = async (payload) => {
    const res = await messageService.create(payload);
    setItems((prev) => [res.data, ...prev]);
    showToast(
      payload.scheduled_at
        ? `Message scheduled for ${payload.scheduled_at}`
        : `Message sent to ${payload.recipient_contact}`
    );
  };

  return (
    <DashboardLayout
      title="Messages"
      subtitle="Client communications"
      user={{ name: 'Jae Lin', role: 'Receptionist', initials: 'JL', tone: 'blue' }}
    >
      <Card
        title="Inbox"
        subtitle={loading ? 'Loading…' : `${filtered.length} of ${items.length} messages · ${unreadCount} unread`}
        actions={
          <button className="btn btn-primary" onClick={() => setComposeOpen(true)}>
            <i className="fas fa-paper-plane"></i> Compose
          </button>
        }
      >
        <div className="tabs">
          {['All', 'Unread', 'SMS', 'Email'].map((t) => (
            <button
              key={t}
              className={`tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
              {t === 'Unread' && unreadCount > 0 ? ` ${unreadCount}` : ''}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading messages…
          </p>
        )}

        {!loading && error && (
          <p style={{ padding: 40, textAlign: 'center', color: '#a83b3b' }}>{error}</p>
        )}

        {!loading && !error && filtered.map((m) => (
          <div
            key={m.message_id}
            className={`msg-row ${!m.is_read ? 'unread' : ''}`}
            onClick={() => !m.is_read && markRead(m.message_id)}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              initials={(m.sender_name || 'SY').split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              tone="blue"
            />
            <div className="msg-body">
              <strong>{m.sender_name || 'System'}</strong>
              <div className="subj">{m.subject || '(no subject)'}</div>
              <div className="prev">{(m.body || '').slice(0, 80)}{(m.body || '').length > 80 ? '…' : ''}</div>
            </div>
            <div className="msg-meta">
              <div>{new Date(m.created_at).toLocaleDateString()}</div>
              <Badge tone={m.channel === 'SMS' ? 'blue' : 'purple'}>{m.channel}</Badge>
              {!m.is_read && (
                <div style={{ marginTop: 4, color: '#167a68', fontWeight: 600, fontSize: 11.5 }}>
                  ● Unread
                </div>
              )}
            </div>
          </div>
        ))}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ padding: 40, textAlign: 'center', color: '#8fa39d', fontSize: 13 }}>
            No messages match your filter. Click <strong>Compose</strong> to send one.
          </p>
        )}
      </Card>

      <ComposeMessageModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleSend}
      />

      {toast && (
        <div className="fd-toast">
          <i className="fas fa-circle-check"></i> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}