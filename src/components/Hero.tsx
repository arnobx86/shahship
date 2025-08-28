import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ship, Plane, ArrowLeftRight, Package } from 'lucide-react';
import heroImage from '@/assets/hero-shipping.jpg';

export const Hero = () => {
  const [shippingMode, setShippingMode] = useState('sea');
  const [fromCountry, setFromCountry] = useState('china');
  const [toCountry, setToCountry] = useState('bangladesh');

  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-maritime-blue/90 via-maritime-blue/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Shah Ship & Shah Tech
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ship Your Cargo from
              <span className="block text-accent">China to Bangladesh</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Experience reliable shipping services from China to Bangladesh with Air, Sea, and Hand Carry options. 
              Real-time tracking, RMB payment support, and competitive pricing.
            </p>
          </div>

          {/* Booking Form */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-hero border-0">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Booking</h2>
                <p className="text-muted-foreground">Get instant shipping quotes</p>
              </div>

              {/* Shipping Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={shippingMode === 'sea' ? 'default' : 'outline'}
                  onClick={() => setShippingMode('sea')}
                  className="flex-1 gap-2"
                >
                  <Ship className="w-4 h-4" />
                  Sea
                </Button>
                 <Button
                  variant={shippingMode === 'air' ? 'default' : 'outline'}
                  onClick={() => setShippingMode('air')}
                  className="flex-1 gap-2"
                >
                  <Plane className="w-4 h-4" />
                  Air
                </Button>
                <Button
                  variant={shippingMode === 'hand-carry' ? 'default' : 'outline'}
                  onClick={() => setShippingMode('hand-carry')}
                  className="flex-1 gap-2"
                >
                  <Package className="w-4 h-4" />
                  Hand Carry
                </Button>
              </div>

              {/* From-To Selector */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <Select value={fromCountry} onValueChange={setFromCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="china">🇨🇳 China</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <Select value={toCountry} onValueChange={setToCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangladesh">🇧🇩 Bangladesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Create Booking Button */}
              <Button 
                variant="hero"
                size="lg" 
                className="w-full shadow-button hover:shadow-lg transition-all"
                asChild
              >
                <a href="/booking">Create Booking</a>
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                No hidden fees • Real-time tracking • RMB payment support
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};