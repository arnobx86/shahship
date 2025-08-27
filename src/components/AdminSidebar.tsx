import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield, 
  LayoutDashboard, 
  DollarSign, 
  Package, 
  Users, 
  LogOut,
  Activity
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Pricing Management', url: '/admin/pricing', icon: DollarSign },
  { title: 'Order Management', url: '/admin/orders', icon: Package },
  { title: 'Customer Management', url: '/admin/customers', icon: Users },
  { title: 'Activity Logs', url: '/admin/logs', icon: Activity },
];

export function AdminSidebar() {
  const { profile, user } = useAdmin();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of the admin panel.",
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setIsSigningOut(false);
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.username) {
      return profile.username;
    }
    return user?.email?.split('@')[0] || 'Admin User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
      isActive ? 'bg-white/10 text-white' : ''
    }`;
  };

  return (
    <Sidebar
      variant="sidebar"
      className={`border-r border-white/10 bg-black/20 backdrop-blur-sm ${
        state === 'collapsed' ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {state !== 'collapsed' && (
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-white/60">Shah Ship</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {state !== 'collapsed' && (
          <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        )}

        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={getNavLinkClass(item.url)}
                onClick={() => navigate(item.url)}
              >
                <item.icon className="h-5 w-5" />
                {state !== 'collapsed' && <span>{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full justify-start text-white/70 hover:text-white hover:bg-red-500/10 hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          {state !== 'collapsed' && (
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}