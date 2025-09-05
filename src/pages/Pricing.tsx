import { Navigation } from '@/components/Navigation';
import { Calculator } from '@/components/Calculator';
import { Footer } from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Shipping Pricing Information
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about our transparent pricing structure and shipping options
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Air Shipping</h3>
              <p className="text-muted-foreground mb-4">Fast delivery in 7-15 days</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Weight-based pricing</li>
                <li>• Starting from ৳720/KG</li>
                <li>• Ideal for urgent shipments</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Sea Shipping</h3>
              <p className="text-muted-foreground mb-4">Cost-effective for bulk orders</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 25-35 days delivery</li>
                <li>• ৳200/KG rate</li>
                <li>• 100KG minimum</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Hand Carry</h3>
              <p className="text-muted-foreground mb-4">Premium express service</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 3-5 days delivery</li>
                <li>• ৳1000/KG rate</li>
                <li>• Personal items & samples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;