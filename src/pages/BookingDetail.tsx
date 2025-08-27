import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Ship
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

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
    switch (status) {
      case 'placed':
        return 'bg-success text-success-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{booking.booking_id}</h1>
            <p className="text-muted-foreground">{booking.item_name}</p>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)} variant="secondary">
          {getStatusIcon(booking.status)}
          <span className="ml-2 capitalize">{booking.status}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Item Information */}
            <div>
              <h4 className="font-semibold mb-3">Item Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Item Name</p>
                  <p className="font-medium">{booking.item_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{booking.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quantity</p>
                  <p className="font-medium">{booking.total_quantity} pcs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cartons</p>
                  <p className="font-medium">{booking.total_carton}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shipping Information */}
            <div>
              <h4 className="font-semibold mb-3">Shipping Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Method</p>
                  <p className="font-medium capitalize">{booking.shipping_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Method</p>
                  <p className="font-medium capitalize">{booking.delivery_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                  <p className="font-medium">{booking.total_weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Charge</p>
                  <p className="font-medium text-lg">৳{booking.total_charge}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div>
              <h4 className="font-semibold mb-3">Delivery Address</h4>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p>{booking.street}</p>
                  <p>{booking.district}, {booking.city}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(booking.shipping_mark || booking.special_notes) && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Additional Information</h4>
                  {booking.shipping_mark && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Shipping Mark</p>
                      <p className="font-medium">{booking.shipping_mark}</p>
                    </div>
                  )}
                  {booking.special_notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Special Notes</p>
                      <p className="font-medium">{booking.special_notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Tracking Numbers */}
            {booking.tracking_numbers && booking.tracking_numbers.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Tracking Numbers</h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.tracking_numbers.map((trackingNumber, index) => (
                      <Badge key={index} variant="outline">
                        {trackingNumber}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Status & Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Status & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Booking Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {booking.status === 'processing' && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">
                      Your booking is being processed
                    </p>
                  </div>
                </div>
              )}

              {booking.status === 'completed' && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      Successfully delivered
                    </p>
                  </div>
                </div>
              )}

              {booking.status === 'cancelled' && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      Booking was cancelled
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Weight:</span>
                <span className="font-medium">{booking.total_weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity:</span>
                <span className="font-medium">{booking.total_quantity} pcs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cartons:</span>
                <span className="font-medium">{booking.total_carton}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Charge:</span>
                <span className="font-bold text-primary">৳{booking.total_charge}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}