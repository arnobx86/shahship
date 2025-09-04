import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Package, Calendar } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  bookings_count: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Fetch users with their profiles and booking counts
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          bookings(count)
        `)
        .eq('role', 'customer');

      if (error) throw error;

      const customersData = profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.username || 'N/A',
        created_at: profile.created_at,
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
        },
        bookings_count: profile.bookings?.length || 0,
      })) || [];

      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (customer: Customer) => {
    if (customer.profile?.first_name && customer.profile?.last_name) {
      return `${customer.profile.first_name} ${customer.profile.last_name}`;
    }
    if (customer.profile?.username) {
      return customer.profile.username;
    }
    return customer.email.split('@')[0] || 'Unknown User';
  };

  const getInitials = (customer: Customer) => {
    const name = getDisplayName(customer);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Customer Management</h2>
        <p className="text-white/70">View and manage all customer accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={customer.profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    {getInitials(customer)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white text-lg truncate">
                    {getDisplayName(customer)}
                  </CardTitle>
                  <p className="text-white/60 text-sm truncate">
                    {customer.email}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-white/70">
                <Package className="h-4 w-4" />
                <span className="text-sm">{customer.bookings_count} bookings</span>
                <Badge variant="secondary" className="ml-auto">
                  Customer
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-white/40 mb-4" />
            <p className="text-white/70 text-center">No customers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCustomers;