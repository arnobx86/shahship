import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ContactInfo } from '@/components/ContactInfo';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Calculator } from '@/components/Calculator';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ContactInfo />
      <HowItWorks />
      <Features />
      <WhyChooseUs />
      <Calculator />
      <Footer />
    </div>
  );
};

export default Index;
