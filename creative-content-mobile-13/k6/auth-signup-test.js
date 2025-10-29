import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { config } from './config.js';

// Custom metrics
const signupSuccessRate = new Rate('signup_success_rate');
const signupDuration = new Trend('signup_duration');

export const options = {
  scenarios: {
    concurrent_signups: {
      executor: 'ramping-vus',
      ...config.scenarios.stress,
    },
  },
  thresholds: {
    ...config.thresholds,
    signup_success_rate: ['rate>0.95'],
    signup_duration: ['p(95)<1000'],
  },
};

export default function () {
  const timestamp = Date.now();
  const uniqueId = `${__VU}_${__ITER}_${timestamp}`;
  const email = `test_${uniqueId}@loadtest.com`;
  const password = 'TestPassword123!';

  const payload = JSON.stringify({
    email: email,
    password: password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
    },
  };

  const startTime = Date.now();
  const res = http.post(
    `${config.baseUrl}/auth/v1/signup`,
    payload,
    params
  );
  const duration = Date.now() - startTime;

  const success = check(res, {
    'signup status is 200': (r) => r.status === 200,
    'response has user': (r) => JSON.parse(r.body).user !== undefined,
    'response time < 1s': () => duration < 1000,
  });

  signupSuccessRate.add(success);
  signupDuration.add(duration);

  sleep(1);
}
