import { AdminOrdersManager } from '@/components/AdminOrdersManager';

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Management</h2>
        <p className="text-white/70">Manage all customer orders and update statuses</p>
      </div>
      <AdminOrdersManager />
    </div>
  );
};

export default AdminOrders;