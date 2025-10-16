import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { createMockSupabase, mockUser } from '../mocks/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: createMockSupabase(),
}));

function AuthTestComponent() {
  const { user, signUp, signIn, signOut, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">{user ? user.email : 'Not logged in'}</div>
      <button onClick={() => signUp('test@example.com', 'password123')} data-testid="signup-btn">
        Sign Up
      </button>
      <button onClick={() => signIn('test@example.com', 'password123')} data-testid="login-btn">
        Log In
      </button>
      <button onClick={signOut} data-testid="logout-btn">
        Log Out
      </button>
      {loading && <div data-testid="loading">Loading...</div>}
    </div>
  );
}

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles signup flow', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    const signupBtn = screen.getByTestId('signup-btn');
    await user.click(signupBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('test@example.com');
    });
  });

  it('handles login flow', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    await user.click(loginBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('test@example.com');
    });
  });
});
