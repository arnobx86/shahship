import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-white/10 px-6 bg-black/20 backdrop-blur-sm">
            <SidebarTrigger className="mr-4 text-white hover:bg-white/10" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white">
                Shah Ship Admin Dashboard
              </h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}