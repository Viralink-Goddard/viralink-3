import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Don't show if user is verified, dismissed, or no user
  if (!user || user.email_confirmed_at || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerificationEmail();
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox and spam folder.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification email',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Mail className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm text-blue-900">
          Please verify your email address. Check your inbox for a confirmation link.
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResend}
            disabled={sending}
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            {sending ? 'Sending...' : 'Resend Email'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
