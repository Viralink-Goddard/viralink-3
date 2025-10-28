import { supabase } from './supabase';

export interface EmailPreferences {
  email_content_reminders: boolean;
  email_weekly_summaries: boolean;
  email_promotional: boolean;
  email_security_alerts: boolean;
}

/**
 * Check if a user has opted in to receive a specific type of email
 */
export async function canSendEmail(
  userId: string,
  emailType: keyof EmailPreferences
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(emailType)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking email preferences:', error);
      // Default to true for security alerts, false for others if error
      return emailType === 'email_security_alerts';
    }

    return data?.[emailType] ?? (emailType === 'email_security_alerts');
  } catch (error) {
    console.error('Error in canSendEmail:', error);
    return emailType === 'email_security_alerts';
  }
}

/**
 * Get all email preferences for a user
 */
export async function getUserEmailPreferences(
  userId: string
): Promise<EmailPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email_content_reminders, email_weekly_summaries, email_promotional, email_security_alerts')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as EmailPreferences;
  } catch (error) {
    console.error('Error getting email preferences:', error);
    return null;
  }
}
