import { AdminSidebar } from './admin-sidebar';

export function AdminShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas-light dark:bg-canvas-dark">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {title && (
          <div className="border-b border-border-light px-8 py-5 dark:border-border-dark">
            <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
          </div>
        )}
        <div className={title ? 'px-8 py-6' : ''}>{children}</div>
      </main>
    </div>
  );
}
