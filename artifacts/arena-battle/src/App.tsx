import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

// Pages
import { Home } from "@/pages/Home";
import { Mint } from "@/pages/Mint";
import { Battle } from "@/pages/Battle";
import { Leaderboard } from "@/pages/Leaderboard";
import { Profile } from "@/pages/Profile";

// Web3 Setup
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Arena Battle',
  projectId: 'arena-battle-replit', // Placeholder Project ID
  chains: [base],
  ssr: false, 
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mint" component={Mint} />
      <Route path="/battle" component={Battle} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: 'hsl(184, 100%, 50%)', // neon cyan
          accentColorForeground: 'black',
          borderRadius: 'none',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Layout>
                <Router />
              </Layout>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
