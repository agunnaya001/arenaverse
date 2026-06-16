# ArenaVerse Testing Guide

Comprehensive testing documentation for API endpoints, components, and E2E flows.

## Table of Contents

1. [Setup](#setup)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [E2E Testing](#e2e-testing)
5. [API Testing](#api-testing)
6. [Performance Testing](#performance-testing)

---

## Setup

### Install Testing Dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install --save-dev cypress @cypress/schematic
npm install --save-dev playwright
```

### Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### Testing Library Setup

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

## Unit Testing

### Component Testing

Test individual components with React Testing Library:

```tsx
// __tests__/guild-card.test.tsx
import { render, screen } from '@testing-library/react';
import { GuildCard } from '@/components/guild-card';

describe('GuildCard', () => {
  it('renders guild information correctly', () => {
    render(
      <GuildCard
        id="guild-1"
        name="Dragon Slayers"
        description="Elite PvP guild"
        memberCount={45}
        treasuryBalance={150000}
        level={8}
      />
    );

    expect(screen.getByText('Dragon Slayers')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Level 8')).toBeInTheDocument();
  });

  it('calls onJoin when join button is clicked', () => {
    const onJoin = jest.fn();
    render(
      <GuildCard
        id="guild-1"
        name="Test Guild"
        memberCount={10}
        treasuryBalance={1000}
        level={1}
        onJoin={onJoin}
      />
    );

    const joinButton = screen.getByText('Join Guild');
    joinButton.click();

    expect(onJoin).toHaveBeenCalled();
  });

  it('renders treasury balance as currency', () => {
    render(
      <GuildCard
        id="guild-1"
        name="Test Guild"
        memberCount={10}
        treasuryBalance={150000}
        level={1}
      />
    );

    expect(screen.getByText('$150,000')).toBeInTheDocument();
  });
});
```

### Utility Testing

Test utility functions:

```typescript
// __tests__/utils.test.ts
import { formatCurrency, calculateXPNeeded } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats large numbers as currency', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(150)).toBe('$150');
    });
  });

  describe('calculateXPNeeded', () => {
    it('calculates XP for next level', () => {
      expect(calculateXPNeeded(1)).toBe(100);
      expect(calculateXPNeeded(5)).toBe(2500);
    });
  });
});
```

---

## Integration Testing

### Database Integration Tests

Test Supabase interactions:

```typescript
// __tests__/integration/supabase.test.ts
import { supabase } from '@/lib/supabase/client';

describe('Supabase Integration', () => {
  describe('Guild Operations', () => {
    it('should fetch guilds from database', async () => {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should create a new guild', async () => {
      const { data, error } = await supabase
        .from('guilds')
        .insert({
          name: 'Test Guild',
          description: 'A test guild',
          leader_id: '0x123...',
          member_count: 1,
          treasury_balance: 0,
          level: 1,
        })
        .select();

      expect(error).toBeNull();
      expect(data?.[0]?.name).toBe('Test Guild');
    });

    it('should update guild information', async () => {
      const { data, error } = await supabase
        .from('guilds')
        .update({ treasury_balance: 5000 })
        .eq('id', 'test-guild-id')
        .select();

      expect(error).toBeNull();
    });
  });

  describe('Tournament Operations', () => {
    it('should fetch active tournaments', async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'Active')
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should add participant to tournament', async () => {
      const { data, error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: 'tournament-123',
          user_id: '0x123...',
          join_date: new Date().toISOString(),
        })
        .select();

      expect(error).toBeNull();
    });
  });
});
```

### API Route Testing

Test Next.js API routes:

```typescript
// __tests__/api/profile.test.ts
import { GET, POST } from '@/app/api/player/profile/route';

describe('Player Profile API', () => {
  it('should return player profile', async () => {
    const request = new Request('http://localhost/api/player/profile', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer valid-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('level');
  });

  it('should update player profile', async () => {
    const request = new Request('http://localhost/api/player/profile', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'NewUsername',
        bio: 'Updated bio',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe('NewUsername');
  });

  it('should return 401 for unauthorized requests', async () => {
    const request = new Request('http://localhost/api/player/profile', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
```

---

## E2E Testing

### Playwright E2E Tests

```typescript
// e2e/guild-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Guild Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Connect wallet or login
    await page.click('[data-testid="connect-wallet"]');
    await page.waitForNavigation();
  });

  test('user can browse and join a guild', async ({ page }) => {
    // Navigate to guilds page
    await page.goto('http://localhost:3000/guilds');
    
    // Verify page loads
    expect(await page.locator('h1').first().textContent()).toContain('Guilds');
    
    // Find a guild card
    const guildCard = page.locator('[data-testid="guild-card"]').first();
    
    // Click view details
    await guildCard.locator('text=View Details').click();
    
    // Verify guild details appear
    expect(await page.locator('[data-testid="guild-details"]').isVisible()).toBeTruthy();
    
    // Click join button
    await page.locator('text=Join Guild').click();
    
    // Verify success message
    expect(await page.locator('text=Joined guild successfully').isVisible()).toBeTruthy();
  });

  test('user can create a new guild', async ({ page }) => {
    await page.goto('http://localhost:3000/guilds');
    
    // Click create guild button
    await page.click('[data-testid="create-guild-btn"]');
    
    // Fill form
    await page.fill('input[placeholder="Epic Warriors"]', 'Legendary Knights');
    await page.fill('textarea[placeholder*="Describe"]', 'A guild for legendary warriors');
    
    // Submit form
    await page.click('text=Create Guild');
    
    // Verify success
    expect(await page.locator('text=Guild created successfully').isVisible()).toBeTruthy();
    
    // Verify new guild appears in list
    expect(await page.locator('text=Legendary Knights').isVisible()).toBeTruthy();
  });
});
```

### Cypress E2E Tests

```typescript
// cypress/e2e/tournament-flow.cy.ts
describe('Tournament Participation Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="connect-wallet"]').click();
    cy.get('body').should('contain', 'Connected');
  });

  it('user can view tournaments and join', () => {
    cy.visit('http://localhost:3000/tournaments');
    
    // Verify tournaments load
    cy.contains('Tournaments').should('be.visible');
    cy.get('[data-testid="tournament-card"]').should('have.length.greaterThan', 0);
    
    // Join first tournament
    cy.get('[data-testid="tournament-card"]').first().within(() => {
      cy.contains('Join Now').click();
    });
    
    // Verify joined
    cy.contains('Tournament joined successfully').should('be.visible');
  });

  it('user can view tournament details', () => {
    cy.visit('http://localhost:3000/tournaments');
    
    // Click tournament card
    cy.get('[data-testid="tournament-card"]').first().click();
    
    // Verify details visible
    cy.get('[data-testid="tournament-details"]').should('be.visible');
    cy.contains('Prize Pool').should('be.visible');
    cy.contains('Participants').should('be.visible');
  });
});
```

---

## API Testing

### Manual API Testing with cURL

```bash
# Get player profile
curl -X GET http://localhost:3000/api/player/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Create guild
curl -X POST http://localhost:3000/api/guilds/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Guild",
    "description": "A test guild"
  }'

