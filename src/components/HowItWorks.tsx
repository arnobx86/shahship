import { FileText, MapPin, Bell, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      number: '01',
      title: 'Fill Form',
      description: 'Complete our simple booking form with your shipment details and requirements.'
    },
    {
      icon: MapPin,
      number: '02',
      title: 'Track Booking',
      description: 'Get real-time updates on your shipment location and delivery status.'
    },
    {
      icon: Bell,
      number: '03',
      title: 'Get Updates',
      description: 'Receive notifications via SMS and email about your shipment progress.'
    },
    {
      icon: CreditCard,
      number: '04',
      title: 'Complete Payment',
      description: 'Secure payment options available. Pay online or cash on delivery.'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              How Shah Ship Works
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our streamlined process makes shipping from China to Bangladesh simple and transparent. 
              Follow these easy steps to get your cargo delivered safely.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center relative group-hover:scale-105 transition-transform">
                      <step.icon className="w-7 h-7 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Video Player */}
          <div className="lg:pl-8">
            <div className="relative bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-maritime-blue/90 to-accent/90"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Watch Our Process</h3>
                  <p className="text-white/80">See how we handle your cargo with care</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Learn more about our secure shipping process and quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};