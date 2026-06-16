# ArenaGameFi - Quick Reference Guide

Quick answers to common tasks and procedures.

## 🚀 Deployment

### Deploy to Production
```bash
git checkout main
git pull origin main
vercel deploy --prod
```

### Deploy to Staging
```bash
git checkout staging
git push origin staging
# Vercel auto-deploys to preview URL
```

### Rollback Production
```bash
vercel rollback
```

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
# or with specific package
npm install [package-name]
```

### Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

### Type Check
```bash
npx tsc --noEmit
```

### Lint Code
```bash
npm run lint
```

### Run Tests
```bash
npm run test
npm run test:integration
```

---

## 🗄️ Database

### View Database Schema
```bash
# In Supabase dashboard
https://app.supabase.com/projects/[project-id]/editor
```

### Run Migrations
```bash
npx supabase migration up
```

### Create New Migration
```bash
npx supabase migration new [migration_name]
```

### Reset Database (⚠️ Production Data Lost)
```bash
npx supabase db reset
```

### View Logs
```bash
# Supabase dashboard → Logs
```

---

## 🔐 Environment Variables

### Add New Variable
```bash
# Via Vercel CLI
vercel env add VARIABLE_NAME

# Or in Vercel Dashboard
# Settings → Environment Variables
```

### View Current Variables
```bash
vercel env list
```

### Local Development
```bash
# Create .env.local file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

---

## 🌐 Smart Contracts

### View Contract on Etherscan
```
https://basescan.org/address/[contract_address]
```

### Test Contract Interaction
```bash
# See lib/blockchain/contract-interactions.ts
import { ArenaTokenReads, ArenaTokenWrites } from '@/lib/blockchain/contract-interactions'

// Read data
const balance = await ArenaTokenReads.getBalance('0x...')

// Write transaction (requires signer)
const tx = await ArenaTokenWrites.transfer(signer, '0x...', amount)
```

### Get Contract Address
```typescript
import { CONTRACTS } from '@/lib/contracts'

console.log(CONTRACTS.ARENA_TOKEN)
console.log(CONTRACTS.ARENA_CHAMPION)
// etc.
```

---

## 📊 Monitoring

### Check Error Logs
```
Sentry Dashboard → Issues
or
Vercel Dashboard → Monitoring → Web Analytics
```

### View Real-time Metrics
```
Vercel Dashboard → Analytics
```

### Monitor Database Performance
```
Supabase Dashboard → Database → Logs → Slow Queries
```

### Check API Health
```bash
curl https://arenagamefi.com/api/health
```

---

## 🔍 Debugging

### View Console Logs
```bash
# Development
npm run dev
# Logs appear in terminal

# Production
# Check /vercel/share/.env.project for env vars
# Check Sentry for errors
```

### Enable Debug Mode
```typescript
// In your component
console.log('[v0] Debug message:', variable)
```

### Check Network Requests
```
Browser DevTools → Network tab
```

### Test Blockchain Connection
```typescript
import { getProvider } from '@/lib/blockchain/contract-interactions'

const provider = getProvider()
const blockNumber = await provider.getBlockNumber()
console.log('Latest block:', blockNumber)
```

---

## 👥 User Management

### Add Admin
```typescript
// Update NEXT_PUBLIC_ADMIN_ADDRESSES in .env
// Comma-separated wallet addresses
NEXT_PUBLIC_ADMIN_ADDRESSES=0xaddr1,0xaddr2
```

### View User Data
```bash
# Supabase Dashboard → SQL Editor
SELECT * FROM auth.users;
SELECT * FROM public.user_profiles;
```

### Delete User
```bash
# Via Supabase auth dashboard
# Auth → Users → Select user → Delete
```

---

## 🎮 Features

### Create New Page
```bash
# Create file: app/(public)/[page-name]/page.tsx
touch app/\(public\)/new-page/page.tsx
```

### Create New API Route
```bash
# Create file: app/api/[route]/route.ts
touch app/api/new-route/route.ts
```

### Add Database Table
```bash
# Via Supabase SQL Editor
CREATE TABLE table_name (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

# Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

# Add policy
CREATE POLICY "Users can read own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🔄 Git Workflow

### Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/[feature-name]
```

