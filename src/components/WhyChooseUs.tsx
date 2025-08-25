import { Truck, Shield, DollarSign, Headphones } from 'lucide-react';

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery with express options available for urgent shipments.'
    },
    {
      icon: Shield,
      title: 'Product Security',
      description: 'Advanced security measures and insurance coverage to protect your valuable cargo.'
    },
    {
      icon: DollarSign,
      title: 'Best Pricing',
      description: 'Competitive rates with transparent pricing and no hidden fees or charges.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any shipping concerns.'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-maritime-blue via-primary to-maritime-deep relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Shah Ship?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            We are committed to providing the best shipping experience with 
            unmatched service quality and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all">
                <reason.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};