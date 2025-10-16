// k6 Load Testing Configuration
export const config = {
  // Test environment URLs
  baseUrl: __ENV.VITE_SUPABASE_URL || 'http://localhost:54321',
  anonKey: __ENV.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  
  // Load test scenarios
  scenarios: {
    smoke: {
      vus: 1,
      duration: '1m',
    },
    load: {
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 0 },
      ],
    },
    stress: {
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
    },
    spike: {
      stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '10s', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '10s', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  
  // Performance thresholds
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    iteration_duration: ['p(95)<2000'],
  },
};
