import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bell, Mail, Shield, TrendingUp, Loader2 } from 'lucide-react';

interface EmailPreferences {
  email_content_reminders: boolean;
  email_weekly_summaries: boolean;
  email_promotional: boolean;
  email_security_alerts: boolean;
}

export default function EmailPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    email_content_reminders: true,
    email_weekly_summaries: true,
    email_promotional: true,
    email_security_alerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_content_reminders, email_weekly_summaries, email_promotional, email_security_alerts')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load email preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(preferences)
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Email preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof EmailPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Preferences</h1>
        <p className="text-gray-600">Manage which emails you receive from us</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Choose which email notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Bell className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <Label htmlFor="content-reminders" className="text-base font-medium">
                  Content Reminders
                </Label>
                <p className="text-sm text-gray-600">
                  Get reminders about scheduled posts and content deadlines
                </p>
              </div>
            </div>
            <Switch
              id="content-reminders"
              checked={preferences.email_content_reminders}
              onCheckedChange={() => togglePreference('email_content_reminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <Label htmlFor="weekly-summaries" className="text-base font-medium">
                  Weekly Summaries
                </Label>
                <p className="text-sm text-gray-600">
                  Receive weekly performance reports and analytics summaries
                </p>
              </div>
            </div>
            <Switch
              id="weekly-summaries"
              checked={preferences.email_weekly_summaries}
              onCheckedChange={() => togglePreference('email_weekly_summaries')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <Label htmlFor="promotional" className="text-base font-medium">
                  Promotional Emails
                </Label>
                <p className="text-sm text-gray-600">
                  Get updates about new features, tips, and special offers
                </p>
              </div>
            </div>
            <Switch
              id="promotional"
              checked={preferences.email_promotional}
              onCheckedChange={() => togglePreference('email_promotional')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <Label htmlFor="security-alerts" className="text-base font-medium">
                  Security Alerts
                </Label>
                <p className="text-sm text-gray-600">
                  Important notifications about your account security (recommended)
                </p>
              </div>
            </div>
            <Switch
              id="security-alerts"
              checked={preferences.email_security_alerts}
              onCheckedChange={() => togglePreference('email_security_alerts')}
            />
          </div>

          <div className="pt-4">
            <Button 
              onClick={savePreferences} 
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
