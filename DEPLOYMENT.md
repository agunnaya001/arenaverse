# ArenaGameFi - Complete Deployment & Launch Guide

## 🚀 Production Deployment Ready

This is a fully functional GameFi application on Base blockchain with comprehensive Web3 features. Follow this guide to deploy and launch successfully.

---

## Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured in Vercel (see `.env.example`)
- [ ] Database migrations completed on production Supabase
- [ ] Database RLS policies enabled and tested
- [ ] Rate limiting thresholds configured appropriately
- [ ] Admin addresses configured correctly
- [ ] All API keys are production keys (not development)
- [ ] HTTPS certificate configured
- [ ] CORS headers configured for production domain

### Smart Contracts
- [ ] All contracts deployed to Base mainnet
- [ ] Contract addresses verified and updated in code
- [ ] ABIs verified on Etherscan
- [ ] Owner/admin roles properly set
- [ ] Pause/emergency functions tested
- [ ] No hardcoded addresses in frontend code
- [ ] Contract interaction utilities tested

### Frontend & Backend
- [ ] All pages reviewed for accuracy and content
- [ ] Links tested (internal and external)
- [ ] Forms validated with proper error handling
- [ ] Images optimized and loading correctly
- [ ] Mobile responsiveness verified (all breakpoints)
- [ ] Accessibility audit passed (WCAG 2.1 AA minimum)
- [ ] Performance audit passed (Lighthouse > 90)
- [ ] All SEO metadata complete (title, description, OG tags)
- [ ] Legal pages (Privacy Policy, Terms of Service) published
- [ ] All API endpoints tested in staging
- [ ] Error handling verified (production error messages)
- [ ] CORS policy correctly configured
- [ ] Rate limiting working as expected
- [ ] Request validation active for all inputs
- [ ] Comprehensive logging configured
- [ ] Monitoring and alerting set up

### Security & Compliance
- [ ] SSL/TLS certificate installed and valid
- [ ] HTTPS enforced site-wide
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] All dependencies audited for vulnerabilities
- [ ] No secrets hardcoded in repository
- [ ] API keys stored in Vercel environment variables
- [ ] Database backups configured
- [ ] Privacy policy compliant with GDPR/CCPA
- [ ] Terms of Service legally reviewed
- [ ] Risk disclaimers prominently displayed
- [ ] Wallet security best practices documented

### Monitoring & Analytics
- [ ] Application metrics dashboard created
- [ ] Error tracking (Sentry or similar) enabled
- [ ] Analytics (Vercel Analytics) enabled
- [ ] Structured logging aggregation set up
- [ ] Alerting rules configured for critical errors
- [ ] Uptime monitoring activated (99.9% SLA target)
- [ ] Performance monitoring dashboard active
- [ ] Database performance monitoring enabled

### Documentation
- [ ] README.md complete and current
- [ ] SECURITY.md reviewed and published
- [ ] API documentation complete
- [ ] Architecture documentation available
- [ ] Runbook for common issues created
- [ ] Emergency contact information provided
- [ ] Deployment procedures documented

---

## Environment Variables Setup

Copy the `.env.example` file to `.env.local` and fill in all required values:

```bash
# Copy template
cp .env.example .env.local

# Then edit with your values
nano .env.local
```

### Required Environment Variables

**Database:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Blockchain:**
```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ARENA_TOKEN_ADDRESS=0x3b855F88CB93aA642EaEB13F59987C552Fc614b5
NEXT_PUBLIC_ARENA_CHAMPION_ADDRESS=0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A
NEXT_PUBLIC_ARENA_BATTLE_ADDRESS=0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF
NEXT_PUBLIC_ARENA_PVP_ADDRESS=0xd0C4Af12E95f9590e7314D079C58597771E57533
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E
```

**Authentication:**
```env
NEXT_PUBLIC_SIWE_DOMAIN=arenagamefi.com
NEXT_PUBLIC_SIWE_ORIGIN=https://arenagamefi.com
JWT_SECRET=your-secure-random-string-min-32-chars
NEXT_PUBLIC_ADMIN_ADDRESSES=0xAdminAddress1,0xAdminAddress2
```

