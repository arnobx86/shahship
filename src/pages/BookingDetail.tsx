import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  MapPin,
  Truck,
  Calendar,
  Weight,
  DollarSign,
  FileText,
  Ship,
  User,
  MessageSquare,
  Camera,
  History,
  Box,
  Route,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BookingDetail {
  id: string;
  booking_id: string;
  item_name: string;
  category: string;
  shipping_method: string;
  delivery_method: string;
  status: string;
  total_carton: number;
  total_quantity: number;
  total_weight: number;
  total_charge: number;
  street: string;
  district: string;
  city: string;
  shipping_mark: string | null;
  special_notes: string | null;
  tracking_numbers: string[] | null;
  created_at: string;
  updated_at: string;
}

interface StatusLog {
  id: string;
  status: string;
  updated_by: string;
  updated_at: string;
  notes?: string;
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [statusLogs] = useState<StatusLog[]>([
    {
      id: '1',
      status: 'placed',
      updated_by: 'System',
      updated_at: new Date().toISOString(),
      notes: 'Booking created successfully'
    },
    {
      id: '2', 
      status: 'processing',
      updated_by: 'Admin',
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Processing started at warehouse'
    }
  ]);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking detail:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch booking details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [user, id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'processing for delivery':
        return 'bg-orange-100 text-orange-800';
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'received in china airport':
      case 'received in china warehouse':
      case 'received in bd seaport':
        return 'bg-slate-100 text-slate-800';
      case 'on the way to delivery':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShippingRoute = (city: string) => {
    // Mock route logic - in real app this would come from backend
    const routes: Record<string, string> = {
      'Guangzhou': 'Guangzhou',
      'Shanghai': 'Shanghai',
      'Beijing': 'Beijing',
      'Shenzhen': 'Shenzhen'
    };
    return routes[city] || 'Guangzhou';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
        <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{booking.booking_id}</h1>
            <p className="text-muted-foreground">{booking.item_name}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(booking.status)} border-0`}>
          {getStatusIcon(booking.status)}
          <span className="ml-2 capitalize">{booking.status}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information & Shipment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-semibold text-lg">{booking.booking_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-medium">
                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge className={`${getStatusColor(booking.status)} border-0 mt-1`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Method</p>
                  <p className="font-medium capitalize">{booking.delivery_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{booking.street}</p>
                      <p>{booking.district}, {booking.city}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grand Total</p>
                  <p className="font-bold text-xl text-primary">৳{booking.total_charge}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-primary" />
                  Shipment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Method - Highlighted */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Method</p>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-lg px-3 py-1">
                        {booking.shipping_method.includes('air') ? '✈️ Air Freight' : '🚢 Sea Freight'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Shipping Route - Highlighted */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Route className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Route</p>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-lg px-3 py-1">
                        📍 {getShippingRoute(booking.city)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Shipping Charge - Highlighted */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Charge</p>
                      <p className="font-bold text-2xl text-green-700">৳{(booking.total_charge * 0.8).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Mark - If available */}
                {booking.shipping_mark && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Shipping Mark</p>
                        <p className="font-semibold text-amber-800 text-lg">{booking.shipping_mark}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking Numbers - Highlighted */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Tracking Numbers</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.tracking_numbers && booking.tracking_numbers.length > 0 ? (
                          booking.tracking_numbers.map((trackingNumber, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="bg-purple-100 text-purple-800 border-purple-300 text-sm px-3 py-1 font-mono"
                            >
                              {trackingNumber}
                            </Badge>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm italic">Tracking numbers will be assigned once shipment is processed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Item Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Details</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Booked</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Received</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{booking.item_name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{booking.category}</p>
                        </div>
                      </td>
                      <td className="text-right py-3">-</td>
                      <td className="text-right py-3">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">
                        <p className="font-medium">Number of Cartons</p>
                      </td>
                      <td className="text-right py-3 font-medium">{booking.total_carton}</td>
                      <td className="text-right py-3 font-medium text-green-600">{booking.total_carton}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">
                        <p className="font-medium">Quantity (pcs)</p>
                      </td>
                      <td className="text-right py-3 font-medium">{booking.total_quantity}</td>
                      <td className="text-right py-3 font-medium text-green-600">{booking.total_quantity}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">
                        <p className="font-medium">Total Weight (KG)</p>
                      </td>
                      <td className="text-right py-3 font-medium">{booking.total_weight}</td>
                      <td className="text-right py-3 font-medium text-green-600">{booking.total_weight}</td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <p className="font-medium">CBM (Cubic Meter)</p>
                      </td>
                      <td className="text-right py-3 font-medium">{(booking.total_weight * 0.001).toFixed(3)}</td>
                      <td className="text-right py-3 font-medium text-green-600">{(booking.total_weight * 0.001).toFixed(3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Supporting Panels */}
        <div className="space-y-6">
          
          {/* Quality Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No images uploaded yet</p>
            </CardContent>
          </Card>

          {/* Booking Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Booking Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.special_notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Customer Note</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{booking.special_notes}</p>
                </div>
              )}
              <div className="space-y-2">
                <Textarea 
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <Button size="sm" className="w-full" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Status Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusLogs.map((log, index) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm capitalize">{log.status}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">by {log.updated_by}</p>
                    {log.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>
                    )}
                  </div>
                  {index < statusLogs.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-6 bg-border -ml-0.25"></div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Grand Total</span>
                  <span className="font-semibold">৳{booking.total_charge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">৳{(booking.total_charge * 0.7).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Due Balance</span>
                  <div className="text-right">
                    <span className="font-bold text-lg text-orange-600">
                      ৳{(booking.total_charge * 0.3).toFixed(2)}
                    </span>
                    {booking.total_charge * 0.3 > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-orange-600" />
                        <span className="text-xs text-orange-600">Payment pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}