const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide09Closing() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center dot-grid"
      style={{ background: "linear-gradient(160deg, #080c14 60%, #0b1420 100%)" }}
    >
      {/* Corner accent lines */}
      <div
        className="absolute top-0 left-0"
        style={{ width: "12vw", height: "0.4vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute top-0 left-0"
        style={{ width: "0.4vh", height: "12vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{ width: "12vw", height: "0.4vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{ width: "0.4vh", height: "12vh", background: "var(--slide-accent)" }}
      />

      <div className="flex flex-col items-center" style={{ gap: "1.5vh" }}>
        <p
          className={`font-body uppercase tracking-widest ${a(0)}`}
          style={{ fontSize: "2vw", color: "var(--slide-muted)", letterSpacing: "0.4em", marginBottom: "2vh" }}
        >
          Arena Battle
        </p>

        <h2
          className={`font-display text-primary ${a(1)}`}
          style={{ fontSize: "8vw", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em" }}
        >
          ENTER THE
        </h2>
        <h1
          className={`font-display ${a(2)}`}
          style={{ fontSize: "14vw", fontWeight: 800, lineHeight: 0.85, color: "var(--slide-accent)", letterSpacing: "-0.03em" }}
        >
          ARENA
        </h1>

        <div
          className={`${a(3)}`}
          style={{ width: "8vw", height: "0.4vh", background: "var(--slide-accent)", margin: "3vh 0" }}
        />

        {/* Three badges */}
        <div className={`flex flex-row items-center ${a(4)}`} style={{ gap: "4vw" }}>
          <div
            style={{
              padding: "1.5vh 2.5vw",
              background: "rgba(0,200,160,0.08)",
              border: "0.15vh solid rgba(0,200,160,0.3)",
              borderRadius: "0.8vw",
            }}
          >
            <p className="font-body text-center" style={{ fontSize: "2.5vw", color: "var(--slide-accent)", fontWeight: 600 }}>
              Live on Base Mainnet
            </p>
          </div>
          <div
            style={{
              padding: "1.5vh 2.5vw",
              background: "rgba(240,162,42,0.08)",
              border: "0.15vh solid rgba(240,162,42,0.3)",
              borderRadius: "0.8vw",
            }}
          >
            <p className="font-body text-center" style={{ fontSize: "2.5vw", color: "var(--slide-accent2)", fontWeight: 600 }}>
              Telegram Mini App
            </p>
          </div>
          <div
            style={{
              padding: "1.5vh 2.5vw",
              background: "rgba(0,200,160,0.08)",
              border: "0.15vh solid rgba(0,200,160,0.3)",
              borderRadius: "0.8vw",
            }}
          >
            <p className="font-body text-center" style={{ fontSize: "2.5vw", color: "var(--slide-accent)", fontWeight: 600 }}>
              MIT License
            </p>
          </div>
        </div>

        <p
          className={`font-body ${a(5)}`}
          style={{ fontSize: "2.6vw", color: "var(--slide-muted)", marginTop: "2vh", letterSpacing: "0.06em" }}
        >
          Mint your fighter · Enter the queue · Claim glory
        </p>
      </div>
    </div>
  );
}
