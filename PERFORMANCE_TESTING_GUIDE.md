# Performance & Load Testing Guide

## Overview
This guide covers performance and load testing for the authentication system using k6, including concurrent signups, login rate limiting, session management, and database performance.

## Prerequisites

### Install k6
```bash
# macOS
brew install k6

# Windows (Chocolatey)
choco install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Configuration

### Environment Variables
Create a `.env.k6` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Load Environment Variables
```bash
export $(cat .env.k6 | xargs)
```

## Test Scenarios

### 1. Smoke Test (Quick Validation)
```bash
npm run test:perf:smoke
# Or directly:
k6 run --env SCENARIO=smoke k6/auth-signup-test.js
```
- **Purpose**: Quick validation that system works
- **Load**: 1 VU for 1 minute
- **Use Case**: After deployments, quick checks

### 2. Load Test (Normal Traffic)
```bash
npm run test:perf:load
# Or:
k6 run k6/auth-login-test.js
```
- **Purpose**: Test system under normal expected load
- **Load**: Ramps to 10 VUs, sustains for 5 minutes
- **Use Case**: Validate performance under typical usage

### 3. Stress Test (Peak Traffic)
```bash
npm run test:perf:stress
# Or:
k6 run k6/auth-signup-test.js
```
- **Purpose**: Find system breaking point
- **Load**: Ramps to 100 VUs over time
- **Use Case**: Capacity planning, identify bottlenecks

### 4. Spike Test (Traffic Surges)
```bash
npm run test:perf:spike
# Or:
k6 run --env SCENARIO=spike k6/session-management-test.js
```
- **Purpose**: Test system recovery from sudden traffic spikes
- **Load**: Sudden jump to 1000 VUs
- **Use Case**: Marketing campaigns, viral events

## Test Suites

### Authentication Signup Test
**File**: `k6/auth-signup-test.js`

Tests concurrent user signups:
- Creates unique users per iteration
- Measures signup success rate
- Tracks response times
- Validates user creation

**Metrics**:
- `signup_success_rate`: Should be >95%
- `signup_duration`: p95 <1000ms
- `http_req_duration`: p95 <500ms

**Run**:
```bash
k6 run k6/auth-signup-test.js
```

### Authentication Login Test
**File**: `k6/auth-login-test.js`

Tests login performance and rate limiting:
- Creates test users in setup
- Performs concurrent logins
- Monitors rate limit errors
- Validates token generation

**Metrics**:
- `login_success_rate`: Should be >90%
- `login_duration`: p95 <800ms
- `rate_limit_errors`: Tracks 429 responses

**Run**:
```bash
k6 run k6/auth-login-test.js
```

### Session Management Test
**File**: `k6/session-management-test.js`

Tests session operations under load:
- Session validation
- Token refresh
- Concurrent session handling
- Session persistence

**Metrics**:
- `session_refresh_success`: Should be >95%
- `session_operation_duration`: p95 <600ms

**Run**:
```bash
k6 run k6/session-management-test.js
```

### Database Performance Test
**File**: `k6/database-performance-test.js`

Tests database queries and RLS:
- Profile read operations
- RLS policy enforcement
- Query performance
- Concurrent database access

**Metrics**:
- `db_query_success`: Should be >98%
- `db_query_duration`: p95 <400ms
- `rls_policy_enforced`: Should be >99%

**Run**:
```bash
k6 run k6/database-performance-test.js
```

## Performance Thresholds

### Default Thresholds
```javascript
{
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.01'],
  iteration_duration: ['p(95)<2000'],
}
```

### Custom Thresholds
Modify in test files or override via CLI:
```bash
k6 run --threshold http_req_duration=p(95)<300 k6/auth-login-test.js
```

## Interpreting Results

### Key Metrics

**Response Time Percentiles**:
- p50 (median): 50% of requests faster than this
- p95: 95% of requests faster than this
- p99: 99% of requests faster than this

**Success Rates**:
- `http_req_failed`: Should be <1%
- Custom success rates: >95% typically acceptable

**Request Rate**:
- `http_reqs`: Total requests per second
- Higher is better (within acceptable response times)

### Sample Output
```
✓ signup status is 200
✓ response has user
✓ response time < 1s

checks.........................: 100.00% ✓ 1500      ✗ 0
data_received..................: 2.1 MB  35 kB/s
data_sent......................: 450 kB  7.5 kB/s
http_req_duration..............: avg=245ms min=120ms med=230ms max=890ms p(95)=450ms p(99)=650ms
http_reqs......................: 500     8.33/s
signup_duration................: avg=245ms min=120ms med=230ms max=890ms p(95)=450ms p(99)=650ms
signup_success_rate............: 100.00% ✓ 500       ✗ 0
vus............................: 50      min=0       max=50
```

## Advanced Usage

### Cloud Execution
```bash
# Run on k6 Cloud
k6 cloud k6/auth-login-test.js

# With options
k6 cloud --vus 100 --duration 10m k6/stress-test.js
```

### Custom Scenarios
```bash
# Override VUs and duration
k6 run --vus 50 --duration 5m k6/auth-signup-test.js

# Use specific stage configuration
k6 run --stage 1m:10,5m:50,1m:0 k6/auth-login-test.js
```

### Output Formats
```bash
# JSON output
k6 run --out json=results.json k6/auth-login-test.js

# InfluxDB (for Grafana)
k6 run --out influxdb=http://localhost:8086/k6 k6/auth-login-test.js

# CSV output
k6 run --out csv=results.csv k6/auth-login-test.js
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      - name: Run Load Tests
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          k6 run k6/auth-login-test.js
          k6 run k6/database-performance-test.js
```

## Troubleshooting

### High Error Rates
- Check Supabase rate limits
- Verify database connection pool size
- Review RLS policies for performance
- Check network connectivity

### Slow Response Times
- Analyze database query performance
- Check for N+1 queries
- Review index usage
- Monitor Supabase dashboard

### Rate Limiting
- Adjust test VU count
- Increase sleep times between requests
- Contact Supabase for rate limit increases
- Implement exponential backoff

## Best Practices

1. **Start Small**: Begin with smoke tests, gradually increase load
2. **Monitor Resources**: Watch CPU, memory, database connections
3. **Test Regularly**: Run performance tests on schedule
4. **Set Baselines**: Establish performance baselines for comparison
5. **Document Results**: Keep records of test runs and improvements
6. **Test Production-Like**: Use staging environment similar to production
7. **Clean Up**: Remove test data after runs
8. **Alert on Failures**: Set up notifications for threshold violations

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [Supabase Performance Tips](https://supabase.com/docs/guides/platform/performance)
- [Load Testing Best Practices](https://k6.io/docs/testing-guides/test-types/)
