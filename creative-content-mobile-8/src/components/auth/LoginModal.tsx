import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, logAuthEvent } from '@/utils/authTestHelpers';
import { isDemoMode } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToSignup, onForgotPassword }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDemoMode = () => {
    demoLogin();
    navigate('/dashboard');
    onOpenChange(false);
    toast({ 
      title: '🚀 Demo Mode Activated!', 
      description: 'Explore all Pro features. No signup required!' 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-redirect to demo if in demo mode
    if (isDemoMode) {
      handleDemoMode();
      return;
    }

    logAuthEvent('Login attempt', { email });

    if (!validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      logAuthEvent('Login success', { email });
      toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      onOpenChange(false);
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      logAuthEvent('Login error', { email, error: errorMessage });

      // Show specific error message
      toast({ 
        title: 'Login Failed', 
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
        </DialogHeader>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-3">
            ✨ <strong>Try Demo Mode</strong> - Full Pro access, no login needed!
          </p>
          <Button onClick={handleDemoMode} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            🚀 Launch Demo Now
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or log in</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input 
              id="login-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input 
              id="login-password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={onForgotPassword} 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitchToSignup} className="text-blue-600 hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
