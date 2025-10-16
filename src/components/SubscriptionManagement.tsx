import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { STRIPE_PRICE_ID } from '@/lib/stripe';
import { Loader2, CreditCard, X } from 'lucide-react';

interface SubscriptionManagementProps {
  tier: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  onUpgradeSuccess: () => void;
}

export function SubscriptionManagement({ 
  tier, 
  subscriptionStatus, 
  subscriptionEndDate,
  onUpgradeSuccess 
}: SubscriptionManagementProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { priceId: STRIPE_PRICE_ID }
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: window.location.href }
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to open subscription management. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your viralink.pro subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Plan</p>
            <p className="text-sm text-muted-foreground">
              {tier === 'pro' ? 'Pro Plan - $10/month' : 'Free Plan'}
            </p>
          </div>
          <Badge variant={tier === 'pro' ? 'default' : 'secondary'}>
            {tier.toUpperCase()}
          </Badge>
        </div>

        {tier === 'pro' && subscriptionStatus && (
          <div className="text-sm">
            <p>Status: <span className="font-medium capitalize">{subscriptionStatus}</span></p>
            {subscriptionEndDate && (
              <p>Renews: {new Date(subscriptionEndDate).toLocaleDateString()}</p>
            )}
          </div>
        )}

        {tier === 'free' ? (
          <Button onClick={handleUpgrade} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Upgrade to Pro
          </Button>
        ) : (
          <Button onClick={handleManageSubscription} disabled={loading} variant="outline" className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
