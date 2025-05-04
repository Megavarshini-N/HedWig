
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/lovable-uploads/757930e2-55da-4a6b-bff7-f1af6718080f.png')] bg-cover bg-center">
      {/* Login Container */}
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-black/50 shadow-xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-fade-in">
            HedWig
          </h1>
          <p className="text-white/80">
            Sign in to access your campus events
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">
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
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                @
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-white">
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
                className="pr-10 bg-white/10 border-white/20 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
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
            <span className="text-white/70">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-white/70 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
          <p className="font-medium mb-2">Demo accounts:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Jane"
                className="w-10 h-10 rounded-full object-cover mb-1 ring-2 ring-primary/20"
              />
              <p className="text-xs font-medium">jane@skasc.ac.in</p>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
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
  );
};

export default Login;
