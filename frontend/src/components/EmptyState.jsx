import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, message = 'No records found', description }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      color: 'var(--text-tertiary)',
      textAlign: 'center',
    }}>
      <Icon size={40} strokeWidth={1.2} style={{ marginBottom: 12, opacity: 0.5 }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{message}</p>
      {description && <p style={{ fontSize: '0.8rem', maxWidth: 320 }}>{description}</p>}
    </div>
  );
}
