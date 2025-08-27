import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  recentActivityCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentActivityCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch bookings stats
        const { data: bookings } = await supabase
          .from('bookings')
          .select('status, total_charge');

        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === 'placed' || b.status === 'processing').length || 0;
        const totalRevenue = bookings?.reduce((sum, b) => sum + (parseFloat(String(b.total_charge)) || 0), 0) || 0;

        // Fetch customers count
        const { count: totalCustomers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        // Fetch recent activity count
        const { count: recentActivityCount } = await supabase
          .from('admin_actions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        setStats({
          totalBookings,
          pendingBookings,
          totalCustomers: totalCustomers || 0,
          totalRevenue,
          recentActivityCount: recentActivityCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      description: 'All time bookings',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingBookings,
      description: 'Requiring attention',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      description: 'Registered users',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: 'All time earnings',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivityCount,
      description: 'Last 7 days',
      icon: Activity,
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-8 bg-white/10 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-white/10 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/70">
          Welcome to the Shah Ship admin dashboard. Here's what's happening with your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <p className="text-xs text-white/60">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-white/70">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Review Pending Orders</p>
                  <p className="text-white/60 text-sm">{stats.pendingBookings} orders need attention</p>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Update Pricing</p>
                  <p className="text-white/60 text-sm">Manage shipping rates</p>
                </div>
              </div>
            </button>
            <button className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">View Customers</p>
                  <p className="text-white/60 text-sm">Manage user accounts</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
            <CardDescription className="text-white/70">
              Platform health and metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white/90">Database</span>
              </div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white/90">Authentication</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white/90">API Services</span>
              </div>
              <span className="text-green-400 text-sm">Running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}