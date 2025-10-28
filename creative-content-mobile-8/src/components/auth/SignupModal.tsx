import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword, logAuthEvent } from '@/utils/authTestHelpers';
import { isDemoMode } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ open, onOpenChange, onSwitchToLogin }: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, demoLogin } = useAuth();
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

    logAuthEvent('Sign up attempt', { email });

    if (!validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (!validatePassword(password)) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      logAuthEvent('Sign up success', { email });
      toast({ 
        title: 'Success!', 
        description: 'Check your email for verification link.' 
      });
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      logAuthEvent('Sign up error', { email, error: errorMessage });

      // Show specific error message
      toast({ 
        title: 'Sign Up Failed', 
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
          <DialogTitle>Get Started with viralink.pro</DialogTitle>
        </DialogHeader>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-3">
            ✨ <strong>Try Demo Mode</strong> - Full Pro access, no signup needed!
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
            <span className="bg-white px-2 text-gray-500">Or sign up</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input 
              id="signup-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input 
              id="signup-password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
              Log in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
