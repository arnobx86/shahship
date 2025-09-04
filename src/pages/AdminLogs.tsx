import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, User } from 'lucide-react';

interface ActivityLog {
  id: string;
  changed_by: string;
  booking_id: string;
  old_status: string | null;
  new_status: string;
  notes: string;
  created_at: string;
}

const AdminLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_status_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAdminName = (log: ActivityLog) => {
    return 'Admin User';
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'received_china': 'destructive',
      'processing': 'secondary',
      'on_way_delivery': 'default',
      'on_way_bd_airport': 'outline',
      'received_bd_seaport': 'secondary',
      'completed': 'default'
    };
    return statusVariants[status] || 'default';
  };

  const formatStatus = (status: string) => {
    const statusLabels: Record<string, string> = {
      'received_china': 'Received in China Warehouse',
      'processing': 'Processing for Delivery',
      'on_way_delivery': 'On the way to Delivery',
      'on_way_bd_airport': 'On the way to BD Airport',
      'received_bd_seaport': 'Received in BD Seaport',
      'completed': 'Completed'
    };
    return statusLabels[status] || status;
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
        <h2 className="text-2xl font-bold text-white mb-2">Activity Logs</h2>
        <p className="text-white/70">Track all admin actions and order status changes</p>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id} className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    <Activity className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">
                        {getAdminName(log)}
                      </span>
                      <span className="text-white/70">updated order status</span>
                      <Badge variant="outline" className="text-xs">
                        #{log.booking_id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {log.old_status && (
                        <>
                          <Badge variant={getStatusBadgeVariant(log.old_status)}>
                            {formatStatus(log.old_status)}
                          </Badge>
                          <span className="text-white/40">→</span>
                        </>
                      )}
                      <Badge variant={getStatusBadgeVariant(log.new_status)}>
                        {formatStatus(log.new_status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="h-4 w-4" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-white/40 mb-4" />
            <p className="text-white/70 text-center">No activity logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLogs;