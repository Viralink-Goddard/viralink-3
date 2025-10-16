import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, getAuthErrorMessage, logAuthEvent } from '@/utils/authTestHelpers';

interface PasswordResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function PasswordResetModal({ open, onOpenChange, onSwitchToLogin }: PasswordResetModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logAuthEvent('Password reset attempt', { email });

    // Validate email
    if (!validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      logAuthEvent('Password reset success', { email });
      toast({ 
        title: 'Success!', 
        description: 'Check your email for password reset instructions. Link expires in 1 hour.' 
      });
      onOpenChange(false);
      setEmail('');
    } catch (error: any) {
      logAuthEvent('Password reset error', { email, error: error.message });
      const errorMessage = getAuthErrorMessage(error);
      toast({ title: 'Reset Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
              Log in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
