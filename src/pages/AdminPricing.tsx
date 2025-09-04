import { AdminPricingManager } from '@/components/AdminPricingManager';

const AdminPricing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Pricing Management</h2>
        <p className="text-white/70">Manage shipping categories and pricing structure</p>
      </div>
      <AdminPricingManager />
    </div>
  );
};

export default AdminPricing;