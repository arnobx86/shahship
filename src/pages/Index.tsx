import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ContactInfo } from '@/components/ContactInfo';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Calculator } from '@/components/Calculator';
import { RMBPayment } from '@/components/RMBPayment';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users to dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ContactInfo />
      <HowItWorks />
      <Features />
      <WhyChooseUs />
      <RMBPayment />
      <Calculator />
      <Footer />
    </div>
  );
};

export default Index;
