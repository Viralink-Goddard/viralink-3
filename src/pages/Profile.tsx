import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionManagement } from '@/components/SubscriptionManagement';
import { Crown, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      toast({ 
        title: 'Payment Successful!', 
        description: 'Your Pro subscription is now active. Enjoy unlimited content generation!' 
      });
      refreshProfile();
      window.history.replaceState({}, '', '/profile');
    } else if (params.get('canceled')) {
      toast({ 
        title: 'Payment Canceled', 
        description: 'Your payment was canceled. You can try again anytime.',
        variant: 'destructive'
      });
      window.history.replaceState({}, '', '/profile');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your viralink.pro account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <SubscriptionManagement 
            tier={profile?.tier || 'free'}
            subscriptionStatus={profile?.subscription_status}
            subscriptionEndDate={profile?.subscription_end_date}
            onUpgradeSuccess={refreshProfile}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Plan Features
              </CardTitle>
              <CardDescription>What's included in your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {profile?.tier === 'pro' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={profile?.tier === 'pro' ? 'font-medium' : 'text-gray-500'}>
                    Unlimited content generations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.tier === 'pro' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={profile?.tier === 'pro' ? 'font-medium' : 'text-gray-500'}>
                    Advanced AI suggestions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.tier === 'pro' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={profile?.tier === 'pro' ? 'font-medium' : 'text-gray-500'}>
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">1 free generation daily</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {profile?.tier === 'free' && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your daily content generation usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600">{profile.entries_today || 0}/1</p>
                    <p className="text-sm text-gray-600">Generations used today</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Resets daily at midnight</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

