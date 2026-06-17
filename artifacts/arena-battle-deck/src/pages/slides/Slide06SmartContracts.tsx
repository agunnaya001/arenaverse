const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide06SmartContracts() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid flex flex-row"
      style={{ background: "#080c14" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      {/* Left: header */}
      <div
        className="flex flex-col justify-center"
        style={{
          width: "36%",
          paddingLeft: "7vw",
          paddingRight: "4vw",
          paddingTop: "8vh",
          paddingBottom: "8vh",
          borderRight: "0.15vh solid #1e2a40",
        }}
      >
        <p
          className={`font-body uppercase tracking-widest ${a(0)}`}
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          On-Chain
        </p>
        <h2
          className={`font-display title-underline text-primary ${a(1)}`}
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1, marginBottom: "3vh" }}
        >
          SMART CONTRACTS
        </h2>
        <p
          className={`font-body ${a(2)}`}
          style={{ fontSize: "3vw", color: "var(--slide-muted)", lineHeight: 1.4 }}
        >
          Five contracts deployed on Base Mainnet — all verified on BaseScan.
        </p>

        <div
          className={`${a(3)}`}
          style={{
            marginTop: "5vh",
            padding: "2vh 2.5vw",
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            borderLeft: "0.4vw solid var(--slide-accent)",
          }}
        >
          <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
            Network
          </p>
          <p className="font-display font-bold" style={{ fontSize: "3.5vw", color: "var(--slide-accent)" }}>
            Base Mainnet
          </p>
        </div>
      </div>

      {/* Right: contract list */}
      <div
        className="flex flex-col justify-center"
        style={{ flex: 1, paddingLeft: "5vw", paddingRight: "7vw", paddingTop: "8vh", paddingBottom: "8vh", gap: "2.5vh" }}
      >
        {/* ArenaFighter */}
        <div
          className={`flex items-center ${a(1)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2.2vh 2.5vw",
            gap: "2vw",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              alignSelf: "stretch",
              background: "var(--slide-accent)",
              borderRadius: "0.3vw",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-display font-bold text-primary" style={{ fontSize: "3.2vw" }}>
              ArenaFighter
            </p>
            <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
              ERC-721 NFT fighter collection
            </p>
          </div>
          <span
            className="font-body font-semibold"
            style={{ fontSize: "2.2vw", color: "var(--slide-accent)", background: "rgba(0,200,160,0.1)", padding: "0.4vh 1vw", borderRadius: "0.5vw" }}
          >
            ERC-721
          </span>
        </div>

        {/* ArenaToken */}
        <div
          className={`flex items-center ${a(2)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2.2vh 2.5vw",
            gap: "2vw",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              alignSelf: "stretch",
              background: "var(--slide-accent2)",
              borderRadius: "0.3vw",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-display font-bold text-primary" style={{ fontSize: "3.2vw" }}>
              ArenaToken
            </p>
            <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
              ERC-20 in-game currency
            </p>
          </div>
          <span
            className="font-body font-semibold"
            style={{ fontSize: "2.2vw", color: "var(--slide-accent2)", background: "rgba(240,162,42,0.1)", padding: "0.4vh 1vw", borderRadius: "0.5vw" }}
          >
            ERC-20
          </span>
        </div>

        {/* BattleArena */}
        <div
          className={`flex items-center ${a(3)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2.2vh 2.5vw",
            gap: "2vw",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              alignSelf: "stretch",
              background: "var(--slide-accent)",
              borderRadius: "0.3vw",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-display font-bold text-primary" style={{ fontSize: "3.2vw" }}>
              BattleArena
            </p>
            <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
              On-chain PvP battle resolution
            </p>
          </div>
          <span
            className="font-body font-semibold"
            style={{ fontSize: "2.2vw", color: "var(--slide-accent)", background: "rgba(0,200,160,0.1)", padding: "0.4vh 1vw", borderRadius: "0.5vw" }}
          >
            Core
          </span>
        </div>

        {/* StakingVault */}
        <div
          className={`flex items-center ${a(4)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2.2vh 2.5vw",
            gap: "2vw",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              alignSelf: "stretch",
              background: "var(--slide-accent2)",
              borderRadius: "0.3vw",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-display font-bold text-primary" style={{ fontSize: "3.2vw" }}>
              StakingVault
            </p>
            <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
              Token staking and reward distribution
            </p>
          </div>
          <span
            className="font-body font-semibold"
            style={{ fontSize: "2.2vw", color: "var(--slide-accent2)", background: "rgba(240,162,42,0.1)", padding: "0.4vh 1vw", borderRadius: "0.5vw" }}
          >
            Vault
          </span>
        </div>

        {/* Leaderboard */}
        <div
          className={`flex items-center ${a(5)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2.2vh 2.5vw",
            gap: "2vw",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              alignSelf: "stretch",
              background: "var(--slide-accent)",
              borderRadius: "0.3vw",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p className="font-display font-bold text-primary" style={{ fontSize: "3.2vw" }}>
              Leaderboard
            </p>
            <p className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>
              Persistent on-chain ranking system
            </p>
          </div>
          <span
            className="font-body font-semibold"
            style={{ fontSize: "2.2vw", color: "var(--slide-accent)", background: "rgba(0,200,160,0.1)", padding: "0.4vh 1vw", borderRadius: "0.5vw" }}
          >
            Rank
          </span>
        </div>
      </div>
    </div>
  );
}
