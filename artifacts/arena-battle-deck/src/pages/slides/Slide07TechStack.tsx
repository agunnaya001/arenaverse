const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide07TechStack() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid flex flex-col"
      style={{ background: "#080c14", paddingLeft: "8vw", paddingRight: "8vw", paddingTop: "7vh", paddingBottom: "7vh" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      {/* Large watermark */}
      <div
        className="absolute right-0 top-0 font-display font-bold select-none pointer-events-none"
        style={{
          fontSize: "28vw",
          color: "#0e1525",
          lineHeight: 1,
          right: "-2vw",
          top: "-2vh",
          letterSpacing: "-0.05em",
        }}
      >
        07
      </div>

      <div className={`${a(0)}`} style={{ marginBottom: "4vh" }}>
        <p
          className="font-body uppercase tracking-widest"
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          Stack
        </p>
        <h2
          className="font-display title-underline text-primary"
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1 }}
        >
          TECH STACK
        </h2>
      </div>

      <div className="flex flex-col" style={{ gap: "2.2vh", position: "relative", zIndex: 1 }}>
        {/* Frontend */}
        <div
          className={`flex items-center ${a(1)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2vh 2.5vw",
            gap: "3vw",
          }}
        >
          <span className="font-body font-semibold shrink-0" style={{ fontSize: "2.5vw", color: "var(--slide-muted)", width: "14vw" }}>
            Frontend
          </span>
          <div style={{ width: "0.15vh", alignSelf: "stretch", background: "#1e2a40" }} />
          <div className="flex flex-row" style={{ gap: "1.5vw", flexWrap: "wrap" }}>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>React</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>Vite</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-accent)" }}>Three.js</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>Framer Motion</span>
          </div>
        </div>

        {/* Wallet */}
        <div
          className={`flex items-center ${a(2)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2vh 2.5vw",
            gap: "3vw",
          }}
        >
          <span className="font-body font-semibold shrink-0" style={{ fontSize: "2.5vw", color: "var(--slide-muted)", width: "14vw" }}>
            Wallet
          </span>
          <div style={{ width: "0.15vh", alignSelf: "stretch", background: "#1e2a40" }} />
          <div className="flex flex-row" style={{ gap: "1.5vw", flexWrap: "wrap" }}>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-accent2)" }}>wagmi 2.x</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-accent2)" }}>RainbowKit</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>viem</span>
          </div>
        </div>

        {/* Contracts */}
        <div
          className={`flex items-center ${a(3)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2vh 2.5vw",
            gap: "3vw",
          }}
        >
          <span className="font-body font-semibold shrink-0" style={{ fontSize: "2.5vw", color: "var(--slide-muted)", width: "14vw" }}>
            Contracts
          </span>
          <div style={{ width: "0.15vh", alignSelf: "stretch", background: "#1e2a40" }} />
          <div className="flex flex-row" style={{ gap: "1.5vw", flexWrap: "wrap" }}>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>Solidity</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-accent)" }}>Hardhat</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>OpenZeppelin</span>
          </div>
        </div>

        {/* Backend */}
        <div
          className={`flex items-center ${a(4)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "0.8vw",
            padding: "2vh 2.5vw",
            gap: "3vw",
          }}
        >
          <span className="font-body font-semibold shrink-0" style={{ fontSize: "2.5vw", color: "var(--slide-muted)", width: "14vw" }}>
            Backend
          </span>
          <div style={{ width: "0.15vh", alignSelf: "stretch", background: "#1e2a40" }} />
          <div className="flex flex-row" style={{ gap: "1.5vw", flexWrap: "wrap" }}>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>Express</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-accent2)" }}>PostgreSQL</span>
            <span className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)" }}>·</span>
            <span className="font-body font-semibold" style={{ fontSize: "3vw", color: "var(--slide-primary)" }}>TypeScript</span>
          </div>
        </div>

        {/* Chain */}
        <div
          className={`flex items-center ${a(5)}`}
          style={{
            background: "linear-gradient(90deg, rgba(0,200,160,0.08) 0%, var(--slide-surface) 100%)",
            borderRadius: "0.8vw",
            padding: "2vh 2.5vw",
            gap: "3vw",
            border: "0.15vh solid rgba(0,200,160,0.2)",
          }}
        >
          <span className="font-body font-semibold shrink-0" style={{ fontSize: "2.5vw", color: "var(--slide-muted)", width: "14vw" }}>
            Chain
          </span>
          <div style={{ width: "0.15vh", alignSelf: "stretch", background: "rgba(0,200,160,0.3)" }} />
          <span className="font-display font-bold" style={{ fontSize: "3.5vw", color: "var(--slide-accent)" }}>
            Base Mainnet
          </span>
        </div>
      </div>
    </div>
  );
}
