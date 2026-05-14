import { useState, useEffect, useCallback } from 'react';
import { notificationService, type NotificationItem } from '../services/notificationService';
import PageTransition from '../components/layout/PageTransition';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE': return '❤️';
      case 'COMMENT': return '💬';
      case 'FOLLOW': return '👤';
      case 'MENTION': return '🏷️';
      default: return '🔔';
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: 'var(--content-pad)', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 900, color: 'var(--text-primary)' }}>Notifications</h1>
          <button 
            onClick={handleMarkAllRead}
            style={{ 
              background: 'none', border: 'none', color: 'var(--crimson)', 
              fontSize: 13, fontWeight: 700, cursor: 'pointer' 
            }}
          >
            Mark all as read
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading notifications...</div>
          ) : notifications.length > 0 ? (
            notifications.map(n => (
              <div 
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                style={{
                  padding: '16px 20px', borderRadius: 'var(--r-lg)',
                  background: n.isRead ? 'var(--surface)' : 'rgba(166, 25, 46, 0.04)',
                  border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(166, 25, 46, 0.1)'}`,
                  display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', position: 'relative'
                }}
              >
                {!n.isRead && (
                  <div style={{ 
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--crimson)'
                  }} />
                )}
                <div style={{ fontSize: 24 }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', 
                    fontWeight: n.isRead ? 500 : 700, marginBottom: 4 
                  }}>
                    {n.content}
                  </p>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ fontWeight: 600 }}>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
