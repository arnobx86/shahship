import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Eye, RefreshCw, Clock, Package, Truck, Plane, Ship, CheckCircle } from 'lucide-react';

interface Booking {
  id: string;
  booking_id: string;
  user_id: string;
  item_name: string;
  category: string;
  total_weight: number;
  total_quantity: number;
  total_carton: number;
  total_charge: number;
  shipping_method: string;
  delivery_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  } | null;
}

interface StatusHistoryItem {
  id: string;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  } | null;
}

export const AdminOrdersManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  const statusOptions = [
    { value: 'placed', label: 'Order Placed', icon: Package, color: 'bg-blue-500' },
    { value: 'received_china_warehouse', label: 'Received in China Warehouse', icon: Package, color: 'bg-yellow-500' },
    { value: 'processing_delivery', label: 'Processing for Delivery', icon: RefreshCw, color: 'bg-orange-500' },
    { value: 'on_way_delivery', label: 'On the way to Delivery', icon: Truck, color: 'bg-purple-500' },
    { value: 'on_way_bd_airport', label: 'On the way to BD Airport', icon: Plane, color: 'bg-indigo-500' },
    { value: 'received_bd_seaport', label: 'Received in BD Seaport', icon: Ship, color: 'bg-teal-500' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-500' },
  ];

  const [editFormData, setEditFormData] = useState({
    item_name: '',
    category: '',
    total_weight: '',
    total_quantity: '',
    total_carton: '',
    total_charge: '',
    shipping_method: '',
    delivery_method: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as any) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusHistory = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('booking_status_history')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStatusHistory((data as any) || []);
    } catch (error) {
      console.error('Error fetching status history:', error);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      item_name: booking.item_name,
      category: booking.category,
      total_weight: booking.total_weight.toString(),
      total_quantity: booking.total_quantity.toString(),
      total_carton: booking.total_carton.toString(),
      total_charge: booking.total_charge.toString(),
      shipping_method: booking.shipping_method,
      delivery_method: booking.delivery_method,
    });
    setIsEditDialogOpen(true);
  };

  const handleStatusUpdate = async (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNotes('');
    await fetchStatusHistory(booking.id);
    setIsStatusDialogOpen(true);
  };

  const saveBookingChanges = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          item_name: editFormData.item_name,
          category: editFormData.category,
          total_weight: parseFloat(editFormData.total_weight),
          total_quantity: parseInt(editFormData.total_quantity),
          total_carton: parseInt(editFormData.total_carton),
          total_charge: parseFloat(editFormData.total_charge),
          shipping_method: editFormData.shipping_method,
          delivery_method: editFormData.delivery_method,
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });

      setIsEditDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const updateBookingStatus = async () => {
    if (!selectedBooking || newStatus === selectedBooking.status) return;

    try {
      const { error } = await supabase.rpc('update_booking_status', {
        p_booking_id: selectedBooking.id,
        p_new_status: newStatus,
        p_notes: statusNotes || null,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });

      setIsStatusDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return <Badge variant="secondary">{status}</Badge>;

    const Icon = statusOption.icon;
    return (
      <Badge className={`${statusOption.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusOption.label}
      </Badge>
    );
  };

  const getCustomerName = (booking: Booking) => {
    const profile = booking.profiles;
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile?.username || 'Unknown Customer';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders Management</h2>
          <p className="text-gray-300">View, edit, and manage all customer orders</p>
        </div>
        <Button onClick={fetchBookings} variant="outline" className="text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>
          <CardDescription className="text-gray-300">
            Complete list of customer orders with management options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-300">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Order ID</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Item</TableHead>
                    <TableHead className="text-gray-300">Weight</TableHead>
                    <TableHead className="text-gray-300">Charge</TableHead>
                    <TableHead className="text-gray-300">Method</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-white/10">
                      <TableCell className="text-white font-mono">
                        {booking.booking_id}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {getCustomerName(booking)}
                      </TableCell>
                      <TableCell className="text-white">
                        {booking.item_name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {booking.total_weight} KG
                      </TableCell>
                      <TableCell className="text-white">
                        ৳{booking.total_charge.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {booking.shipping_method}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBooking(booking)}
                            className="text-white border-white/10 hover:bg-white/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking)}
                            className="text-primary border-primary/30 hover:bg-primary/10"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Order Details</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update order information and pricing
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Item Name</Label>
              <Input
                value={editFormData.item_name}
                onChange={(e) => setEditFormData({ ...editFormData, item_name: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Category</Label>
              <Input
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Weight (KG)</Label>
              <Input
                type="number"
                value={editFormData.total_weight}
                onChange={(e) => setEditFormData({ ...editFormData, total_weight: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Quantity</Label>
              <Input
                type="number"
                value={editFormData.total_quantity}
                onChange={(e) => setEditFormData({ ...editFormData, total_quantity: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Cartons</Label>
              <Input
                type="number"
                value={editFormData.total_carton}
                onChange={(e) => setEditFormData({ ...editFormData, total_carton: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Total Charge</Label>
              <Input
                type="number"
                value={editFormData.total_charge}
                onChange={(e) => setEditFormData({ ...editFormData, total_charge: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Shipping Method</Label>
              <Select
                value={editFormData.shipping_method}
                onValueChange={(value) => setEditFormData({ ...editFormData, shipping_method: value })}
              >
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="Air">Air</SelectItem>
                  <SelectItem value="Sea">Sea</SelectItem>
                  <SelectItem value="Hand Carry">Hand Carry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Delivery Method</Label>
              <Select
                value={editFormData.delivery_method}
                onValueChange={(value) => setEditFormData({ ...editFormData, delivery_method: value })}
              >
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="Home Delivery">Home Delivery</SelectItem>
                  <SelectItem value="Office Collection">Office Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBookingChanges} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Update Order Status</DialogTitle>
            <DialogDescription className="text-gray-300">
              Change order status and view status history
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Notes (Optional)</Label>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status change..."
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Status History</Label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {statusHistory.map((history) => (
                  <div key={history.id} className="bg-black/10 p-3 rounded border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">
                        {history.old_status || 'Initial'} → {history.new_status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(history.created_at).toLocaleString()}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="text-sm text-gray-300">{history.notes}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Changed by: {history.profiles?.first_name || history.profiles?.username || 'Admin'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateBookingStatus} 
              className="bg-primary hover:bg-primary/90"
              disabled={newStatus === selectedBooking?.status}
            >
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};