**Monitoring:**
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token
```

**Optional (for AI features):**
```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Staging Deployment (Test Environment)

### 1. Deploy to Staging
```bash
# Create a staging environment in Vercel
# Go to Vercel Dashboard → Settings → Environments

# Deploy to staging branch
git checkout -b staging
git push origin staging

# Vercel automatically deploys to preview URL
```

### 2. Run Integration Tests
```bash
# Test all critical user flows
npm run test:integration

# Test smart contract interactions
npm run test:contracts

# Test API endpoints
npm run test:api
```

### 3. Security Validation
```bash
# Audit dependencies
npm audit

# Security scanning
npx snyk test

# Check for secrets
npx detect-secrets scan
```

### 4. Performance Testing
```bash
# Build analysis
npm run build
npm run analyze

# Lighthouse testing
npm run test:lighthouse
```

### 5. Manual Testing Checklist
- [ ] Complete user journey from signup to battle
- [ ] Wallet connection (MetaMask, WalletConnect)
- [ ] SIWE authentication flow
- [ ] Profile creation and editing
- [ ] Champion purchase and management
- [ ] Battle start and completion
- [ ] Marketplace listing and purchasing
- [ ] Staking functionality
- [ ] Admin functions (collection creation, etc.)
- [ ] All API endpoints responding
- [ ] Database queries returning correct data
- [ ] Blockchain transactions simulating correctly

---

## Production Deployment

### 1. Create Release Branch
```bash
# Create production release branch
git checkout -b release/v1.0.0

# Update version in package.json if using semantic versioning
npm version major  # or minor, patch

git push origin release/v1.0.0
```

### 2. Deploy to Production
```bash
# Merge release branch to main
git checkout main
git merge release/v1.0.0

# Push to main (triggers Vercel production deployment)
git push origin main

# Create release tag
git tag -a v1.0.0 -m "Production deployment"
git push origin v1.0.0
```

### 3. Verify Production Deployment
```bash
# Check deployment status
vercel status

# Verify all pages loading
curl -I https://arenagamefi.com

# Test API health
curl https://arenagamefi.com/api/health

# Check critical endpoints
curl https://arenagamefi.com/api/champions
curl https://arenagamefi.com/api/leaderboard
```

### 4. Post-Deployment Validation
- [ ] All pages load without errors
- [ ] No console errors in browser
- [ ] APIs responding with correct data
- [ ] Database queries working
- [ ] Blockchain connections active
- [ ] Analytics receiving events
- [ ] Error tracking active
- [ ] Monitoring dashboards showing data

### 5. Monitor First 48 Hours
- [ ] Error rate remains near 0%
- [ ] API latency within acceptable range
- [ ] Database performance stable
- [ ] User signups/activity as expected
- [ ] Blockchain transactions succeeding
- [ ] No memory leaks or performance degradation
- [ ] Email notifications (if applicable) working

---

## Key Features & Pages

### Player Pages (Public)

1. **Homepage** (`/`) - Hero section with game overview, feature showcase, stats
2. **Champions** (`/champions`) - User's NFT collection management
3. **Battle Arena** (`/battle`) - Play against AI opponents, earn rewards
4. **PVP Battles** (`/pvp`) - Challenge other players with wagers
5. **Marketplace** (`/marketplace`) - Buy/sell champion NFTs
6. **Staking** (`/staking`) - Stake ARENA tokens for rewards
7. **Leaderboard** (`/leaderboard`) - Global rankings and stats

### Admin Pages (Wallet-Gated)

1. **Admin Dashboard** (`/admin`) - Collections overview and analytics
2. **Create Collection** (`/admin/create-collection`) - Trait-based NFT collection creation
3. **NFT Generator** (`/admin/generate/[id]`) - Fal AI + Pinata NFT generation and upload

---

## Smart Contract Integration

All pages integrate with the deployed Base contracts:

- **ArenaMarketplace**: 0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E
- **ArenaToken**: 0x3b855F88CB93aA642EaEB13F59987C552Fc614b5
- **ArenaChampion**: 0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A
- **ArenaBattle**: 0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF
- **ArenaPVP**: 0xd0C4Af12E95f9590e7314D079C58597771E57533

