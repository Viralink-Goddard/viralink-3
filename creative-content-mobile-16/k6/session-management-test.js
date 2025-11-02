import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { config } from './config.js';

const sessionRefreshRate = new Rate('session_refresh_success');
const sessionDuration = new Trend('session_operation_duration');

export const options = {
  scenarios: {
    session_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 20 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    session_refresh_success: ['rate>0.95'],
    session_operation_duration: ['p(95)<600'],
  },
};

export function setup() {
  const email = `session_test_${Date.now()}@test.com`;
  const password = 'TestPassword123!';
  
  const signupPayload = JSON.stringify({ email, password });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
    },
  };
  
  const signupRes = http.post(
    `${config.baseUrl}/auth/v1/signup`,
    signupPayload,
    params
  );
  
  const { access_token, refresh_token } = JSON.parse(signupRes.body);
  return { access_token, refresh_token, email, password };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
      'Authorization': `Bearer ${data.access_token}`,
    },
  };

  // Test session validation
  const startTime = Date.now();
  const userRes = http.get(
    `${config.baseUrl}/auth/v1/user`,
    params
  );
  const duration = Date.now() - startTime;

  check(userRes, {
    'session valid': (r) => r.status === 200,
    'user data returned': (r) => JSON.parse(r.body).email === data.email,
  });

  sessionDuration.add(duration);

  // Test token refresh
  const refreshPayload = JSON.stringify({
    refresh_token: data.refresh_token,
  });

  const refreshRes = http.post(
    `${config.baseUrl}/auth/v1/token?grant_type=refresh_token`,
    refreshPayload,
    { headers: params.headers }
  );

  const refreshSuccess = check(refreshRes, {
    'refresh successful': (r) => r.status === 200,
    'new token received': (r) => JSON.parse(r.body).access_token !== undefined,
  });

  sessionRefreshRate.add(refreshSuccess);

  sleep(2);
}
