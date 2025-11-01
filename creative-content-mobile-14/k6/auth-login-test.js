import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { config } from './config.js';

// Custom metrics
const loginSuccessRate = new Rate('login_success_rate');
const loginDuration = new Trend('login_duration');
const rateLimitErrors = new Counter('rate_limit_errors');

export const options = {
  scenarios: {
    sustained_login: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
    },
  },
  thresholds: {
    ...config.thresholds,
    login_success_rate: ['rate>0.90'],
    login_duration: ['p(95)<800'],
  },
};

// Setup: Create test users
export function setup() {
  const testUsers = [];
  for (let i = 0; i < 10; i++) {
    const email = `loadtest_user_${i}@test.com`;
    const password = 'TestPassword123!';
    
    const payload = JSON.stringify({ email, password });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
      },
    };
    
    http.post(`${config.baseUrl}/auth/v1/signup`, payload, params);
    testUsers.push({ email, password });
  }
  
  return { testUsers };
}

export default function (data) {
  const user = data.testUsers[__VU % data.testUsers.length];
  
  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
    },
  };

  const startTime = Date.now();
  const res = http.post(
    `${config.baseUrl}/auth/v1/token?grant_type=password`,
    payload,
    params
  );
  const duration = Date.now() - startTime;

  const success = check(res, {
    'login status is 200': (r) => r.status === 200,
    'has access token': (r) => JSON.parse(r.body).access_token !== undefined,
    'response time < 800ms': () => duration < 800,
  });

  if (res.status === 429) {
    rateLimitErrors.add(1);
  }

  loginSuccessRate.add(success);
  loginDuration.add(duration);

  sleep(Math.random() * 3 + 1);
}
