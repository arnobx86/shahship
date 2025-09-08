import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Package, Users, DollarSign, Activity, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import { AdminPricingManager } from '@/components/AdminPricingManager';
import { AdminOrdersManager } from '@/components/AdminOrdersManager';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  recentActivityCount: number;
  statusBreakdown: Record<string, number>;
  weeklyOrders: number;
  monthlyOrders: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentActivityCount: 0,
    statusBreakdown: {},
    weeklyOrders: 0,
    monthlyOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch all bookings with status breakdown
        const { data: allBookings } = await supabase
          .from('bookings')
          .select('status, created_at, total_charge');

        const totalBookings = allBookings?.length || 0;
        const completedBookings = allBookings?.filter(b => b.status === 'completed').length || 0;
        const pendingBookings = totalBookings - completedBookings;

        // Status breakdown
        const statusBreakdown = allBookings?.reduce((acc, booking) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Weekly orders (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyOrders = allBookings?.filter(b => 
          new Date(b.created_at) >= oneWeekAgo
        ).length || 0;

        // Monthly orders (last 30 days)
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
        const monthlyOrders = allBookings?.filter(b => 
          new Date(b.created_at) >= oneMonthAgo
        ).length || 0;

        // Fetch total customers
        const { count: totalCustomers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        // Calculate total revenue
        const totalRevenue = allBookings?.reduce((sum, booking) => 
          sum + (parseFloat(booking.total_charge?.toString() || '0')), 0) || 0;

        // Fetch recent activity (admin actions in last 7 days)
        const { data: recentActivityData } = await supabase
          .from('admin_actions')
          .select('*')
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        setRecentActivity(recentActivityData || []);

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalCustomers: totalCustomers?.length || 0,
          totalRevenue,
          recentActivityCount: recentActivityData?.length || 0,
          statusBreakdown,
          weeklyOrders,
          monthlyOrders,
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
      title: 'Total Orders',
      value: stats.totalBookings,
      description: 'All time bookings',
      Icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Completed Orders',
      value: stats.completedBookings,
      description: 'Successfully delivered',
      Icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingBookings,
      description: 'Orders in progress',
      Icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      description: 'All time earnings',
      Icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Weekly Orders',
      value: stats.weeklyOrders,
      description: 'Orders in last 7 days',
      Icon: TrendingUp,
      color: 'text-indigo-600',
    },
    {
      title: 'Monthly Orders',
      value: stats.monthlyOrders,
      description: 'Orders in last 30 days',
      Icon: Calendar,
      color: 'text-rose-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      description: 'Registered users',
      Icon: Users,
      color: 'text-cyan-600',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivityCount,
      description: 'Admin actions (7 days)',
      Icon: Activity,
      color: 'text-amber-600',
    },
  ];

  const statusLabels = {
    'placed': 'Order Placed',
    'received_china_warehouse': 'Received in China Warehouse',
    'processing_delivery': 'Processing for Delivery',
    'on_way_delivery': 'On the way to Delivery',
    'on_way_bd_airport': 'On the way to BD Airport',
    'received_bd_seaport': 'Received in BD Seaport',
    'completed': 'Completed'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Shah Ship Admin Dashboard
        </h1>
        <p className="text-gray-300">
          Complete control over shipping operations and business insights
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary">
            Orders Management
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-primary">
            Shipping Charges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-black/20 border-white/10">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : (
              statCards.map((card, index) => (
                <Card key={index} className="bg-black/20 border-white/10 hover:bg-black/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">{card.title}</p>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-xs text-gray-400">{card.description}</p>
                      </div>
                      <card.Icon className={`h-8 w-8 ${card.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Admin Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status Breakdown */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Order Status Breakdown</CardTitle>
                <CardDescription className="text-gray-300">
                  Current distribution of order statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      {statusLabels[status as keyof typeof statusLabels] || status}
                    </span>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Insights */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Business Insights</CardTitle>
                <CardDescription className="text-gray-300">
                  Performance trends and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Weekly Growth</span>
                  <span className="text-sm text-green-400">
                    {stats.weeklyOrders > 0 ? `+${stats.weeklyOrders}` : '0'} orders
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Monthly Growth</span>
                  <span className="text-sm text-green-400">
                    {stats.monthlyOrders > 0 ? `+${stats.monthlyOrders}` : '0'} orders
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Completion Rate</span>
                  <span className="text-sm text-white">
                    {stats.totalBookings > 0 
                      ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Avg Revenue/Order</span>
                  <span className="text-sm text-white">
                    ৳{stats.totalBookings > 0 
                      ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()
                      : '0'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Admin Activity */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Admin Activity</CardTitle>
                <CardDescription className="text-gray-300">
                  Latest administrative actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-4">
                    <Activity className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-black/10 rounded">
                      <Activity className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{activity.action_type}</p>
                        <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrdersManager />
        </TabsContent>

        <TabsContent value="pricing">
          <AdminPricingManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;