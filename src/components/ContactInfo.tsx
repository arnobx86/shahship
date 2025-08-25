import { Phone, MapPin, Warehouse, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ContactInfo = () => {
  const contactItems = [
    {
      icon: Phone,
      title: 'Call Center',
      content: '+880 1234-567890',
      subtitle: 'Available 24/7 for support'
    },
    {
      icon: MapPin,
      title: 'Head Office',
      content: 'Dhaka, Bangladesh',
      subtitle: 'Gulshan Avenue, Dhaka-1212'
    },
    {
      icon: Warehouse,
      title: 'Warehouses',
      content: 'China & Bangladesh',
      subtitle: 'Secure storage facilities'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Mon - Sat: 9AM - 6PM',
      subtitle: 'Friday: 9AM - 5PM'
    }
  ];

  return (
    <div className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactItems.map((item, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-card transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-maritime-blue">
                {item.title}
              </h3>
              <p className="font-medium text-foreground mb-1">
                {item.content}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.subtitle}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};