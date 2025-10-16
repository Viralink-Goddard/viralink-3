// Authentication test helper functions

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function getAuthErrorMessage(error: any): string {
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (error?.message?.includes('Email not confirmed')) {
    return 'Please confirm your email address before logging in.';
  }
  if (error?.message?.includes('User already registered')) {
    return 'An account with this email already exists.';
  }
  return error?.message || 'An unexpected error occurred. Please try again.';
}

export function logAuthEvent(event: string, data?: any) {
  console.log(`[AUTH TEST] ${event}`, data ? JSON.stringify(data, null, 2) : '');
}
