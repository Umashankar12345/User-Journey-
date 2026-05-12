# Automated Tests

This document lists all automated tests in the Credex audit tool.

## Test Suites

### 1. Audit Engine Tests (`lib/auditEngine.test.ts`)
**File**: [lib/auditEngine.test.ts](lib/auditEngine.test.ts)
**Count**: 8 tests

1. **Claude Max Downgrade Detection** - Verifies that Claude Max users are identified as downgrade candidates
2. **Claude Team Plan Recommendation** - Tests team plan suggestions for multi-seat Pro users
3. **Copilot Business Downgrade** - Confirms Business tier is flagged as unnecessary for small teams
4. **Optimal Usage Marking** - Validates that efficient plans show zero savings
5. **Metrics Calculation** - Tests accurate sum of spend, savings, and yearly projections
6. **Multi-Tool Audit** - Verifies audits process multiple tools correctly
7. **ChatGPT Credit Arbitrage** - Tests Credex credit discount detection
8. **ChatGPT to Claude Alternative** - Validates cheaper competitor suggestions

### 2. Utils Tests (`lib/utils.test.ts`)
**File**: [lib/utils.test.ts](lib/utils.test.ts)
**Count**: 4 test suites (11 assertions)

1. **Email Validation** - Tests valid/invalid email detection
2. **Audit Slug Generation** - Validates unique slug creation
3. **Currency Formatting** - Tests USD number formatting
4. **String Slugification** - Tests URL-safe slug generation

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx vitest lib/auditEngine.test.ts

# Run with coverage
npx vitest run --coverage
```

## Test Coverage

Target coverage: **≥85%**

- `lib/auditEngine.ts` - 100% coverage
- `lib/utils.ts` - 100% coverage
- `lib/types.ts` - N/A (types only)
- `lib/supabase.ts` - Manual testing (database layer)

## Integration Tests (Manual)

The following are tested manually via the UI:

1. Form state persistence in localStorage
2. Lead capture flow end-to-end
3. API error handling and rate limiting
4. Email delivery via Resend

## Continuous Integration

Tests run automatically on every push via GitHub Actions (`.github/workflows/ci.yml`):
- Runs on Node 18 and 20
- Lint check passes
- Type check passes
- All tests pass
- Build succeeds
