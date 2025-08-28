import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Clock, CheckCircle } from 'lucide-react';

export const RMBPayment = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Easy RMB Payments',
      description: 'Pay for your Chinese suppliers directly through our secure payment system.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Bank-level security ensures your payments are protected at all times.'
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick payment processing to keep your business moving forward.'
    },
    {
      icon: CheckCircle,
      title: 'Reliable Service',
      description: 'Trusted by businesses across Bangladesh for hassle-free payments.'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            RMB Payment Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shahship provides a simple, fast, and reliable RMB payment service for buyers. 
            Pay your Chinese suppliers with confidence through our secure payment system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Using RMB Payments?
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact us to learn more about our RMB payment solutions and how we can help streamline your business transactions.
            </p>
            <Button size="lg" className="px-8">
              Contact Us
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};