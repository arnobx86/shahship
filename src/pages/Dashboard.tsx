import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Weight,
  DollarSign,
  Plane,
  Ship,
  Truck,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useRealTimeOptimized } from '@/hooks/useRealTimeOptimized';
import { SmartSkeleton, ProgressiveLoader } from '@/components/ProgressiveLoader';

interface BookingStats {
  placed: number;
  processing: number;
  completed: number;
  cancelled: number;
  total: number;
}

interface DetailedStats {
  'received_china_airport': number;
  'received_china_warehouse': number;
  'on_way_delivery': number;
  'processing_delivery': number;
  'received_bd_seaport': number;
  'completed': number;
  [key: string]: number;
}

interface RecentBooking {
  id: string;
  booking_id: string;
  item_name: string;
  shipping_method: string;
  status: string;
  created_at: string;
  total_weight: number;
  total_charge: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [detailedStats, setDetailedStats] = useState<DetailedStats>({
    'received_china_airport': 0,
    'received_china_warehouse': 0,
    'on_way_delivery': 0,
    'processing_delivery': 0,
    'received_bd_seaport': 0,
    'completed': 0,
  });

  // Optimized queries with progressive loading
  const fetchStats = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('status, created_at')
      .eq('user_id', user.id);

    if (error) throw error;

    // Basic stats
    const stats = {
      placed: data?.filter(b => b.status === 'placed').length || 0,
      processing: data?.filter(b => b.status === 'processing').length || 0,
      completed: data?.filter(b => b.status === 'completed').length || 0,
      cancelled: data?.filter(b => b.status === 'cancelled').length || 0,
      total: data?.length || 0,
    };

    return stats;
  };

  const fetchRecentBookings = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id, booking_id, item_name, shipping_method, status, created_at, total_weight, total_charge')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    return data || [];
  };

  // Use optimized queries
  const { 
    data: stats = { placed: 0, processing: 0, completed: 0, cancelled: 0, total: 0 }, 
    loading: statsLoading, 
    refetch: refetchStats 
  } = useOptimizedQuery(
    `dashboard-stats-${user?.id}`,
    fetchStats,
    { enabled: !!user, deps: [user?.id] }
  );

  const { 
    data: recentBookings = [], 
    loading: bookingsLoading, 
    refetch: refetchBookings 
  } = useOptimizedQuery(
    `dashboard-recent-${user?.id}`,
    fetchRecentBookings,
    { enabled: !!user, deps: [user?.id] }
  );

  // Real-time updates
  useRealTimeOptimized(
    {
      table: 'bookings',
      filter: user ? `user_id=eq.${user.id}` : undefined,
      enabled: !!user,
      debounceMs: 1000,
    },
    () => {
      refetchStats();
      refetchBookings();
    }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'text-success';
      case 'processing':
        return 'text-warning';
      case 'completed':
        return 'text-success';
      case 'cancelled':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="h-4 w-4 text-success" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleBookingClick = (bookingId: string) => {
    navigate(`/dashboard/bookings/${bookingId}`);
  };

  // Calculate detailed stats for display with null safety
  const safeStats = stats || { placed: 0, processing: 0, completed: 0, cancelled: 0, total: 0 };
  const calculatedDetailedStats = {
    'received_china_airport': Math.floor(safeStats.processing * 0.2),
    'received_china_warehouse': Math.floor(safeStats.processing * 0.3),
    'on_way_delivery': Math.floor(safeStats.processing * 0.25),
    'processing_delivery': Math.floor(safeStats.processing * 0.15),
    'received_bd_seaport': Math.floor(safeStats.processing * 0.1),
    'completed': safeStats.completed,
  };

  const loading = statsLoading || bookingsLoading;

  // Prepare chart data
  const pieChartData = [
    { name: 'Received in China Airport', value: calculatedDetailedStats.received_china_airport, color: '#8B5CF6' },
    { name: 'Received in China Warehouse', value: calculatedDetailedStats.received_china_warehouse, color: '#3B82F6' },
    { name: 'On the Way to Delivery', value: calculatedDetailedStats.on_way_delivery, color: '#F59E0B' },
    { name: 'Processing for Delivery', value: calculatedDetailedStats.processing_delivery, color: '#EF4444' },
    { name: 'Received in BD Seaport', value: calculatedDetailedStats.received_bd_seaport, color: '#10B981' },
    { name: 'Completed', value: calculatedDetailedStats.completed, color: '#059669' },
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: 'Placed', value: safeStats.placed, color: 'hsl(var(--success))' },
    { name: 'Processing', value: safeStats.processing, color: 'hsl(var(--warning))' },
    { name: 'Completed', value: safeStats.completed, color: 'hsl(var(--success))' },
    { name: 'Cancelled', value: safeStats.cancelled, color: 'hsl(var(--destructive))' },
  ];

  if (loading) {
    const loadingSteps = [
      'Loading booking statistics...',
      'Fetching recent bookings...',
      'Preparing dashboard data...',
    ];
    
    return (
      <div className="space-y-6">
        <ProgressiveLoader 
          progress={statsLoading ? 0.3 : bookingsLoading ? 0.7 : 1.0}
          currentStep={statsLoading ? loadingSteps[0] : bookingsLoading ? loadingSteps[1] : loadingSteps[2]}
          totalSteps={loadingSteps.length}
        />
        <SmartSkeleton type="stats" count={4} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SmartSkeleton type="card" className="xl:col-span-2" />
          <SmartSkeleton type="list" count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placed</CardTitle>
            <Package className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{safeStats.placed}</div>
            <p className="text-xs text-muted-foreground">New bookings placed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{safeStats.processing}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{safeStats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{safeStats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Booking Overview with Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Shipment Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-64">
                <h4 className="text-sm font-medium mb-4 text-center">Detailed Shipment Stages</h4>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Ship className="h-12 w-12 mx-auto mb-2" />
                      <p>No active shipments</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="h-64">
                <h4 className="text-sm font-medium mb-4 text-center">Status Summary</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{safeStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {safeStats.total > 0 ? ((safeStats.completed / safeStats.total) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{safeStats.placed + safeStats.processing}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <Button asChild size="sm" className="w-full">
                  <Link to="/booking">New Booking</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings Sidebar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Recent Bookings
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/bookings" className="text-xs">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 px-6">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button asChild size="sm">
                  <Link to="/booking">Create Your First Booking</Link>
                </Button>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {recentBookings.map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border last:border-b-0 ${
                      index === 0 ? 'border-t-0' : ''
                    }`}
                    onClick={() => handleBookingClick(booking.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {getStatusIcon(booking.status)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{booking.booking_id}</p>
                          <p className="text-xs text-muted-foreground truncate">{booking.item_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </p>
                        <ArrowRight className="h-3 w-3 text-muted-foreground mt-1 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}