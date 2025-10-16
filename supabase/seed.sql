-- Seed data for testing
-- This file contains test users and profiles for development/testing

-- Note: You cannot directly insert into auth.users via SQL
-- Instead, use the Supabase Dashboard or API to create test users
-- This file documents the test users and creates their profiles

-- Test Users (create these via Supabase Dashboard or API):
-- 1. testuser1@example.com / TestPass123!
-- 2. testuser2@example.com / TestPass123!
-- 3. testadmin@example.com / AdminPass123!

-- After creating users via auth, insert their profiles
-- Replace the UUIDs below with actual user IDs from auth.users

-- Example profile inserts (update UUIDs after creating auth users):
-- INSERT INTO public.profiles (id, email, tier, entries_today) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'testuser1@example.com', 'free', 0),
--   ('00000000-0000-0000-0000-000000000002', 'testuser2@example.com', 'pro', 5),
--   ('00000000-0000-0000-0000-000000000003', 'testadmin@example.com', 'enterprise', 10);

-- Function to create test profile (for manual testing)
CREATE OR REPLACE FUNCTION create_test_profile(
  user_id UUID,
  user_email TEXT,
  user_tier TEXT DEFAULT 'free',
  daily_entries INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier, entries_today)
  VALUES (user_id, user_email, user_tier, daily_entries)
  ON CONFLICT (id) DO UPDATE
  SET tier = user_tier, entries_today = daily_entries;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset test data function
CREATE OR REPLACE FUNCTION reset_test_data()
RETURNS void AS $$
BEGIN
  -- Reset entries_today for all test users
  UPDATE public.profiles
  SET entries_today = 0
  WHERE email LIKE '%@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