### Commit Changes
```bash
git add .
git commit -m "feat: description of change"
git push origin feature/[feature-name]
```

### Create Pull Request
```bash
# On GitHub
# Create PR from feature/[feature-name] → main
```

### Merge to Main
```bash
git checkout main
git pull origin main
git merge --no-ff feature/[feature-name]
git push origin main
```

### Create Release Tag
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 📝 Common Tasks

### Update Privacy Policy
```
File: app/legal/privacy/page.tsx
Update content → Deploy
```

### Update Terms of Service
```
File: app/legal/terms/page.tsx
Update content → Deploy
```

### Add New Admin Feature
```
1. Create page: app/(admin)/[feature]/page.tsx
2. Add wallet auth check
3. Implement admin-only logic
4. Test with admin wallet
```

### Create Notification
```typescript
// See components/ui/notifications or use toast
import { showNotification } from '@/lib/utils/notifications'

showNotification({
  type: 'success',
  title: 'Success!',
  message: 'Action completed'
})
```

### Add Rate Limiting
```typescript
// Already configured in API routes
import { checkRateLimit } from '@/lib/middleware/rate-limit'

const rateLimit = await checkRateLimit(userId, '/api/endpoint')
if (!rateLimit.allowed) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

---

## 🆘 Emergency Procedures

### Website Down
1. Check Vercel status page
2. Check error logs in Sentry
3. Verify database connection
4. Check blockchain node status
5. Run: `vercel rollback` if recent deployment

### Database Down
1. Check Supabase dashboard
2. View database logs
3. Check connection pool status
4. Restore from backup if needed

### High Error Rate
1. Check Sentry for error patterns
2. Review recent deployments
3. Check database performance
4. Monitor API latency
5. Consider rollback if critical

### Out of Memory
1. Check which process is using memory
2. Look for memory leaks in DevTools
3. Restart application
4. Monitor after restart

### Slow Performance
1. Check Lighthouse score
2. Review Core Web Vitals
3. Check database slow queries
4. Profile with DevTools
5. Optimize identified bottleneck

---

## 📚 Documentation References

| Document | Purpose | Location |
|----------|---------|----------|
| DEPLOYMENT.md | Launch procedures | `/DEPLOYMENT.md` |
| SECURITY.md | Security policies | `/SECURITY.md` |
| LAUNCH_SUMMARY.md | Project completion summary | `/LAUNCH_SUMMARY.md` |
| README.md | Project overview | `/README.md` |
| .env.example | Environment variables | `/.env.example` |
| Privacy Policy | Legal document | `/app/legal/privacy/page.tsx` |
| Terms of Service | Legal document | `/app/legal/terms/page.tsx` |

---

## 🔗 Useful Links

### Platforms
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com)
- [GitHub Repository](https://github.com/agunnaya001/arenaverse)
- [Base Etherscan](https://basescan.org)

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [ethers.js Docs](https://docs.ethers.org)

### Community
- [Discord Server](https://discord.gg/arenagamefi)
- [Twitter](https://twitter.com/arenagamefi)
- [GitHub Discussions](https://github.com/agunnaya001/arenaverse/discussions)

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save file | Ctrl+S / Cmd+S |
| Format code | Shift+Alt+F |
| Toggle terminal | Ctrl+` |
| Quick fix | Ctrl+. |
| Go to file | Ctrl+P |
| Go to line | Ctrl+G |
| Find in file | Ctrl+F |
| Find and replace | Ctrl+H |

---

## 💡 Tips & Tricks

### Fast Debugging
```bash
# Search for console logs
grep -r "console\." app/ lib/

# Find TODOs in code
grep -r "TODO" app/ lib/
```

### Performance Testing
```bash
npm run build
npm run analyze
# View bundle size breakdown
```

### Type Safety
```bash
# Full type check before commit
npx tsc --noEmit && npm run lint
```

### Database Query Testing
```bash
# Run query in Supabase SQL Editor
# Copy query results for testing
```

---

## 🎯 Last Updated

June 2024

Keep this guide bookmarked for quick reference during development and operations!
