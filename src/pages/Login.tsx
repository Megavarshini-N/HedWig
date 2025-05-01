
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!email.endsWith('@skasc.ac.in')) {
        throw new Error('Please use your university email (@skasc.ac.in)');
      }
      
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left Panel - Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/80 to-secondary/80 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
          <div>
            <h1 className="text-5xl font-bold mb-4">HedWig</h1>
            <p className="text-xl opacity-90">Your campus events companion</p>
          </div>
          <div className="space-y-8">
            <div className="glass p-6 rounded-xl backdrop-blur-lg bg-white/10">
              <p className="text-lg font-medium mb-2">✨ Stay Connected</p>
              <p className="opacity-80">Never miss out on important campus events and activities</p>
            </div>
            <div className="glass p-6 rounded-xl backdrop-blur-lg bg-white/10">
              <p className="text-lg font-medium mb-2">🎓 Made for Students</p>
              <p className="opacity-80">Designed specifically for SKASC students to enhance campus life</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background to-muted/50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* Show logo on mobile */}
            <div className="md:hidden mb-8">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center">
                <span className="text-3xl font-bold">H</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-fade-in">
              HedWig
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your campus events
            </p>
          </div>
          
          <div className="glass-card p-8 backdrop-blur-lg border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  University Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@skasc.ac.in"
                    pattern=".*@skasc\.ac\.in$"
                    title="Please enter your SKASC email address"
                    required
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    @
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-border/30">
            <p className="font-medium mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-2 rounded-lg bg-background/80 hover:bg-background transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Jane"
                  className="w-10 h-10 rounded-full object-cover mb-1 ring-2 ring-primary/20"
                />
                <p className="text-xs font-medium">jane@skasc.ac.in</p>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-background/80 hover:bg-background transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Mike"
                  className="w-10 h-10 rounded-full object-cover mb-1 ring-2 ring-primary/20"
                />
                <p className="text-xs font-medium">mike@skasc.ac.in</p>
              </div>
            </div>
            <p className="mt-4">Any password will work for demo purposes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
