import { Ship, MousePointer, MapPin, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const Features = () => {
  const features = [
    {
      icon: Ship,
      title: 'Air/Sea Shipment',
      description: 'Choose between air and sea freight options based on your budget and timeline requirements.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: MousePointer,
      title: 'Easy Booking',
      description: 'Simple online booking system with instant quotes and transparent pricing for all routes.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      description: 'Real-time GPS tracking of your shipments with detailed status updates and notifications.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Zap,
      title: 'Express Delivery',
      description: 'Fast delivery options available for urgent shipments with guaranteed delivery times.',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive shipping solutions with advanced features 
            to ensure your cargo reaches its destination safely and on time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-2 group border-0 bg-gradient-card"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};