# Join tournament
curl -X POST http://localhost:3000/api/tournaments/join \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tournament_id": "tournament-123"
  }'

# Get leaderboard
curl -X GET http://localhost:3000/api/leaderboard/top?limit=10 \
  -H "Content-Type: application/json"
```

### Postman Collection

Import `POSTMAN_COLLECTION.json` into Postman:

```json
{
  "info": {
    "name": "ArenaVerse API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Player Profile",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/player/profile",
        "auth": {
          "type": "bearer",
          "bearer": [
            {
              "key": "token",
              "value": "{{auth_token}}"
            }
          ]
        }
      }
    },
    {
      "name": "Create Guild",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/guilds/create",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Guild\",\n  \"description\": \"Test description\"\n}"
        }
      }
    }
  ]
}
```

---

## Performance Testing

### Load Testing with k6

```javascript
// k6-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // Test dashboard load
  let res = http.get('http://localhost:3000/dashboard');
  check(res, {
    'dashboard loads': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test API endpoint
  res = http.get('http://localhost:3000/api/leaderboard/top?limit=10');
  check(res, {
    'API responds': (r) => r.status === 200,
    'API time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

Run with:
```bash
k6 run k6-test.js
```

### Lighthouse Performance Testing

```bash
# Test homepage
lighthouse http://localhost:3000 --output=html --output-path=lighthouse-report.html

# Test dashboard
lighthouse http://localhost:3000/dashboard --output=html

# View results
open lighthouse-report.html
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test guild-card.test.tsx

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### E2E Tests with Playwright

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/guild-flow.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug
```

### E2E Tests with Cypress

```bash
# Open Cypress UI
npx cypress open

# Run headless
npx cypress run

# Run specific test
npx cypress run --spec "cypress/e2e/guild-flow.cy.ts"
```

---

## Test Coverage Goals

Target coverage metrics:

| Type | Target |
|------|--------|
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

Check coverage:
```bash
npm test -- --coverage --coverageReporters=text-summary
```

---

## Best Practices

### Testing Principles

1. **Test User Behavior** - Focus on what users do, not implementation
2. **Avoid Testing Details** - Don't test internal state or implementation
3. **Use Data Attributes** - Add `data-testid` for reliable selectors
4. **Isolated Tests** - Each test should be independent
5. **Clear Assertions** - Test one thing per test
6. **Realistic Scenarios** - Test actual user workflows

### Test File Organization

```
__tests__/
├── components/
│   ├── guild-card.test.tsx
│   ├── tournament-card.test.tsx
│   └── contract-editor.test.tsx
├── pages/
│   ├── dashboard.test.tsx
│   ├── guilds.test.tsx
│   └── tournaments.test.tsx
├── integration/
│   ├── supabase.test.ts
│   └── api.test.ts
└── utils.test.ts

e2e/
├── guild-flow.spec.ts
├── tournament-flow.spec.ts
└── deployment-flow.spec.ts
```

### Naming Conventions

```typescript
// Good
describe('GuildCard Component', () => {
  it('renders guild name and member count', () => {
    // Test code
  });

  it('calls onJoin callback when join button clicked', () => {
    // Test code
  });
});

// Avoid
describe('Guild', () => {
  it('works', () => {
    // Test code
  });
});
```

---

## Debugging Tests

### React Testing Library Debugging

```typescript
import { render, screen, debug } from '@testing-library/react';

it('shows element', () => {
  render(<MyComponent />);
  
  // Print DOM to console
  debug();
  
  // Print specific element
  debug(screen.getByRole('button'));
});
```

### Cypress Debugging

```typescript
it('debug test', () => {
  cy.visit('/');
  cy.get('[data-testid="element"]').debug();
  cy.paused(); // Pause execution
  cy.visit('/next-page');
});
```

### Playwright Inspector

```bash
# Run tests with inspector
PWDEBUG=1 npx playwright test
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Run E2E tests
        run: npx playwright test
```

---

**Last Updated**: June 2026  
**Testing Framework**: Jest + React Testing Library + Playwright  
**E2E Tool**: Playwright & Cypress  
**Performance Tool**: k6 & Lighthouse
