import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, MapPin, Mail, MessageCircle, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Center',
      content: '+880 1756-005575',
      subtitle: 'Available 24/7 for support'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@shahship.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Dhaka Office',
      content: '402/02, North Kazipara (Metro Station-এর পাশে)',
      subtitle: 'Section #10, Mirpur, Dhaka'
    },
    {
      icon: MapPin,
      title: 'China Warehouse',
      content: 'No. 23 Hengma Road, Qingyu Village',
      subtitle: 'Xinya Street, Huadu District, Guangzhou'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with all your shipping needs.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
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

      {/* Contact Form */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-maritime-blue mb-4">Send us a Message</h2>
              <p className="text-lg text-muted-foreground">
                Have a question or need assistance? Fill out the form below and we'll get back to you.
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+880 1234-567890"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    variant="maritime" 
                    size="lg" 
                    className="px-8"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Additional Contact Methods */}
      <div className="bg-maritime-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                <p className="text-white/80 mb-4">Quick support via WhatsApp</p>
                <a 
                  href="https://wa.me/8801756005575" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  +880 1756-005575
                </a>
              </div>
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">WeChat</h3>
                <p className="text-white/80 mb-4">Connect via WeChat</p>
                <span className="text-accent font-medium">
                  +86 186 8089 7851
                </span>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                <p className="text-white/80">
                  Mon - Sat: 9AM - 6PM<br />
                  Friday: 9AM - 5PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;