import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '@/lib/supabase';

/**
 * Database Operations Integration Tests
 * 
 * These tests verify actual database operations with a real Supabase instance.
 * 
 * SETUP REQUIRED:
 * 1. Create a test Supabase project or use a test environment
 * 2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.test
 * 3. Run migrations: supabase db push
 * 4. Create test users via Supabase Dashboard
 * 
 * Run with: npm run test:db
 */

describe('Database Operations - Profiles Table', () => {
  let testUserId: string;
  let testUserEmail: string;

  beforeAll(async () => {
    // Create a test user for database operations
    testUserEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testUserEmail,
      password: 'TestPassword123!',
    });

    if (error) {
      console.error('Failed to create test user:', error);
      throw error;
    }

    testUserId = data.user?.id || '';
    expect(testUserId).toBeTruthy();
  });

  afterAll(async () => {
    // Cleanup: Delete test user profile
    if (testUserId) {
      await supabase.from('profiles').delete().eq('id', testUserId);
      // Note: Cannot delete auth.users via client, must use admin API
    }
  });

  it('should automatically create profile on user signup', async () => {
    // Wait a bit for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data?.email).toBe(testUserEmail);
    expect(data?.tier).toBe('free');
    expect(data?.entries_today).toBe(0);
  });

  it('should allow user to read their own profile', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBe(testUserId);
  });

  it('should allow user to update their own profile', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ entries_today: 5 })
      .eq('id', testUserId)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data?.entries_today).toBe(5);
  });
});