Contract interaction via ethers.js v6 with proper wallet connection and MetaMask integration.

---

## NFT Factory Workflow

### 1. Create Collection
- Define traits (Class, Rarity, etc.)
- Set max supply and royalty percentage
- Configure metadata

### 2. Generate NFTs
- Input desired quantity
- Fal AI generates unique champion images
- Metadata automatically created
- Upload to IPFS via Pinata

### 3. Deploy & Mint
- Deploy ERC-721 contract on Base
- Batch mint generated NFTs
- Auto-list in marketplace

---

## Deployment to Vercel

### Build
```bash
npm run build
```

### Deploy
```bash
vercel deploy
```

### Production URL
Your deployment will be at: `https://your-project.vercel.app`

---

## Testing Checklist

- [ ] Homepage loads with all features visible
- [ ] Wallet connect button works
- [ ] Navigation between all pages works
- [ ] Marketplace displays listings
- [ ] Battle page shows selection interface
- [ ] PVP page shows challenges
- [ ] Staking page displays tiers
- [ ] Leaderboard displays rankings
- [ ] Admin dashboard requires wallet auth
- [ ] Collection creation form works
- [ ] NFT generation simulates properly

---

## Performance Optimization

- React Compiler enabled (next.config.js)
- Image optimization via Next.js
- Tailwind CSS for minimal bundle size
- SWR for efficient data fetching
- Dark theme optimized for reduced strain

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- MetaMask extension required for transactions

---

## Future Enhancements

- Real blockchain transactions via contract ABIs
- Real NFT minting and marketplace trading
- Tournament system integration
- Streaming rewards mechanism
- DAO governance features
- Custom trait image composition
- Batch collection deployment

---

## Support & Troubleshooting

### Wallet Connection Issues
- Ensure MetaMask is installed
- Switch to Base network (chain ID: 8453)
- Clear browser cache and reconnect

### Generation Failures
- Verify Pinata JWT is valid
- Check Fal AI API key configuration
- Ensure sufficient IPFS storage quota

### Contract Errors
- Verify contract addresses in .env.local
- Ensure wallet has sufficient ETH for gas
- Check Base RPC endpoint availability

---

## Rollback & Recovery

### Emergency Rollback
If critical issues occur in production:

```bash
# Immediate rollback to previous deployment
vercel rollback

# Or redeploy specific commit
git checkout [previous-commit-hash]
git push origin main --force-with-lease
```

### 24-Hour Incident Procedure
1. **Incident Detection** (0-5 min)
   - Monitor alerts detect issue
   - On-call engineer notified
   - Team assembled for response

2. **Initial Response** (5-15 min)
   - Root cause identification
   - Severity assessment
   - Rollback if necessary
   - Stakeholders notified

3. **Hotfix Development** (15-60 min)
   - Fix implemented and tested
   - Code reviewed and approved
   - Deployed to production
   - Verified working

4. **Post-Incident** (60+ min)
   - Root cause analysis documented
   - Preventative measures identified
   - Team retrospective scheduled
   - Status page updated

### Data Recovery
If database corruption occurs:

```bash
# Restore from automated backup
# Supabase Settings → Backups → Download/Restore

# Verify restored data
npx supabase db pull

# Re-run migrations if needed
npx supabase migration up
```

---

## Monitoring & Alerting

### Critical Metrics to Monitor
- **Error Rate**: Should be < 0.1%
- **API Latency**: P95 < 500ms
- **Database Latency**: P95 < 200ms
- **Uptime**: 99.9% target
- **Memory Usage**: Should not continuously grow
- **Blockchain Gas Prices**: Alert if > 100 gwei

### Alert Thresholds
```
- Error rate > 1% → Critical
- API latency P95 > 1000ms → High
- Database > 80% capacity → High
- Blockchain node down → Critical
- Deployment failure → Critical
```

