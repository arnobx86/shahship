import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Eye, EyeOff, ArrowLeft, Shield, UserPlus, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAdmin();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', authData.user.id)
          .single();

        if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
          // Sign out the user if they don't have admin role
          await supabase.auth.signOut();
          setError('Access denied. Admin privileges required.');
          return;
        }

        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });

        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      const redirectUrl = `${window.location.origin}/admin`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            role: 'admin'
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user && !authData.session) {
        // Show OTP verification step
        setOtpStep(true);
        toast({
          title: "Verification email sent",
          description: "Please check your email for verification and enter the OTP below.",
        });
      } else if (authData.session) {
        // If auto-confirmed, update the profile role to admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('user_id', authData.user!.id);

        if (profileError) {
          console.error('Error updating profile role:', profileError);
        }

        toast({
          title: "Registration successful",
          description: "Admin account created successfully. You can now access the dashboard.",
        });

        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred during registration');
    } finally {
      setRegistering(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Update the profile role to admin after verification
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('user_id', data.user.id);

        if (profileError) {
          console.error('Error updating profile role:', profileError);
        }

        toast({
          title: "Registration successful",
          description: "Admin account verified successfully. You can now access the dashboard.",
        });

        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('An unexpected error occurred during verification');
    } finally {
      setRegistering(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to main site
        </Link>

        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Shah Ship Admin
            </CardTitle>
            <CardDescription className="text-gray-300">
              Access the administrative dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/10">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/10">
                  Register Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      placeholder="admin@shahship.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-white/50" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {!otpStep ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          placeholder="John"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        placeholder="johndoe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-white">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        placeholder="admin@shahship.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                          placeholder="Create a strong password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/50" />
                          ) : (
                            <Eye className="h-4 w-4 text-white/50" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      disabled={registering}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {registering ? 'Creating Admin Account...' : 'Register Admin'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Mail className="w-8 h-8 text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Verify Your Email</h3>
                      <p className="text-white/70 text-sm mb-6">
                        We've sent a verification email to <span className="text-white font-medium">{email}</span>. 
                        Please enter the 6-digit code from your email.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Verification Code</Label>
                      <div className="flex justify-center">
                        <InputOTP 
                          maxLength={6} 
                          value={otp} 
                          onChange={setOtp}
                          className="text-white"
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="bg-white/5 border-white/10 text-white" />
                            <InputOTPSlot index={1} className="bg-white/5 border-white/10 text-white" />
                            <InputOTPSlot index={2} className="bg-white/5 border-white/10 text-white" />
                            <InputOTPSlot index={3} className="bg-white/5 border-white/10 text-white" />
                            <InputOTPSlot index={4} className="bg-white/5 border-white/10 text-white" />
                            <InputOTPSlot index={5} className="bg-white/5 border-white/10 text-white" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                        {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <Button
                        onClick={handleOtpVerification}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        disabled={registering || otp.length !== 6}
                      >
                        {registering ? 'Verifying...' : 'Verify & Complete Registration'}
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOtpStep(false);
                          setOtp('');
                          setError('');
                        }}
                        className="w-full text-white/70 hover:text-white hover:bg-white/5"
                      >
                        Back to Registration
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;