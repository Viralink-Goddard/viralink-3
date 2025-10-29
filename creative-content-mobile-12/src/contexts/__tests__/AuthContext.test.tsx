import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as supabaseModule from '@/lib/supabase';
import { createMockSupabase, mockUser, mockSession, mockProfile } from '@/test/mocks/supabase';

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: createMockSupabase(),
}));

// Test component that uses the auth context
function TestComponent() {
  const { user, session, profile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="profile-tier">{profile?.tier || 'No profile'}</div>
      <div data-testid="session-status">{session ? 'Authenticated' : 'Not authenticated'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-email')).toBeInTheDocument();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
