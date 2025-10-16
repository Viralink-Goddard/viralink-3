import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, getAuthErrorMessage, logAuthEvent } from '@/utils/authTestHelpers';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToSignup, onSwitchToReset }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logAuthEvent('Login attempt', { email });

    // Validate email
    if (!validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      logAuthEvent('Login success', { email });
      toast({ title: 'Success!', description: 'Welcome back to viralink.pro' });
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      logAuthEvent('Login error', { email, error: error.message });
      const errorMessage = getAuthErrorMessage(error);
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log in to viralink.pro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          <div className="text-center space-y-2">
            <button type="button" onClick={onSwitchToReset} className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </button>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToSignup} className="text-blue-600 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
