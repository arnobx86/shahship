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
  const [stats, setStats] = useState<BookingStats>({
    placed: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });
  const [detailedStats, setDetailedStats] = useState<DetailedStats>({
    'received_china_airport': 0,
    'received_china_warehouse': 0,
    'on_way_delivery': 0,
    'processing_delivery': 0,
    'received_bd_seaport': 0,
    'completed': 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      // Basic stats
      const newStats = {
        placed: data?.filter(b => b.status === 'placed').length || 0,
        processing: data?.filter(b => b.status === 'processing').length || 0,
        completed: data?.filter(b => b.status === 'completed').length || 0,
        cancelled: data?.filter(b => b.status === 'cancelled').length || 0,
        total: data?.length || 0,
      };

      // Detailed shipment stages (simulated for demo - in real app these would be separate status values)
      const newDetailedStats = {
        'received_china_airport': Math.floor(newStats.processing * 0.2),
        'received_china_warehouse': Math.floor(newStats.processing * 0.3),
        'on_way_delivery': Math.floor(newStats.processing * 0.25),
        'processing_delivery': Math.floor(newStats.processing * 0.15),
        'received_bd_seaport': Math.floor(newStats.processing * 0.1),
        'completed': newStats.completed,
      };

      setStats(newStats);
      setDetailedStats(newDetailedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch booking statistics',
        variant: 'destructive',
      });
    }
  };

  const fetchRecentBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, booking_id, item_name, shipping_method, status, created_at, total_weight, total_charge')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      setRecentBookings(data || []);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recent bookings',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentBookings()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchStats();
          fetchRecentBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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

  // Prepare chart data
  const pieChartData = [
    { name: 'Received in China Airport', value: detailedStats.received_china_airport, color: '#8B5CF6' },
    { name: 'Received in China Warehouse', value: detailedStats.received_china_warehouse, color: '#3B82F6' },
    { name: 'On the Way to Delivery', value: detailedStats.on_way_delivery, color: '#F59E0B' },
    { name: 'Processing for Delivery', value: detailedStats.processing_delivery, color: '#EF4444' },
    { name: 'Received in BD Seaport', value: detailedStats.received_bd_seaport, color: '#10B981' },
    { name: 'Completed', value: detailedStats.completed, color: '#059669' },
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: 'Placed', value: stats.placed, color: 'hsl(var(--success))' },
    { name: 'Processing', value: stats.processing, color: 'hsl(var(--warning))' },
    { name: 'Completed', value: stats.completed, color: 'hsl(var(--success))' },
    { name: 'Cancelled', value: stats.cancelled, color: 'hsl(var(--destructive))' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <div className="text-2xl font-bold text-success">{stats.placed}</div>
            <p className="text-xs text-muted-foreground">New bookings placed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.cancelled}</div>
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
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{stats.placed + stats.processing}</p>
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