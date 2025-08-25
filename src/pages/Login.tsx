import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to Shah Ship!",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">SS</span>
              </div>
              <h1 className="text-2xl font-bold text-maritime-blue">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                {step === 'phone' ? 'Enter your phone number to continue' : 'Enter verification code'}
              </p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1234-567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  variant="maritime"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Code sent to {phone}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  variant="maritime"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('phone')}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;