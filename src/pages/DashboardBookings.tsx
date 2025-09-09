import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Package, 
  Search, 
  Filter,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useOptimizedQuery, useDebounce } from '@/hooks/useOptimizedQuery';
import { useRealTimeOptimized } from '@/hooks/useRealTimeOptimized';

interface Booking {
  id: string;
  booking_id: string;
  item_name: string;
  category: string;
  shipping_method: string;
  delivery_method: string;
  total_weight: number;
  total_charge: number;
  status: string;
  district: string;
  city: string;
  tracking_numbers: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function DashboardBookings() {
  const { user } = useAuth();
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [bookingIdFilter, setBookingIdFilter] = useState('');
  const [trackingFilter, setTrackingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Debounce filter inputs
  const debouncedBookingId = useDebounce(bookingIdFilter, 300);
  const debouncedTracking = useDebounce(trackingFilter, 300);

  // Optimized query for bookings
  const fetchBookings = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id, booking_id, item_name, category, shipping_method, delivery_method, total_weight, total_charge, status, district, city, tracking_numbers, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const { data: bookings = [], loading, error, refetch } = useOptimizedQuery(
    `bookings-${user?.id}`,
    fetchBookings,
    { 
      enabled: !!user,
      deps: [user?.id],
      cacheTime: 60000 // 1 minute cache
    }
  );

  // Real-time updates
  useRealTimeOptimized(
    {
      table: 'bookings',
      filter: user ? `user_id=eq.${user.id}` : undefined,
      enabled: !!user,
      debounceMs: 500,
    },
    refetch
  );

  useEffect(() => {
    // Ensure bookings is always an array
    const safeBookings = bookings || [];
    let filtered = safeBookings;

    // Filter by booking ID
    if (debouncedBookingId) {
      filtered = filtered.filter((booking) =>
        booking.booking_id.toLowerCase().includes(debouncedBookingId.toLowerCase())
      );
    }

    // Filter by tracking number
    if (debouncedTracking) {
      filtered = filtered.filter((booking) =>
        booking.tracking_numbers?.some(tracking =>
          tracking.toLowerCase().includes(debouncedTracking.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, debouncedBookingId, debouncedTracking, statusFilter]);

  // Handle errors
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch bookings',
      variant: 'destructive',
    });
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'processing':
      case 'processing for delivery':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
      case 'placed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
      case 'received in china airport':
      case 'received in china warehouse':
      case 'received in bd seaport':
        return 'bg-slate-100 text-slate-800 hover:bg-slate-100/80';
      case 'on the way to delivery':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
    }
  };

  const getMethodBadge = (method: string) => {
    const isAir = method.toLowerCase().includes('air');
    return isAir 
      ? 'bg-sky-100 text-sky-800 hover:bg-sky-100/80'
      : 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Bookings</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link to="/booking">Create New Booking</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Booking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="processing for delivery">Processing for Delivery</SelectItem>
                <SelectItem value="received in china airport">Received in China Airport</SelectItem>
                <SelectItem value="received in china warehouse">Received in China Warehouse</SelectItem>
                <SelectItem value="on the way to delivery">On the Way to Delivery</SelectItem>
                <SelectItem value="received in bd seaport">Received in BD Seaport</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Booking ID"
              value={bookingIdFilter}
              onChange={(e) => setBookingIdFilter(e.target.value)}
            />
            
            <Input
              placeholder="Tracking Number"
              value={trackingFilter}
              onChange={(e) => setTrackingFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {(bookings || []).length === 0 ? 'No bookings found' : 'No bookings match your filters'}
            </p>
            <Button asChild>
              <Link to="/booking">Create Your First Booking</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link 
                          to={`/dashboard/bookings/${booking.id}`}
                          className="text-primary hover:underline"
                        >
                          {booking.booking_id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getMethodBadge(booking.shipping_method)}
                        >
                          {booking.shipping_method.includes('air') ? 'Air' : 'Sea'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80">
                          {booking.city}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeClass(booking.status)}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          <Link to={`/dashboard/bookings/${booking.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}