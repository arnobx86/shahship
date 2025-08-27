import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Phone } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  // Validate Bangladesh phone number (10-11 digits after +880)
  const validateBangladeshPhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validateBangladeshPhone(phone)) {
      setError('Phone number must be 10-11 digits');
      return;
    }
    
    setLoading(true);
    const fullPhone = `+880${phone}`;
    setFullPhoneNumber(fullPhone);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
        options: {
          channel: 'sms',
        }
      });

      if (error) {
        throw error;
      }

      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${fullPhone}`,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (otp.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login Successful",
        description: "Welcome to Shah Ship!",
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Invalid verification code. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Invalid verification code. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-maritime-blue">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                {step === 'phone' ? 'Enter your Bangladesh phone number to continue' : 'Enter verification code'}
              </p>
              {error && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}
            </div>

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone">Bangladesh Phone Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-muted-foreground text-sm">+880</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1712345678"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          setPhone(value);
                        }
                      }}
                      className="pl-16"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter 10-11 digits (without country code)
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !phone.trim()}
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setOtp(value);
                      }
                    }}
                    maxLength={6}
                    className="text-center text-lg tracking-wider"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Code sent to +880{phone}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || otp.length !== 6}
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