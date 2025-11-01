import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { config } from './config.js';

const dbQuerySuccess = new Rate('db_query_success');
const dbQueryDuration = new Trend('db_query_duration');
const rlsPolicyEnforcement = new Rate('rls_policy_enforced');

export const options = {
  scenarios: {
    database_stress: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 30 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    db_query_success: ['rate>0.98'],
    db_query_duration: ['p(95)<400'],
    rls_policy_enforced: ['rate>0.99'],
  },
};

export function setup() {
  const users = [];
  for (let i = 0; i < 5; i++) {
    const email = `dbtest_${i}_${Date.now()}@test.com`;
    const password = 'TestPassword123!';
    
    const payload = JSON.stringify({ email, password });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
      },
    };
    
    const res = http.post(
      `${config.baseUrl}/auth/v1/signup`,
      payload,
      params
    );
    
    const { access_token, user } = JSON.parse(res.body);
    users.push({ access_token, userId: user.id });
  }
  
  return { users };
}

export default function (data) {
  const user = data.users[__VU % data.users.length];
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.anonKey,
      'Authorization': `Bearer ${user.access_token}`,
    },
  };

  // Test profile read (should succeed - own profile)
  const startTime = Date.now();
  const readRes = http.get(
    `${config.baseUrl}/rest/v1/profiles?id=eq.${user.userId}`,
    params
  );
  const readDuration = Date.now() - startTime;

  const readSuccess = check(readRes, {
    'profile read successful': (r) => r.status === 200,
    'profile data returned': (r) => JSON.parse(r.body).length > 0,
  });

  dbQuerySuccess.add(readSuccess);
  dbQueryDuration.add(readDuration);

  // Test RLS - try to read another user's profile
  const otherUser = data.users[(__VU + 1) % data.users.length];
  const rlsRes = http.get(
    `${config.baseUrl}/rest/v1/profiles?id=eq.${otherUser.userId}`,
    params
  );

  const rlsEnforced = check(rlsRes, {
    'RLS blocks unauthorized access': (r) => JSON.parse(r.body).length === 0,
  });

  rlsPolicyEnforcement.add(rlsEnforced);

  sleep(1);
}
