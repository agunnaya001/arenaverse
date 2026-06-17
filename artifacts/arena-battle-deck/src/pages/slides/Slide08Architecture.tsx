const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide08Architecture() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid flex flex-col"
      style={{ background: "#080c14", paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      <div className={`${a(0)}`} style={{ marginBottom: "5vh" }}>
        <p
          className="font-body uppercase tracking-widest"
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          System Design
        </p>
        <h2
          className="font-display title-underline text-primary"
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1 }}
        >
          ARCHITECTURE
        </h2>
      </div>

      {/* Three-tier diagram */}
      <div className="flex flex-row flex-1 items-center" style={{ gap: "0" }}>
        {/* Tier 1: Browser */}
        <div
          className={`flex flex-col flex-1 ${a(1)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "1vw 0 0 1vw",
            padding: "3.5vh 2.5vw",
            borderLeft: "0.4vw solid var(--slide-accent)",
            height: "55vh",
          }}
        >
          <p className="font-body uppercase tracking-widest" style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.25em", marginBottom: "2vh" }}>
            Browser
          </p>
          <p className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "3vh" }}>
            Frontend
          </p>
          <div className="flex flex-col" style={{ gap: "1.5vh" }}>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>React + Vite</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Three.js / R3F</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>wagmi + RainbowKit</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Telegram Mini App</span>
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div
          className={`flex flex-col items-center justify-center ${a(2)}`}
          style={{ padding: "0 1.5vw", zIndex: 1 }}
        >
          <div style={{ width: "5vw", height: "0.3vh", background: "var(--slide-accent)", position: "relative" }}>
            <div style={{
              position: "absolute",
              right: "-0.5vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "0.8vh solid transparent",
              borderBottom: "0.8vh solid transparent",
              borderLeft: "1.2vw solid var(--slide-accent)",
            }} />
          </div>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent)", marginTop: "1vh", letterSpacing: "0.05em" }}>
            REST API
          </span>
        </div>

        {/* Tier 2: API Server */}
        <div
          className={`flex flex-col flex-1 ${a(2)}`}
          style={{
            background: "#0c1830",
            padding: "3.5vh 2.5vw",
            borderTop: "0.3vh solid #1e2a40",
            borderBottom: "0.3vh solid #1e2a40",
            height: "55vh",
          }}
        >
          <p className="font-body uppercase tracking-widest" style={{ fontSize: "2vw", color: "var(--slide-accent2)", letterSpacing: "0.25em", marginBottom: "2vh" }}>
            Server
          </p>
          <p className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "3vh" }}>
            API Layer
          </p>
          <div className="flex flex-col" style={{ gap: "1.5vh" }}>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent2)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Express.js</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent2)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>PostgreSQL</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent2)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Battle indexer</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent2)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Leaderboard API</span>
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div
          className={`flex flex-col items-center justify-center ${a(3)}`}
          style={{ padding: "0 1.5vw", zIndex: 1 }}
        >
          <div style={{ width: "5vw", height: "0.3vh", background: "var(--slide-accent)", position: "relative" }}>
            <div style={{
              position: "absolute",
              right: "-0.5vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "0.8vh solid transparent",
              borderBottom: "0.8vh solid transparent",
              borderLeft: "1.2vw solid var(--slide-accent)",
            }} />
          </div>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent)", marginTop: "1vh", letterSpacing: "0.05em" }}>
            RPC / Events
          </span>
        </div>

        {/* Tier 3: Blockchain */}
        <div
          className={`flex flex-col flex-1 ${a(3)}`}
          style={{
            background: "linear-gradient(160deg, #0a1a14 0%, #0e1525 100%)",
            borderRadius: "0 1vw 1vw 0",
            padding: "3.5vh 2.5vw",
            borderRight: "0.4vw solid var(--slide-accent)",
            height: "55vh",
          }}
        >
          <p className="font-body uppercase tracking-widest" style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.25em", marginBottom: "2vh" }}>
            Blockchain
          </p>
          <p className="font-display font-bold" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "3vh", color: "var(--slide-accent)" }}>
            Base Mainnet
          </p>
          <div className="flex flex-col" style={{ gap: "1.5vh" }}>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>ArenaFighter NFT</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>ArenaToken ERC-20</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>BattleArena logic</span>
            </div>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "var(--slide-accent)", flexShrink: 0 }} />
              <span className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}>Staking + Ranking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
