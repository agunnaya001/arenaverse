export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              ArenaGameFi ("we," "us," "our," or "Company") operates the ArenaGameFi platform. This Privacy Policy explains our data collection, use, and protection practices. By using our platform, you consent to our privacy practices outlined in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">Wallet Information</h3>
            <p className="text-muted-foreground mb-4">
              When you connect your Web3 wallet (MetaMask, WalletConnect, etc.), we collect your public wallet address. We do NOT store private keys, seed phrases, or other sensitive wallet information.
            </p>

            <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
            <p className="text-muted-foreground mb-4">
              You may voluntarily provide information such as:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Username</li>
              <li>Biography</li>
              <li>Profile picture</li>
              <li>Guild membership</li>
              <li>Tournament participation</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We automatically collect information about your interactions with the platform:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Battle statistics and results</li>
              <li>Champion selections and upgrades</li>
              <li>Marketplace transactions</li>
              <li>Staking activities</li>
              <li>AI Studio contract deployments</li>
              <li>IP address and device information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Provide and improve platform services</li>
              <li>Maintain account security through SIWE authentication</li>
              <li>Process smart contract transactions</li>
              <li>Calculate rewards and XP distribution</li>
              <li>Generate leaderboards and rankings</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Send service announcements (if opted-in)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>HTTPS encryption for all connections</li>
              <li>Row-Level Security (RLS) on database tables</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Regular security audits</li>
              <li>Secure API authentication</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              However, no security system is impenetrable. We cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your data as long as your account is active or as needed to provide services. You may request deletion of your account and associated data, subject to legal requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">6. Blockchain Transparency</h2>
            <p className="text-muted-foreground mb-4">
              All blockchain transactions are permanent and publicly visible on the Base network. Your wallet address and transaction history are accessible to anyone. We do not control blockchain data visibility.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              Our platform integrates with third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Supabase (database and authentication)</li>
              <li>Base blockchain network</li>
              <li>Wallet providers (MetaMask, WalletConnect)</li>
              <li>Vercel (hosting and analytics)</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              These services have their own privacy policies. We recommend reviewing them.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain data collection</li>
              <li>Data portability</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise these rights, contact us at privacy@arenagamefi.com
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">9. Policy Updates</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy periodically. Changes become effective immediately upon posting. Your continued use of the platform constitutes acceptance of updates.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy inquiries: privacy@arenagamefi.com
            </p>
          </div>

          <div className="border-t border-border pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: June 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
