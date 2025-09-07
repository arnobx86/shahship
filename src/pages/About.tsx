import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Truck, Shield, Clock, Users } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99.9%', label: 'Success Rate' },
    { number: '24/7', label: 'Support' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the safety and security of your shipments with advanced tracking and insurance coverage.'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Fast and reliable delivery times with real-time tracking to keep you informed every step of the way.'
    },
    {
      icon: Truck,
      title: 'Global Network',
      description: 'Extensive shipping network connecting China and Bangladesh with reliable partners worldwide.'
    },
    {
      icon: Users,
      title: 'Customer Care',
      description: '24/7 customer support in multiple languages to assist you with all your shipping needs.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Shah Ship</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Your trusted partner for international shipping between China and Bangladesh. 
            We deliver excellence, reliability, and speed in every shipment.
          </p>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-maritime-blue mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Founded with a vision to bridge the gap between China and Bangladesh, Shah Ship has emerged as a leading 
                logistics company specializing in shipping and cargo services from China to Bangladesh. Since our inception, we have 
                been committed to providing fast, secure, and cost-effective shipping solutions for businesses and individuals.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                With strategically located warehouses in China and Bangladesh, we offer comprehensive end-to-end logistics 
                services including air freight, sea freight, express delivery, and customs clearance. Our experienced team 
                understands the complexities of China-Bangladesh trade and works tirelessly to ensure your cargo reaches its 
                destination safely and on time.
              </p>
              <p className="text-lg leading-relaxed">
                At Shah Ship, we believe in building long-term relationships with our clients through transparency, 
                reliability, and exceptional customer service. Whether you're importing goods for your business or 
                sending personal items, we treat every shipment with the same level of care and attention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-maritime-blue mb-12 text-center">Our Achievements</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-maritime-blue mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-card transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-maritime-blue mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-maritime-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            To revolutionize shipping from China to Bangladesh by providing innovative, reliable, and cost-effective logistics 
            solutions that connect businesses and individuals, fostering trade and commerce 
            between China and Bangladesh.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;