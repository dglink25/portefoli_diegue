import { AdminSidebar } from './admin-sidebar';

export function AdminShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {title && (
          <div style={{ borderBottom: '1px solid var(--c-border)', padding: '1.25rem 2rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-ink)' }}>
              {title}
            </h1>
          </div>
        )}
        <div style={{ padding: title ? '1.5rem 2rem' : '0' }}>{children}</div>
      </main>
    </div>
  );
}
