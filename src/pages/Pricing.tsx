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
            Shipping Cost Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your shipping costs instantly with our transparent pricing tool
          </p>
        </div>
      </div>
      <Calculator />
      <Footer />
    </div>
  );
};

export default Pricing;