# Complete Testing Guide

## Overview
This application has a comprehensive testing suite covering unit tests, integration tests, database tests, and performance/load tests.

## Test Types

### 1. Unit Tests
Test individual components and functions in isolation.

**Location**: `src/contexts/__tests__/`

**Run**:
```bash
npm test
```

**Coverage**:
```bash
npm run test:coverage
```

### 2. Integration Tests
Test authentication flows and component interactions.

**Location**: `src/test/integration/`

**Run**:
```bash
npm test src/test/integration/auth-flow.test.tsx
```

### 3. Database Tests
Test real database operations with Supabase.

**Location**: `src/test/integration/database-operations.test.tsx`

**Setup**:
```bash
npm run db:setup
```

**Run**:
```bash
npm run test:db
```

### 4. Performance Tests
Load testing with k6 for stress testing and performance monitoring.

**Location**: `k6/`

**Run**:
```bash
# Quick smoke test
npm run test:perf:smoke

# Normal load test
npm run test:perf:load

# Stress test
npm run test:perf:stress

# All performance tests
npm run test:perf:all
```

## Quick Start

### Install Dependencies
```bash
npm install
```

### Setup Test Database
```bash
# Copy environment template
cp .env.test .env.test.local

# Edit with your test Supabase credentials
# Then run setup
npm run db:setup
```

### Run All Tests
```bash
# Unit and integration tests
npm test

# Database tests
npm run test:db

# Performance tests (requires k6 installed)
npm run test:perf:all
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts                    # Test configuration
│   ├── mocks/
│   │   └── supabase.ts            # Supabase mocks
│   └── integration/
│       ├── auth-flow.test.tsx     # Auth integration tests
│       └── database-operations.test.tsx  # DB tests
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx   # AuthContext unit tests
└── utils/
    └── authTestHelpers.ts         # Test utilities

k6/
├── config.js                      # k6 configuration
├── auth-signup-test.js           # Signup load tests
├── auth-login-test.js            # Login load tests
├── session-management-test.js    # Session tests
└── database-performance-test.js  # DB performance tests
```

## Documentation

- **[Automated Testing Guide](./AUTOMATED_TESTING_GUIDE.md)**: Unit and integration tests
- **[Integration Instructions](./INTEGRATION_INSTRUCTIONS.md)**: Database integration tests
- **[Performance Testing Guide](./PERFORMANCE_TESTING_GUIDE.md)**: Load and stress tests
- **[Environment Setup](./ENV_SETUP_GUIDE.md)**: Environment configuration

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Best Practices

1. **Write tests first** (TDD approach)
2. **Mock external dependencies** for unit tests
3. **Use real database** for integration tests
4. **Run performance tests regularly**
5. **Maintain test coverage** above 80%
6. **Clean up test data** after tests
7. **Use descriptive test names**
8. **Test error cases** not just happy paths

## Troubleshooting

See individual testing guides for specific troubleshooting:
- Unit tests: AUTOMATED_TESTING_GUIDE.md
- Database tests: INTEGRATION_INSTRUCTIONS.md
- Performance tests: PERFORMANCE_TESTING_GUIDE.md
