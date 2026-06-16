# ArenaVerse Component Library

Complete reference for all reusable React components in the ArenaVerse application.

## Table of Contents

1. [UI Components](#ui-components)
2. [Feature Components](#feature-components)
3. [Page Components](#page-components)
4. [Usage Patterns](#usage-patterns)

---

## UI Components

### shadcn/ui Base Components

These components are from the shadcn/ui library and are used throughout the application.

#### Layout & Structure
- **Card** - Container component with header, content, footer
- **Tabs** - Tabbed interface for organizing content
- **Dialog** - Modal dialog component
- **Alert** - Alert notification component
- **Breadcrumb** - Navigation breadcrumb component

#### Form Controls
- **Button** - Action button with variants (primary, outline, ghost, etc.)
- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Select** - Dropdown select menu
- **Checkbox** - Checkbox control
- **RadioGroup** - Radio button group

#### Data Display
- **Badge** - Label/badge component
- **Progress** - Progress bar component
- **Skeleton** - Loading skeleton component
- **Table** - Data table component
- **Chart** - Recharts wrapper components (LineChart, BarChart, etc.)

### Custom UI Components

#### ContractEditor
Display and interact with generated smart contract code.

```tsx
import { ContractEditor } from '@/components/contract-editor';

<ContractEditor
  code={solidityCode}
  contractType="ERC20"
  contractName="MyToken"
  onCopy={() => console.log('copied')}
  onDownload={() => console.log('downloaded')}
/>
```

**Props:**
- `code: string` - Solidity contract code
- `contractType: string` - Type of contract (ERC20, ERC721, etc.)
- `contractName: string` - Name of the contract
- `onCopy?: () => void` - Callback when code is copied
- `onDownload?: () => void` - Callback when code is downloaded

#### DeploymentWizard
Multi-step deployment wizard for smart contracts.

```tsx
import { DeploymentWizard } from '@/components/deployment-wizard';

<DeploymentWizard
  title="Deploy NFT Contract"
  description="Follow the steps to deploy your contract"
  onDeploy={() => console.log('deploying')}
/>
```

**Props:**
- `title: string` - Wizard title
- `description: string` - Wizard description
- `onDeploy?: () => void` - Callback when deploy is initiated

---

## Feature Components

### GuildCard
Display a guild with stats and action buttons.

```tsx
import { GuildCard } from '@/components/guild-card';

<GuildCard
  id="guild-123"
  name="Dragon Slayers"
  description="Elite PvP guild"
  memberCount={45}
  treasuryBalance={150000}
  level={8}
  onJoin={() => console.log('joined')}
  onView={() => console.log('viewing')}
/>
```

**Props:**
- `id: string` - Guild ID
- `name: string` - Guild name
- `description?: string` - Guild description
- `memberCount: number` - Number of members
- `treasuryBalance: number` - Treasury in tokens
- `level: number` - Guild level
- `onJoin?: () => void` - Join button callback
- `onView?: () => void` - View details callback

### TournamentCard
Display a tournament with participant info and prize pool.

```tsx
import { TournamentCard } from '@/components/tournament-card';

<TournamentCard
  id="tournament-123"
  name="Spring PvP Championship"
  description="Regional PvP tournament"
  participantCount={32}
  maxParticipants={64}
  prizePool={50000}
  status="active"
  startDate={new Date().toISOString()}
  onJoin={() => console.log('joined')}
  onView={() => console.log('viewing')}
/>
```

**Props:**
- `id: string` - Tournament ID
- `name: string` - Tournament name
- `description?: string` - Tournament description
- `participantCount: number` - Current participants
- `maxParticipants: number` - Max allowed participants
- `prizePool: number` - Total prize pool in tokens
- `status: 'upcoming' | 'active' | 'completed'` - Tournament status
- `startDate: string` - ISO date string
- `onJoin?: () => void` - Join button callback
- `onView?: () => void` - View details callback

### ChampionCard
Display a champion NFT with stats and actions.

```tsx
import { ChampionCard } from '@/components/champion-card';

<ChampionCard
  id="champion-123"
  name="FireDragon"
  class="Warrior"
  rarity="Legendary"
  level={15}
  health={250}
  attack={85}
  defense={70}
  speed={45}
  imageUrl="/champions/firedragon.png"
/>
```

### BattleSimulator
Interactive battle simulator component.

```tsx
import { BattleSimulator } from '@/components/battle-simulator';

<BattleSimulator
  playerChampion={championData}
  enemyChampion={enemyData}
  onBattleComplete={(winner) => console.log(winner)}
/>
```

### StatsCard
Display key statistics in a card format.

```tsx
import { StatsCard } from '@/components/stats-card';

<StatsCard
  icon={<Trophy className="w-6 h-6" />}
  label="Win Rate"
  value="73.5%"
  change="+5.2%"
  positive
/>
```

---

## Page Components

### Dashboard
`/app/dashboard/page.tsx` - Main dashboard with stats and analytics

**Features:**
- Personal player stats (level, XP, ranking)
- Network-wide statistics
- Player leaderboard
- Analytics charts (players over time, battles/rewards)

### AI Studio
`/app/ai-studio/page.tsx` - Smart contract generator

**Features:**
- Contract type selection (ERC20, ERC721, ERC1155, DAO, Staking)
- AI-powered contract generation
- NFT metadata generator
- Tokenomics calculator
- Live code editor with copy/download

### Launchpad
`/app/launchpad/page.tsx` - Deployment management

**Features:**
- Multi-step deployment wizard
- Deployment history and tracking
- Analytics (success rate, verification status)
- Contract address verification

### Guilds
`/app/guilds/page.tsx` - Guild management and discovery

**Features:**
- Browse and join guilds
- Create new guilds
- Guild statistics and treasury tracking
- Member management

### Tournaments
`/app/tournaments/page.tsx` - Tournament system

**Features:**
- Browse active, upcoming, and completed tournaments
- Tournament participation
- Prize pool information
- Participant tracking

### Ecosystem
`/app/ecosystem/page.tsx` - Ecosystem overview hub

**Features:**
- Quick links to all ecosystem features
- Featured guilds and tournaments
- Recent activity feed
- Referral program info

---

## Usage Patterns

### Component Composition

Combine components to build features:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GuildCard } from '@/components/guild-card';

export function GuildsList() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Guilds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {guilds.map((guild) => (
              <GuildCard
                key={guild.id}
                {...guild}
                onJoin={() => handleJoinGuild(guild.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Props Pattern

Most components follow a consistent props pattern:

- **Display Props**: `name`, `description`, `label`, etc.
- **Data Props**: Numbers, arrays, enums for content
- **Handler Props**: `onChange`, `onClick`, `onSubmit`, etc.
- **Visual Props**: `variant`, `size`, `color` for styling

### Responsive Design

All components are responsive with Tailwind CSS:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

### Loading States

Components support loading states via props:

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Error Handling

Use Alert component for errors:

```tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

### Form Patterns

Build forms with consistent structure:

```tsx
<div className="space-y-4">
  <div>
    <label className="text-sm font-medium mb-2 block">
      Name
    </label>
    <Input
      placeholder="Enter name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>
  
  <div>
    <label className="text-sm font-medium mb-2 block">
      Type
    </label>
    <Select value={type} onValueChange={setType}>
      <SelectTrigger>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <Button onClick={handleSubmit} className="w-full">
    Submit
  </Button>
</div>
```

---

## Component Locations

All custom components are located in `/components/`:

```
components/
├── ui/                          # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── tabs.tsx
│   └── ...
├── contract-editor.tsx          # Contract code display
├── deployment-wizard.tsx        # Deployment flow
├── guild-card.tsx               # Guild display
├── tournament-card.tsx          # Tournament display
├── champion-card.tsx            # Champion NFT
├── battle-simulator.tsx         # Battle UI
├── stats-card.tsx              # Statistics display
├── header.tsx                   # Navigation header
├── splash-screen.tsx            # Loading screen
└── theme-provider.tsx           # Theme configuration
```

---

## Styling

All components use Tailwind CSS for styling with these design tokens:

**Colors:**
- `primary` - Brand color (neon green)
- `accent` - Secondary color (hot pink)
- `background` - Dark background
- `foreground` - Text color
- `muted` - Disabled/inactive states

**Spacing:**
- Use Tailwind spacing scale: `p-2`, `m-4`, `gap-6`, etc.
- Responsive prefixes: `md:`, `lg:`, etc.

**Dark Mode:**
- All components support dark mode via `dark:` prefix
- Dark mode is the primary design theme

---

## Testing Components

Test components in development with:

```bash
npm run dev
# Visit http://localhost:3000
```

Check individual pages:
- Dashboard: `/dashboard`
- AI Studio: `/ai-studio`
- Launchpad: `/launchpad`
- Guilds: `/guilds`
- Tournaments: `/tournaments`

---

## Component Updates

When updating components:

1. Update the component file in `/components/`
2. Update this documentation if props change
3. Test all usages of the component
4. Verify responsive behavior
5. Check dark mode compatibility

---

## Contributing

When adding new components:

1. Create component in `/components/` directory
2. Use TypeScript with full type definitions
3. Export as named export
4. Document props with JSDoc comments
5. Add entry to this COMPONENTS.md file
6. Ensure responsive design with Tailwind
7. Support both light and dark modes

---

**Last Updated**: June 2026  
**Total Components**: 50+  
**UI Library**: shadcn/ui + Tailwind CSS  
**Styling**: Tailwind CSS 4