### Monitoring Tools
- **Vercel Analytics**: Real-time metrics
- **Sentry**: Error tracking
- **Database Dashboard**: Supabase admin panel
- **Custom Health Checks**: `/api/health` endpoint
- **Uptime Monitoring**: UptimeRobot or similar

---

## Launch Day Procedures

### 2 Hours Before Launch
- [ ] Team synch-up meeting
- [ ] All systems health check
- [ ] Verify production environment parity
- [ ] Test critical user flows one final time
- [ ] Brief support team on common issues
- [ ] Prepare incident response team
- [ ] Enable enhanced monitoring and alerting
- [ ] Prepare announcement communications

### At Launch Time
- [ ] Deploy to production
- [ ] Verify all pages loading
- [ ] Test key user flows
- [ ] Monitor error logs in real-time
- [ ] Check analytics data ingestion
- [ ] Verify blockchain transactions working
- [ ] Post launch announcement

### 1 Hour After Launch
- [ ] Verify system stability
- [ ] Review error logs (should be minimal)
- [ ] Check user signup/activity rates
- [ ] Monitor social media feedback
- [ ] Respond to initial user issues
- [ ] Confirm email notifications working
- [ ] Check leaderboard/rankings calculations

### 24 Hours After Launch
- [ ] Comprehensive system sanity check
- [ ] Analyze all collected logs
- [ ] Review user behavior patterns
- [ ] Check blockchain event logs
- [ ] Document any issues encountered
- [ ] Plan follow-up improvements
- [ ] Consider any hotfixes needed

---

## Maintenance & Updates

### Regular Maintenance Schedule
- **Daily**: Monitor logs and metrics
- **Weekly**: Update dependencies, security patches
- **Monthly**: Full security audit, performance review
- **Quarterly**: Architecture review, capacity planning
- **Annually**: Comprehensive audit, strategic planning

### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Major version upgrades (test first!)
npm install next@latest

# After updates, test thoroughly
npm run test
npm run build
```

### Database Maintenance
```bash
# Analyze table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Vacuum to optimize
VACUUM ANALYZE;

# Monitor slow queries
-- Enable query logging in Supabase
```

---

## Troubleshooting Guide

### Common Issues & Solutions

**Wallet Connection Fails**
- Verify MetaMask/WalletConnect installed
- Check network is set to Base (Chain ID: 8453)
- Clear browser cache and cookies
- Ensure wallet has some ETH for gas

**Database Timeout**
- Check Supabase dashboard for performance
- Review slow query logs
- Verify network connectivity
- Consider connection pooling

**Smart Contract Errors**
- Verify contract address in code
- Check ABI matches deployed contract
- Ensure wallet has sufficient gas
- Review contract state on Etherscan

**Performance Degradation**
- Check database query performance
- Review API response times
- Monitor memory usage
- Check for memory leaks in browser DevTools

---

## Performance Optimization Tips

### Frontend Optimization
- Use Next.js Image component for all images
- Enable Static Generation (SSG) where possible
- Implement Incremental Static Regeneration (ISR)
- Code split large pages
- Use dynamic imports for heavy components

### Backend Optimization
- Index frequently queried columns
- Use database connection pooling
- Implement response caching with SWR
- Optimize database queries (EXPLAIN ANALYZE)
- Use API route compression

### Monitoring Performance
```bash
# Local testing
npm run build
npm run analyze

# After deployment
# Check Vercel Analytics dashboard
# Monitor Core Web Vitals
# Review Lighthouse scores
```

---

## Support & Escalation

### Support Channels
- **Email**: support@arenagamefi.com
- **Discord**: Link to community server
- **Twitter**: @arenagamefi
- **GitHub Issues**: For technical bug reports

### Escalation Path
1. First Response: Support team (< 2 hours)
2. Technical Investigation: Engineering team (< 4 hours)
3. Hotfix Deployment: Lead engineer (< 1 hour if critical)
4. Post-Incident Review: Full team (within 24 hours)

---

## License & Credits

Built with:
- Next.js 16 with React 19.2
- Tailwind CSS 4
- ethers.js v6
- TypeScript
- Supabase (PostgreSQL)
- Base Blockchain
- Vercel Hosting
