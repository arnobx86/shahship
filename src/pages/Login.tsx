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
import { AlertCircle, Phone, Mail } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        throw error;
      }

      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email}`,
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
        email: email,
        token: otp,
        type: 'email'
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
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-maritime-blue">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                {step === 'email' ? 'Enter your email address to continue' : 'Enter verification code'}
              </p>
              {error && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}
            </div>

            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send you a verification code
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email.trim()}
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
                    Code sent to {email}
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
                  onClick={() => setStep('email')}
                >
                  Change Email Address
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